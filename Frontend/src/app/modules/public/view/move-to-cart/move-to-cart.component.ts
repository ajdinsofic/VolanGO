import { Component, Injectable } from '@angular/core';
import { AuthLoginEndpointService } from '../../../../endpoints/auth-endpoints/auth-login-endpoint.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MyAuthService } from '../../../../services/auth-services/my-auth.service';
import { CartService } from '../../../../services/cart-services/cart-service';
import { SelectedCarRequest } from '../generateOffers/dto/selectedCarRequest';

@Injectable({
  providedIn: 'root'  // Ovdje je ključna linija koja registruje servis globalno
})

@Component({
  selector: 'app-move-to-cart',
  templateUrl: './move-to-cart.component.html',
  styleUrl: './move-to-cart.component.css'
})
export class MoveToCartComponent {
  cartItems: any[] = [];
  constructor(private authLoginService: AuthLoginEndpointService, private router: Router,
      private authService: MyAuthService, private route : ActivatedRoute, public cartService: CartService) {}

  
ngOnInit() {
  const accessToken = this.authService.getAccessToken();
  
  if (accessToken !== null) {
    this.cartService.getCartOptions(accessToken)?.subscribe(
      (response) => {
        response.carOption.forEach((carOne: any) => {
          const item: any = {
            name: carOne.name,
            image: carOne.image,
            pricePerDay: carOne.priceperday,
            description: {
              PickUpDate: carOne.pickupdate,
              DropOffDate: carOne.dropoffdate,
              CountDays: this.CountTheDays(carOne.pickupdate, carOne.dropoffdate)
            }
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
      



  selectedCar : SelectedCarRequest = {
    name: ' ',
    image: ' ',
    pricePerDay: 0,
    accessToken: ' ',
    PickUpDate: ' ',
    DropOffDate: ' '
  }

  removeFromCart(item: any) {
    this.selectedCar.name = item.name;
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
    console.log("Dobar")
    }

  CountTheDays(PickUpDate: string, DropOffDate: string): number {
    // Parsiramo datume
    const pickUp = new Date(PickUpDate);
    const dropOff = new Date(DropOffDate);
  
    // Razlika između datuma u milisekundama
    const differenceInTime = dropOff.getTime() - pickUp.getTime();
  
    // Pretvaramo razliku u milisekundama u broj dana (1 dan = 86400000 milisekundi)
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
  
    // Vraćamo broj dana
    return differenceInDays;
  
    
  }

}