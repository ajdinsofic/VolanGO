import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient) {}

  /**
   * Perform a GET request.
   */
  get<T>(url: string, options?: { headers?: HttpHeaders; params?: HttpParams; observe?: 'body' }): Observable<T>;
  get<T>(url: string, options: { observe: 'response'; headers?: HttpHeaders; params?: HttpParams }): Observable<any>;
  get<T>(url: string, options: { observe: 'events'; headers?: HttpHeaders; params?: HttpParams }): Observable<any>;
  get<T>(url: string, options?: any): Observable<any> {
    return this.http.get<T>(url, options).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  /**
   * Perform a POST request.
   */
  post<T>(url: string, body: any, options?: { headers?: HttpHeaders; params?: HttpParams; observe?: 'body' }): Observable<T>;
  post<T>(url: string, body: any, options: { observe: 'response'; headers?: HttpHeaders; params?: HttpParams }): Observable<any>;
  post<T>(url: string, body: any, options: { observe: 'events'; headers?: HttpHeaders; params?: HttpParams }): Observable<any>;
  post<T>(url: string, body: any, options?: any): Observable<any> {
    return this.http.post<T>(url, body, options).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Perform a PUT request.
   */
  put<T>(url: string, body: any, options?: { headers?: HttpHeaders; params?: HttpParams; observe?: 'body' }): Observable<T>;
  put<T>(url: string, body: any, options: { observe: 'response'; headers?: HttpHeaders; params?: HttpParams }): Observable<any>;
  put<T>(url: string, body: any, options: { observe: 'events'; headers?: HttpHeaders; params?: HttpParams }): Observable<any>;
  put<T>(url: string, body: any, options?: any): Observable<any> {
    return this.http.put<T>(url, body, options).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Perform a DELETE request.
   */
  delete<T>(url: string, options?: { headers?: HttpHeaders; params?: HttpParams; observe?: 'body' }): Observable<T>;
  delete<T>(url: string, options: { observe: 'response'; headers?: HttpHeaders; params?: HttpParams }): Observable<any>;
  delete<T>(url: string, options: { observe: 'events'; headers?: HttpHeaders; params?: HttpParams }): Observable<any>;
  delete<T>(url: string, options?: any): Observable<any> {
    return this.http.delete<T>(url, options).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Perform a PATCH request.
   */
  patch<T>(url: string, body: any, options?: { headers?: HttpHeaders; params?: HttpParams; observe?: 'body' }): Observable<T>;
  patch<T>(url: string, body: any, options: { observe: 'response'; headers?: HttpHeaders; params?: HttpParams }): Observable<any>;
  patch<T>(url: string, body: any, options: { observe: 'events'; headers?: HttpHeaders; params?: HttpParams }): Observable<any>;
  patch<T>(url: string, body: any, options?: any): Observable<any> {
    return this.http.patch<T>(url, body, options).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Handle HTTP errors.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      console.error('Client-side error:', error.error.message);
    } else {
      console.error(`Server-side error: ${error.status}, body: ${error.error}`);
    }
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}
