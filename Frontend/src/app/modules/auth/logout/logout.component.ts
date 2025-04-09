import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {MyConfig} from '../../../my-config';
import {MyAuthService} from '../../../services/auth-services/my-auth.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
// implements OnInit
export class LogoutComponent  {
  private apiUrl = `${MyConfig.api_address}/auth/logout`;

  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) {
  }
}
