import { Component, Injectable } from '@angular/core';
import { AuthLoginEndpointService } from '../../../../endpoints/auth-endpoints/auth-login-endpoint.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MyAuthService } from '../../../../services/auth-services/my-auth.service';
import { CartService } from '../../../../services/cart-services/cart-service';
import { SelectedCarRequest } from '../generateOffers/dto/selectedCarRequest';
import { HttpClient } from '@angular/common/http';
import { CartItem } from '../../../../services/auth-services/dto/cart.model';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'  // Ovdje je ključna linija koja registruje servis globalno
})

@Component({
  selector: 'app-move-to-cart',
  templateUrl: './move-to-cart.component.html',
  styleUrl: './move-to-cart.component.css'
})
export class MoveToCartComponent {
  cartItems: CartItem[] = []; // Tipiziranje niza sa tipom CartItem
  locatonId: any;

  constructor(
    private authLoginService: AuthLoginEndpointService,
    private router: Router,
    private authService: MyAuthService,
    private route: ActivatedRoute,
    public cartService: CartService,
    private http: HttpClient,
    private cookieService: CookieService
  ) {}

  ngOnInit() {
    const accessToken = this.authService.getAccessToken();

    if (accessToken !== null) {
      this.cartService.getCartOptions(accessToken)?.subscribe(
        (response) => {
          response.carOption.forEach((carOne: any) => {
            const item: CartItem = {
              name: carOne.name,
              image: carOne.image,
              pricePerDay: carOne.priceperday,
              vehicleId: Number(carOne.vehicleId),
              locationId: carOne.locationId,
              description: {
                PickUpDate: carOne.pickupdate,
                DropOffDate: carOne.dropoffdate,
                CountDays: this.CountTheDays(carOne.pickupdate, carOne.dropoffdate)
              },
              userId: Number(this.cookieService.get('userId'))
            };

            // Provera da li je već ovaj item u korpi
            const itemExists = this.cartItems.some(cartItem => 
              cartItem.name === item.name &&
              cartItem.description.PickUpDate === item.description.PickUpDate &&
              cartItem.description.DropOffDate === item.description.DropOffDate
            );

            if (!itemExists) {
              // Ako ne postoji, dodaj u korpu
              this.cartService.AddToCart(item);
            } else {
              console.log(`Item "${item.name}" already exists in the cart.`);
            }
          });
        },
        (error) => {
          console.error('Error fetching cart options:', error);
        }
      );
    } else {
      console.error('Access token is null or undefined');
    }

    // Subscribing to cartItems$ to update the cartItems array
    this.cartService.cartItems$.subscribe(items => {
      console.log('Received cart items:', items);  // Debug log
      this.cartItems = items;
    });

    console.log(this.cartItems);
  }

  selectedCar: SelectedCarRequest = {
    name: '',
    vehicleId: 0,
    image: '',
    pricePerDay: 0,
    accessToken: '',
    PickUpDate: '',
    DropOffDate: '',
    locationId: 0,
    userId: 0
  };

  removeFromCart(item: CartItem) {
    this.selectedCar.name = item.name;
    this.selectedCar.vehicleId = Number(item.vehicleId);
    this.selectedCar.image = item.image;
    this.selectedCar.pricePerDay = item.pricePerDay;
    this.selectedCar.PickUpDate = item.description.PickUpDate;
    this.selectedCar.DropOffDate = item.description.DropOffDate;

    this.cartService.deleteFromDatabase(this.selectedCar).subscribe(
      (response) => {
        // Handle successful response
        console.log('Successfully deleted', response);
      },
      (error) => {
        // Handle error
        console.error('An error occurred while deleting', error);
      }
    );
    
    this.cartService.removeFromCart(item);
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;  // Dodeljujemo dobijene stavke u cartItems
    });
  }

  calculateTotal(): number {
    let total = 0;
    this.cartItems.forEach(item => {
      total += item.pricePerDay * item.description.CountDays; // Dodajemo cenu po danu svakog artikla
    });
    return total;
  }
  
  payNow() {
    this.cartService.postCarsToStripe(this.cartItems).subscribe({
      next(response) {
        window.location.href = response.url;
      },
      error(err) {
        console.error('Error creating Stripe checkout session:', err);
        alert('Unable to process the reservation. Please try again.');
      },
    })
  }

  CountTheDays(PickUpDate: string, DropOffDate: string): number {
    const pickUp = new Date(PickUpDate);
    const dropOff = new Date(DropOffDate);
  
    const differenceInTime = dropOff.getTime() - pickUp.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
  
    return differenceInDays;
  }
}
