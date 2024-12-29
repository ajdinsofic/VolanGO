import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MyConfig } from '../../my-config';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  apiUrl = `${MyConfig.api_address}` // API endpoint za upload fajlova

  constructor(private http: HttpClient) {}

  // Metoda za upload fajla
  uploadFile(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    const headers = new HttpHeaders(); // Postavljanje zaglavlja ako je potrebno

    return this.http.post<any>(`${this.apiUrl}/upload/file`, formData, {
      headers: headers,
    });
  }

  // Metoda za download fajla
  downloadFile(fileName: string): Observable<Blob> {
    const url = `${this.apiUrl}/download/${fileName}`;
    return this.http.get(url, { responseType: 'blob' });
  }

  getFiles(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/get/files`);
  }
}
