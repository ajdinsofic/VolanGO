import { Component, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { TeamsComponent } from '../../component/teams/teams.component';
import { BannerComponent } from '../../component/banner/banner.component';
import { BlogPiecesComponent } from '../../component/blog-pieces/blog-pieces.component';
import { CentralProcessComponent } from '../../component/central-process/central-process.component';
import { CategoriesPieceComponent } from '../../component/categories-piece/categories-piece.component';
import { ServicePieceComponent } from '../../component/service-piece/service-piece.component';
import { FactCounterComponent } from '../../component/fact-counter/fact-counter.component';
import { AboutPieceComponent } from '../../component/about-piece/about-piece.component';
import { FeaturesPieceComponent } from '../../component/features-piece/features-piece.component';
import { CommonModule } from '@angular/common';
import {
  AuthLoginEndpointService,
  LoginRequest,
} from '../../../../endpoints/auth-endpoints/auth-login-endpoint.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MyAuthService } from '../../../../services/auth-services/my-auth.service';
import { ViewRequest, ViewRequestMaps } from './dto/view-request';
import { FormsModule, NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { GeneratePonudaComponent } from '../generateOffers/generate-ponuda.component';
import { CartService } from '../../../../services/cart-services/cart-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  // standalone: true,
  // imports: [NgForOf, TeamsComponent, BannerComponent, BlogPiecesComponent, CentralProcessComponent, CategoriesPieceComponent, ServicePieceComponent, FactCounterComponent, AboutPieceComponent, FeaturesPieceComponent, FormsModule, NgIf, CommonModule]
})
//
export class HomeComponent implements OnInit, OnDestroy {
  formSubmitted: any;
  today: string = new Date().toISOString().split('T')[0];
  errorMessage: string = '';
  center: any;
  dropOffOptions: any;
  isCartOpen: any;
  isClosed = false;
  // isLoggedIn!: Observable<boolean>;
  constructor(
    private authLoginService: AuthLoginEndpointService,
    private router: Router,
    private authService: MyAuthService,
    private route: ActivatedRoute,
    private cartService: CartService
  ) {}
  carouselItems = [
    {
      image: '/assets/img/carousel-2.jpg',
      heading: 'Get 15% off your rental Plan your trip now',
      subheading: 'Treat yourself in USA',
      formData: {
        carOptions: ['Audi', 'BMW', 'Kia', 'Opel'],
        placeholder: 'Enter a City or Airport',
      },
    },
    {
      image: '/assets/img/carousel-1.jpg',
      heading: 'Get 15% off your rental! Choose Your Model',
      subheading: 'Treat yourself in USA',
      formData: {
        carOptions: ['Audi', 'BMW', 'Kia', 'Opel'],
        placeholder: 'Enter a City or Airport',
      },
    },
  ];

  viewRequestMaps: ViewRequestMaps = {
    PickUp: '',
    DropOff: '',
  }; // Objekat za datum i lokaciju
  map: any;
  marker: any;
  geocoder: any;

  GenerateOffers(): void {
    this.router.navigateByUrl('/public/generateOffers', {
      state: { viewRequest: this.viewRequest },
    });
  }

  initMap() {
    const mapOptions = {
      center: { lat: 43.8486, lng: 18.3564 },

      // Početna lokacija (možete promeniti)
      zoom: 12,
    };

    this.map = new google.maps.Map(
      document.querySelector('#map') as HTMLElement,
      mapOptions
    );
    this.geocoder = new google.maps.Geocoder();

    // Dodajte marker koji korisnici mogu pomeriti
    this.marker = new google.maps.Marker({
      position: mapOptions.center,
      map: this.map,
      draggable: true,
    });

    // Kada se marker pomeri, ažurirajte viewRequest.PickUp sa novom lokacijom
    this.marker.addListener('dragend', (event: any) => {
      this.getLocationName(event.latLng.lat(), event.latLng.lng());
    });

    // Kada korisnik klikne na mapu, postavite marker i ažurirajte lokaciju
    this.map.addListener('click', (event: any) => {
      this.marker.setPosition(event.latLng);
      this.getLocationName(event.latLng.lat(), event.latLng.lng());
    });
  }

  getLocationName(lat: number, lng: number) {
    this.geocoder.geocode(
      { location: { lat, lng } },
      (results: any, status: any) => {
        if (status === 'OK') {
          if (results[0]) {
            this.viewRequest.PickUp = results[0].formatted_address;
            console.log(this.viewRequest.PickUp); // Prikazuje naziv lokacije
          } else {
            window.alert('No results found');
          }
        } else {
          window.alert('Geocoder failed due to: ' + status);
        }
      }
    );
  }

  activeIndex = 0; // To track the active slide
  intervalId: any;

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnInit(): void {
    this.startCarousel();
    this.getDropOffLocations();
    this.authService.isLoggedIn();
  }
  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  startCarousel(): void {
    this.intervalId = setInterval(() => {
      this.activeIndex = (this.activeIndex + 1) % this.carouselItems.length;
    }, 30000); // Slide changes every 30 seconds
  }

  goToSlide(index: number): void {
    if (index < 0) {
      this.activeIndex = this.carouselItems.length - 1;
    } else if (index >= this.carouselItems.length) {
      this.activeIndex = 0;
    } else {
      this.activeIndex = index;
    }
  }

  viewRequest: ViewRequest = {
    selectedCar: '',
    PickUpDate: '',
    PickUp: '',
    DropOffDate: '',
    DropOff: '',
    DropOffTime: '',
    PickUpTime: '',
  };

  // Funkcija za upoređivanje datuma i vremena
  isSameDateAndTime(
    pickUpDate: string,
    dropOffDate: string,
    pickUpTime: string,
    dropOffTime: string
  ): boolean {
    const pickUpDateObj = new Date(pickUpDate);
    const dropOffDateObj = new Date(dropOffDate);

    // Upoređujemo datume
    const isSameDate =
      pickUpDateObj.getFullYear() === dropOffDateObj.getFullYear() &&
      pickUpDateObj.getMonth() === dropOffDateObj.getMonth() &&
      pickUpDateObj.getDate() === dropOffDateObj.getDate();

    // Ako su datumi isti, proveri i vreme
    if (isSameDate) {
      // Upoređujemo vreme
      const pickUpTimeObj = parseInt(pickUpTime, 10); // Pretvaramo u broj (ako je vreme u satima)
      const dropOffTimeObj = parseInt(dropOffTime, 10);

      // Proveravamo da li je vreme pickUp-a veće od dropOff-a na istom danu
      if (pickUpTimeObj > dropOffTimeObj) {
        return false; // Vreme pickUp-a je kasnije od dropOff-a, što nije validno
      } else if (pickUpTimeObj == dropOffTimeObj) {
        return false;
      }

      return true; // Ako je vreme isto, vratimo true
    }

    return true; // Ako datumi nisu isti, vratimo false
  }

  submitForm(form: any, viewRequest: ViewRequest): void {
    this.formSubmitted = true;
    this.errorMessage = ''; // Resetovanje greške na početku

    // Provera datuma
    if (new Date(viewRequest.PickUpDate) > new Date(viewRequest.DropOffDate)) {
      this.errorMessage = 'Dates are not in the future';
      return;
    } else if (
      !this.isSameDateAndTime(
        viewRequest.PickUpDate,
        viewRequest.DropOffDate,
        viewRequest.PickUpTime,
        viewRequest.DropOffTime
      )
    ) {
      this.errorMessage = 'Invalid Pick-up and Drop-off date or time';
      return;
    }

    // Provera validnosti forme
    if (form.valid) {
      console.log('Forma je validna');
      console.log(this.viewRequest);

      const jsonString = JSON.stringify(viewRequest);
      // Nastavite sa akcijom (npr. navigacija na sledeću stranicu)
      this.router.navigate(['/public/generateOffers'], {
        queryParams: { data: jsonString },
      });
    } else {
      this.errorMessage = 'Forma nije validna. Popunite sva polja!';
    }
  }

  getDropOffLocations(): void {
    this.authService.getDropOffLocations().subscribe(
      (response) => {
        // Proverite da li response sadrži validne podatke

        this.dropOffOptions = response.locations; // Postavite odgovor u dropOffOptions
      },
      (error) => {
        // Obrada greške u slučaju neuspjelog poziva
        console.error('Greška pri dohvaćanju podataka:', error);
      }
    );
  }
}
