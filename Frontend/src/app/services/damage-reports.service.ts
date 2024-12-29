import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {MyConfig} from '../my-config';

export interface DamageReport {
  damageReportId: number;
  reservationId: number;
  vehicleId: number;
  userId: number;
  reportDate: string;
  description: string;
  estimatedRepairCost: number;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class DamageReportsService {
  private apiUrl = `${MyConfig.api_address}/DamageReports`;
  private reservationsUrl = `${MyConfig.api_address}/Reservations`;
  private vehiclesUrl = `${MyConfig.api_address}/Vehicles`;
  private usersUrl = `${MyConfig.api_address}/api/users`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<DamageReport[]> {
    return this.http.get<DamageReport[]>(`${this.apiUrl}/all`);
  }

  create(report: DamageReport): Observable<DamageReport> {
    return this.http.post<DamageReport>(`${this.apiUrl}/create`, report);
  }

  update(id: number, report: DamageReport): Observable<DamageReport> {
    return this.http.put<DamageReport>(`${this.apiUrl}/update-database/${id}`, report);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete-damage-report/${id}`);
  }

  getReservations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.reservationsUrl}/all`);
  }

  getVehicles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.vehiclesUrl}/all`);
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.usersUrl}/all`);
  }
}
