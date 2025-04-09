import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MyConfig } from '../../my-config';

@Injectable({
  providedIn: 'root'
})
export class ReservationUserService {
  private apiUrl = `${MyConfig.api_address}`;

  constructor(private http: HttpClient) {}

  getUserReservations(userId: number){
    return this.http.get<any>(`${this.apiUrl}/api/ReservationsUser/getUserReservations/${userId}`); 
  }

  getReservationDetails(reservationId: number){
    return this.http.get<any>(`${this.apiUrl}/api/ReservationsUser/getReservationDetails/${reservationId}`)
  }

  deleteReservation(reservationId: number){
    return this.http.delete<any>(`${this.apiUrl}/api/ReservationsUser/deleteReservation/${reservationId}`)
  }

}
