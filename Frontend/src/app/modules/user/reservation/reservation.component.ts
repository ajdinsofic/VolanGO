import { Component } from '@angular/core';
import { ReservationUserService } from '../../../services/reservationUser-service/reservationUser';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.css'
})
export class ReservationComponent {
  reservations: any = null// Lista rezervacija korisnika
  userId: any;
  selectedReservationIndex: number = -1
  car: any;
  reservationDetails: any;
  test: any;
  isConfirmationVisible: boolean = false;
  selectedReservationId: any;
  isRefundModalVisible: boolean = false;

  constructor(private reservationService: ReservationUserService,
              private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.userId = Number(this.cookieService.get('userId'))
    this.getUserReservation();
  }

  getUserReservation(){
    this.reservationService.getUserReservations(this.userId).subscribe({
      next: (data) =>{
        if(data.length != 0) {this.reservations = data;}
        else{ this.reservations = null;}
        
      }
    })
  }

  isPopupVisible = false;

  openDetailsPopup(reservationId: number) {
    this.selectedReservationId = reservationId;
    this.getReservationDetails(reservationId);
    this.isPopupVisible = true;
  }

  getReservationDetails(reservationId: number) {
    this.reservationService.getReservationDetails(reservationId).subscribe({
      next: (data) =>{
        this.reservationDetails = data;
      },
    })
  }

  closePopup() {
    this.isPopupVisible = false;
  }

  cancelReservation(reservationId: number) {
    this.isConfirmationVisible = true;
    this.selectedReservationId = reservationId;
  }

  // Close the confirmation modal without doing anything
  closeConfirmation() {
    this.isConfirmationVisible = false;
    this.selectedReservationId = null;
  }

  // Confirm cancellation of the reservation
  confirmCancellation() {
    if (this.selectedReservationId !== null) {
      this.reservationService.deleteReservation(this.selectedReservationId).subscribe({
        next: () =>{
           this.isRefundModalVisible = true;
        }
      })
      this.isConfirmationVisible = false;
      this.selectedReservationId = null;
    }
  }

  closeRefundModal() {
    this.isRefundModalVisible = false;
    this.isConfirmationVisible = false;
    this.selectedReservationId = null;
    this.getUserReservation();
  }
}
