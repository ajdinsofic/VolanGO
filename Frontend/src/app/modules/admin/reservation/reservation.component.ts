import { Component, OnInit } from '@angular/core';
import { ReservationService } from '../../../services/reservation-service/reservationService';
import { Reservation } from './dto/reservation';
import { debounceTime, switchMap } from 'rxjs';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css'],
})
export class ReservationsComponent implements OnInit {
  reservations: Reservation[] = [];
  filters = { userId: '', reservationId: '', vehicleId: '', locationId: '',  reservationDate: '' };
  selectedSort: string = 'reservationId';

  adding = false;
  editing = false;
  
  currentReservation: Reservation = {
    reservationId: 0,
    userId: '',
    vehicleID: '',
    locationId: '',
    reservationDate: '',
    pickupDate: '',
    dropoffDate: '',
  };

  // To store validation errors
  userIdError = '';
  vehicleIdError = '';
  locationIdError = '';

  constructor(private reservationService: ReservationService) {}

  ngOnInit() {
    this.fetchReservations();
  }

  fetchReservations() {
    this.reservationService.getAll().subscribe((data: Reservation[]) => {
      this.reservations = data;
    });
  }

  addReservation() {
    this.adding = true;
    this.editing = false;
    this.currentReservation = {
      reservationId: 0,
      userId: '',
      vehicleID: '',
      locationId: '',
      reservationDate: '',
      pickupDate: '',
      dropoffDate: '',
    };
  }

  editReservation(reservation: Reservation) {
    this.editing = true;
    this.adding = false;
    this.currentReservation = { ...reservation };
  }

  // Check if the userId exists in the database
  checkUserId() {
    if (this.currentReservation.userId) {
      this.reservationService.checkUserId(this.currentReservation.userId).subscribe(
        (exists) => {
          this.userIdError = exists ? '' : 'User not found with this ID.';
        },
        (error) => {
          if (error.status === 404) {
            this.userIdError = 'User not found with this ID.';
          } else {
            this.userIdError = 'Error checking User ID.';
          }
        }
      );
    }
  }

  // Check if the vehicleId exists in the database
  checkVehicleId() {
    if (this.currentReservation.vehicleID) {
      this.reservationService.checkVehicleId(this.currentReservation.vehicleID).subscribe(
        (exists) => {
          this.vehicleIdError = exists ? '' : 'Vehicle not found with this ID.';
        },
        (error) => {
          if (error.status === 404) {
            this.vehicleIdError = 'Vehicle not found with this ID.';
          } else {
            this.vehicleIdError = 'Error checking Vehicle ID.';
          }
        }
      );
    }
  }

  // Check if the locationId exists in the database
  checkLocationId() {
    if (this.currentReservation.locationId) {
      this.reservationService.checkLocationId(this.currentReservation.locationId).subscribe(
        (exists) => {
          this.locationIdError = exists ? '' : 'Location not found with this ID.';
        },
        (error) => {
          if (error.status === 404) {
            this.locationIdError = 'Location not found with this ID.';
          } else {
            this.locationIdError = 'Error checking Location ID.';
          }
        }
      );
    }
  }

  save() {
    if (this.editing) {
      this.reservationService
        .update(this.currentReservation.reservationId, this.currentReservation)
        .subscribe(() => this.handleSuccess());
    } else {
      this.reservationService
        .create(this.currentReservation)
        .subscribe(() => this.handleSuccess());
    }
  }

  deleteReservation(id: number) {
    this.reservationService.delete(id).subscribe(() => this.fetchReservations());
  }

  handleSuccess() {
    this.adding = false;
    this.editing = false;
    this.fetchReservations();
  }

  cancel() {
    this.adding = false;
    this.editing = false;
  }

  search() {
    this.reservationService
      .getFilteredReservations(this.filters)
      .subscribe((data: Reservation[]) => {
        this.reservations = data;
      });
  }

  clearFilters() {
    this.filters = { userId: '', reservationId: '', vehicleId: '', locationId: '',  reservationDate: '' };
    this.fetchReservations();
  }

  sortReservations() {
    this.reservationService.getSortedBy(this.selectedSort).subscribe(
      (data) => {
        this.reservations = data;
      },
      (error) => {
        console.error('Error fetching sorted reservations', error);
      }
    );
  }

  isDateInvalid(): boolean {
    const today = new Date();
    const reservationDate = new Date(this.currentReservation.reservationDate);
    const pickupDate = new Date(this.currentReservation.pickupDate);
    const dropoffDate = new Date(this.currentReservation.dropoffDate);

    if (reservationDate < today || pickupDate < today || dropoffDate < today) {
      return true;
    }

    if (pickupDate > dropoffDate) {
      return true;
    }

    return false;
  }

  isSubmitDisabled(): boolean {
    if(this.isDateInvalid()){
      return true;
    }
    else if(this.userIdError !== ''){
      return true;
    }
    else if(this.vehicleIdError !== ''){
      return true;
    }
    else if(this.locationIdError !== ''){
      return true;
    }
    else{
      return false;
    }
  }
}
