import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {MyConfig} from '../my-config';

export interface Invoice {
  invoiceId: number;
  reservationId: number;
  invoiceDate: string;
  amount: number;
  paymentMethod: string;
  status: string;
}

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private apiUrl = `${MyConfig.api_address}/api/invoices`;// Update with your backend URL

  constructor(private http: HttpClient) {}

  getInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(this.apiUrl);
  }

  getInvoiceById(id: number): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.apiUrl}/${id}`);
  }

  createInvoice(invoice: Invoice): Observable<Invoice> {
    invoice.invoiceDate = new Date(invoice.invoiceDate).toISOString();
    return this.http.post<Invoice>(this.apiUrl, invoice);
  }

  updateInvoice(id: number, invoice: Invoice): Observable<void> {
    invoice.invoiceDate = new Date(invoice.invoiceDate).toISOString();
    return this.http.put<void>(`${this.apiUrl}/${id}`, invoice);
  }

  deleteInvoice(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { responseType: 'text' as 'json' });
  }
}
