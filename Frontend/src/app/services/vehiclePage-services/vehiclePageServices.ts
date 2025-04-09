import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MyConfig } from '../../my-config';

interface Vehicle {
  id: number;
  name: string;
}

interface PaginatedResponse {
  items: Vehicle[];
  totalPages: number;
}

@Injectable({
  providedIn: 'root',
})
export class VehicleService {

  constructor(private http: HttpClient) { }
  private apiUrl = `${MyConfig.api_address}`;

  getVehicles(page: number, pageSize: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<any>(`${this.apiUrl}/get/vehiclePage`, { params });
  }
}
