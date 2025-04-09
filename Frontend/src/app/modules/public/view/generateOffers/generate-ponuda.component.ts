import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { Route, Router, RouterLink } from '@angular/router';
import { MyAuthInfo } from '../../../../services/auth-services/dto/my-auth-info';
import { MyAuthService } from '../../../../services/auth-services/my-auth.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { ViewRequest } from '../home/dto/view-request';
import { HttpClient } from '@angular/common/http';
import { filterRequest} from './dto/filterRequest';
import { CartService } from '../../../../services/cart-services/cart-service';
import { VehicleService } from '../../../../services/vehiclePage-services/vehiclePageServices';
import { SelectedCarRequest } from './dto/selectedCarRequest';
import { CookieService } from 'ngx-cookie-service';
import { MyConfig } from '../../../../my-config';


@Component({
  selector: 'app-generate-ponuda',
  templateUrl: './generate-ponuda.component.html',
  styleUrl: './generate-ponuda.component.css',
  // standalone: true,
  // imports: [
  //   CommonModule,
  //   FormsModule
  // ]
})

// dodao implements implements AfterViewInit
export class GeneratePonudaComponent  {

  price: number = 100; // Početna vrednost za klizač
  priceDisplay: string = `$${this.price}`; // Početni prikaz cene

  selectedCar: any = null;
  isModalOpen: boolean = false;
  isPreviousDisabled: boolean = false;
  isNextDisabled: boolean = false;
  currentPage = 1;
  PageSize: number = 10;
  totalPage: number = 3;
  messageAlert: boolean = false;

  aReDatesOk: boolean = true;
  errorMessage: string = "";

  // dodao
  selectedCarImages: string[] = [];
  selectedImage: string = '';

  locationID :any;

  @ViewChild('zoomImage') zoomImageRef!: ElementRef<HTMLImageElement>;


  // Funkcija koja se poziva kada korisnik klikne "More Info"
  openModal(car: any) {
    const params = car.name; // car.name will be passed to the API

    this.authService.getVehiclesInfo(params).subscribe((response) => {
      if (response && response.vehicleInfo) {
        const vehicleInfo = response.vehicleInfo; // Get the vehicleInfo from the response

        car.description = {
          VehicleId: vehicleInfo.vehicleId,
          VIN: vehicleInfo.vin || 'N/A',
          Model: vehicleInfo.model || 'Unknown Model',
          Make: vehicleInfo.make || 'Unknown Make',
          Year: vehicleInfo.year || 'Unknown Year',
          Mileage: vehicleInfo.mileage || 'Unknown Mileage',
          Description: vehicleInfo.description || 'No Description Available',
          PickUpDate: this.filter.PickUpDate,
          DropOffDate: this.filter.DropOffDate,
          CountDays: CountTheDays(this.filter.PickUpDate, this.filter.DropOffDate),
        };
      } else {
        // Handle the case when no vehicle information is found
        car.description = {
          VIN: 'N/A',
          Model: 'Unknown',
          Make: 'Unknown',
          Year: 'Unknown',
          Mileage: 'Unknown',
          Description: 'No description available',
        };
      }
    });

    this.selectedCar = car;
    this.selectedCar.locationId = this.locationID,
    this.selectedCar.userId =  Number(this.cookieService.get('userId'))
    this.isModalOpen = true;// Open the modal

    //dodao
    this.fetchVehicleImages(car.vehicleId);
  }

  isSameDateAndTime(pickUpDate: string, dropOffDate: string, pickUpTime: string, dropOffTime: string): boolean {
    const pickUpDateObj = new Date(pickUpDate);
    const dropOffDateObj = new Date(dropOffDate);
  
    // Upoređujemo datume
    const isSameDate = pickUpDateObj.getFullYear() === dropOffDateObj.getFullYear() &&
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
      }
      else if(pickUpTimeObj == dropOffTimeObj){
        return false;
      }
  
      return true; // Ako je vreme isto, vratimo true
    }
  
    return true; // Ako datumi nisu isti, vratimo false
  }

  ProvjeraDatuma(){
    if (new Date(this.filter.PickUpDate) > new Date(this.filter.DropOffDate)) {
      this.aReDatesOk = false;
      this.errorMessage = 'Dates are not in the future';
      return;
    }
    else if (!this.isSameDateAndTime(this.filter.PickUpDate, this.filter.DropOffDate, this.filter.PickUpTime, this.filter.DropOffTime)) {
      this.aReDatesOk = false;
      this.errorMessage = 'Dates are the same but times are invalid.';
      return;
    }
    this.aReDatesOk = true;
  }


  vehId:number = 0;
// dodao
  fetchVehicleImages(vehicleId: number): void {
    this.vehId = vehicleId;
    this.authService.getVehicleImages(vehicleId).subscribe(
      (response) => {
        this.selectedCarImages = response.images.map(
          (img: string) => `data:image/jpeg;base64,${img}`
        );
        this.selectedImage = this.selectedCarImages[0]; // Default to the first image
      },
      (error) => {
        console.error('Error fetching vehicle images:', error);
      }
    );
  }

  // dodao
  selectImage(image: string): void {
    this.selectedImage = image;
  }

// dodao
//   ngAfterViewInit() {
//     // Initialize EasyZoom after the view has loaded
//     const easyzoom = new EasyZoom({
//       selector: '.easyzoom'
//     });
//   }

  onMouseMove(event: MouseEvent) {
    const zoomImage = this.zoomImageRef.nativeElement;
    const { left, top, width, height } = zoomImage.getBoundingClientRect();
    const mouseX = event.clientX - left;
    const mouseY = event.clientY - top;

    const xPercent = (mouseX / width) * 100;
    const yPercent = (mouseY / height) * 100;

    zoomImage.style.transformOrigin = `${xPercent}% ${yPercent}%`;
    zoomImage.style.transform = 'scale(2)'; // Zoom level
  }

  onMouseLeave() {
    const zoomImage = this.zoomImageRef.nativeElement;
    zoomImage.style.transform = 'scale(1)'; // Reset zoom
    zoomImage.style.transformOrigin = 'center center'; // Reset zoom origin
  }

  // Funkcija za zatvaranje modala
  closeModal() {
    this.isModalOpen = false;  // Zatvoriti modal
  }
  constructor(
    private vehicleService: MyAuthService,
    private router: ActivatedRoute,
    private route: Router,
    private http: HttpClient,
    public authService: MyAuthService,
    public cartService: CartService,
    private cookieService : CookieService,
    private httpK: HttpClient,
    public vehiclePageService: VehicleService) {}

  vehicles: any[] = [];

  newVehicles: ViewRequest = {
    selectedCar: '',
    PickUpDate: '',
    PickUp: '',
    DropOffDate: '',
    DropOff: '',
    PickUpTime: '',
    DropOffTime: ''
  };

  ngOnInit() {
    this.router.queryParams.subscribe(params => {
      const data = params['data']; // Retrieve 'data' parameter
      if (data) {
        this.newVehicles = JSON.parse(data); // Convert back to object
      }
    });
    this.filter.DropOffDate = this.newVehicles.DropOffDate;
    this.filter.PickUpDate = this.newVehicles.PickUpDate
    this.filter.DropOffTime = this.newVehicles.DropOffTime;
    this.filter.PickUpTime = this.newVehicles.PickUpTime;
    this.getVehicles();
    this.httpK.get(`http://localhost:5136/LocationsController/GetByName?name=${this.newVehicles.DropOff}`).subscribe({
        next:(x)=>{
          this.locationID = x;
        }
      })
  }

  updatePrice() {
    this.filter.price = this.price;
  }

  filter: filterRequest = {
    year: " ",
    color: " ",
    price: this.price,
    selectedCar: " ",
    PickUpDate: " ",
    PickUpTime: " ",
    DropOffDate: " ",
    DropOffTime: " "
  };

  applyFilters(): void {

    const params = {
      year: this.filter.year,
      color: this.filter.color,
      price: this.filter.price,
      selectedCar: this.filter.selectedCar,
      PickUpDate: this.filter.PickUpDate,
      PickUpTime: this.filter.PickUpTime,
      DropOffDate: this.filter.DropOffDate,
      DropOffTime: this.filter.DropOffTime
    };

    this.authService.getFilterVehicles(params, this.currentPage, this.PageSize).subscribe(
      (response) => {
        // Proverite kako izgleda odgovor // Promenite 'status' na odgovarajući ključ koji vaš backend koristi
          this.vehicles = response.paginatedResponse;
          this.totalPage = response.totalPages;
          if(this.currentPage === 1){
            this.isPreviousDisabled = true;
            if(this.currentPage === this.totalPage){
              this.isNextDisabled = true;
            }
            else{
              this.isNextDisabled = false;
            }
          }
          else{
            this.isPreviousDisabled = false;
          }
          console.log('Filtered vehicles received:', this.vehicles);
      },
      (error) => {
        console.error('API error:', error);  // Obrađujte greške
      }
    );
  }

  

  GoToMoreInfo() {
     this.route.navigate(['/public/more-info']);
    }

  pricePosition(): number {
    // Prilagođavamo poziciju za prikaz cene
    const min = 10;
    const max = 500;
    return ((this.price - min) / (max - min)) * 100;
  }

  getVehicles(): void {
    // Send the data as query parameters
    const params = {
      selectedCar: this.newVehicles.selectedCar,
      PickUp: this.newVehicles.PickUp,
      PickUpDate: this.newVehicles.PickUpDate,
      DropOffDate: this.newVehicles.DropOffDate,
      DropOff: this.newVehicles.DropOff,
      PickupTime: this.newVehicles.PickUpTime,
      DropOffTime: this.newVehicles.DropOffTime
    };

    // HTTP GET with query parameters
    this.vehicleService.getVehicles(params).subscribe(
      response => {
        this.vehicles = response.allCars;
        this.totalPage = response.totalPages;
        if(this.currentPage === 1){
          this.isPreviousDisabled = true;
          if(this.currentPage === this.totalPage){
            this.isNextDisabled = true;
          }
        }
        console.log('Vehicles fetched successfully:', this.vehicles);
      },
      error => {
        console.error('Error fetching vehicles:', error);
      }
    );

    

  }
  selCar : SelectedCarRequest = {
    vehicleId: 0,
    name: ' ',
    image: ' ',
    pricePerDay: 0,
    accessToken: ' ',
    PickUpDate: ' ',
    DropOffDate: ' ',
    locationId: 0,
    userId: 0
  }

  SaveToCart(): void{
    if(this.authService.getAccessToken() !== null){
      this.messageAlert = false;
      this.selCar.vehicleId = this.selectedCar.vehicleId;
      this.selCar.name = this.selectedCar.name;
      this.selCar.image = this.selectedCar.image;
      this.selCar.pricePerDay = this.selectedCar.pricePerDay;
      this.selCar.accessToken = this.authService.getAccessToken();
      this.selCar.PickUpDate = this.filter.PickUpDate;
      this.selCar.DropOffDate = this.filter.DropOffDate;
      this.selCar.locationId = this.locationID;
      this.selCar.userId = this.selectedCar.userId;

      

      this.SaveToDataBase(this.selCar);
      this.cartService.addToCart(this.selectedCar);
      alert("Uspjesno ste dodali auto u korpu")
      this.isModalOpen = false
    }
    else{
      this.messageAlert = true;
    }
  }

  // This variable controls the visibility of the date and time fields
  showDateTimeFields: boolean = false;

  // This method toggles the visibility of the date and time fields
  toggleDateTimeVisibility(): void {
    this.showDateTimeFields = !this.showDateTimeFields;
  }

  reserveNow() {

    if(this.authService.getAccessToken() !== null){
      this.messageAlert = false;
      const pickUpDate = new Date(this.newVehicles.PickUpDate);
      const dropOffDate = new Date(this.newVehicles.DropOffDate);
      const rentalDays = Math.ceil((dropOffDate.getTime() - pickUpDate.getTime()) / (1000 * 60 * 60 * 24));
  
      if(rentalDays <= 0) {
        alert('Drop-off date must be after pickup date');
        return;
      }
      const currentUrl = window.location.href;
      const userIdFromCookie = this.cookieService.get('userId');
      
      const checkoutData = {
        carName: this.selectedCar.name,
        pricePerDay: this.selectedCar.pricePerDay,
        rentalDays: rentalDays,
        currentUrl: currentUrl,
        userId: userIdFromCookie,
        vehicleId: this.vehId,
        locationId : this.locationID,
        pickupDate : pickUpDate,
        dropoffDate : dropOffDate
      };

      this.http.post<{ url: string }>(`http://localhost:5136/api/stripe/create-checkout-session`, checkoutData)
      .subscribe(
        (response) => {
          // Redirect to the Stripe Checkout page
          window.location.href = response.url;
        },
        (error) => {
          console.error('Error creating Stripe checkout session:', error);
          alert('Unable to process the reservation. Please try again.');
        }
      );
    }
    else{
      this.messageAlert = true;
    }
  }


goToPage(page: number): void {
  if (page >= 1 && page <= this.totalPage) {
    this.currentPage = page;
    this.loadVehicles();
  }
}

goToNextPage(): void {
  if (this.currentPage < this.totalPage) {
    if(this.currentPage + 1 !== 1){
      this.isPreviousDisabled = false;
    }
    if(this.currentPage + 1 === this.totalPage){
      this.isNextDisabled = true;
    }
    this.currentPage++;
    this.loadVehicles();
  }
}

goToPreviousPage(): void {
  if (this.currentPage> 1) {
    if(this.currentPage - 1 < this.totalPage){
      this.isNextDisabled = false;
    }
    this.currentPage--;
    if(this.currentPage === 1){
      this.isPreviousDisabled = true;
    }
    this.loadVehicles();
  }
  else{
    this.isPreviousDisabled = true;
  }
}

loadVehicles(): void {
  this.vehiclePageService.getVehicles(this.currentPage, this.PageSize).subscribe(
    (data) => {
      this.vehicles = data.paginatedResponse;
      this.totalPage = data.totalPages;
    },
    (error) => {
      console.error('Error loading vehicles', error);
    }
  );
 }

 SaveToDataBase(selectedCar: SelectedCarRequest) {

  // Call the service method to save the selected car to the database
  this.cartService.saveToDataBase(selectedCar).subscribe(
    () => {
      // Log success message
      console.log('Car option saved successfully!');
    },
    (err: any) => {
      // Log error details
      console.error('Failed to save car option', err);
    }
  );
}

}



function CountTheDays(PickUpDate: string, DropOffDate: string): number {
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


