import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {RegisterRequest} from '../../modules/auth/register/register-request.modul';
import {MyAuthService} from './my-auth.service';
import {MyConfig} from '../../my-config';


@Injectable({
  providedIn: 'root',
})
export class AuthRegisterService {
  private apiUrl = `${MyConfig.api_address}/register`; //  URL


  constructor(private httpClient: HttpClient) {}

  register(registerRequest: RegisterRequest): Observable<void> {
    return this.httpClient.post<void>(this.apiUrl, registerRequest);
  }
}
