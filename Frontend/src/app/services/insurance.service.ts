import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MyConfig } from '../my-config';

export interface Insurance {
  insuranceId: number;
  reservationId: number;
  insuranceType: string;
  cost: number;
  startDate: string;
  endDate: string;
  provider: string;
  policyNumber: string;
  termsAndConditions: string;
}

@Injectable({
  providedIn: 'root',
})
export class InsuranceService {
  private apiUrl = `${MyConfig.api_address}/api/insurances`;

  constructor(private http: HttpClient) {}

  getInsurances(): Observable<Insurance[]> {
    return this.http.get<Insurance[]>(this.apiUrl);
  }

  getInsuranceById(id: number): Observable<Insurance> {
    return this.http.get<Insurance>(`${this.apiUrl}/${id}`);
  }

  createInsurance(insurance: Insurance): Observable<Insurance> {
    insurance.startDate = new Date(insurance.startDate).toISOString();
    insurance.endDate = new Date(insurance.endDate).toISOString();
    return this.http.post<Insurance>(this.apiUrl, insurance);
  }

  updateInsurance(id: number, insurance: Insurance): Observable<void> {
    insurance.startDate = new Date(insurance.startDate).toISOString();
    insurance.endDate = new Date(insurance.endDate).toISOString();
    return this.http.put<void>(`${this.apiUrl}/${id}`, insurance);
  }

  deleteInsurance(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      responseType: 'text' as 'json',
    });
  }
}
