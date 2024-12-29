import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MyConfig } from '../../my-config';
import { Reservation } from '../../modules/admin/reservation/dto/reservation';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private apiUrl = `${MyConfig.api_address}`; // Zameni sa odgovarajućim URL-om tvoje API rute

  constructor(private http: HttpClient) {}

  // Get all reservations
  getAll(): Observable<any> {
      return this.http.get<Location[]>(`${this.apiUrl}/all`);
    }
  
    update(id: number, location: any): Observable<any> {
      return this.http.put<Location>(`${this.apiUrl}/update-reservation/${id}`, location);
    }
  
    create(location: any): Observable<any> {
      return this.http.post<Location>(`${this.apiUrl}/create`, location);
    }
  
    delete(id: number): Observable<any> {
      return this.http.delete<void>(`${this.apiUrl}/delete-location/${id}`);
    }

    getSortedBy(selectedSort: string): Observable<any> {
      const params = new HttpParams().set('sortBy', selectedSort);  // Slanje parametra 'sortBy'
      return this.http.get<any>(`${this.apiUrl}/getSortedData`, { params });
    }

    getFilteredReservations(filters: any): Observable<Reservation[]> {
      return this.http.post<Reservation[]>(`${this.apiUrl}/get/filteredReservations`, filters);
    }

    checkUserId(userId: string): Observable<boolean> {
      return this.http.get<boolean>(`${this.apiUrl}/users/check/${userId}`);
    }
  
    checkVehicleId(vehicleId: string): Observable<boolean> {
      return this.http.get<boolean>(`${this.apiUrl}/vehicles/check/${vehicleId}`);
    }
  
    checkLocationId(locationId: string): Observable<boolean> {
      return this.http.get<boolean>(`${this.apiUrl}/locations/check/${locationId}`);
    }
}
