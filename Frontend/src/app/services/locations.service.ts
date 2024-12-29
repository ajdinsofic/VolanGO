import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {MyConfig} from '../my-config';
import {Location} from './auth-services/dto/location.model';

@Injectable({
  providedIn: 'root'
})
export class LocationsService {
  private apiUrl = `${MyConfig.api_address}`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get<Location[]>(`${this.apiUrl}/LocationsController/all`);
  }

  update(id: number, location: any): Observable<any> {
    return this.http.put<Location>(`${this.apiUrl}/LocationsController/update-database/${id}`, location);
  }

  create(location: any): Observable<any> {
    return this.http.post<Location>(`${this.apiUrl}/LocationsController/create`, location);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<void>(`${this.apiUrl}/LocationsController/delete-location/${id}`);
  }
}


