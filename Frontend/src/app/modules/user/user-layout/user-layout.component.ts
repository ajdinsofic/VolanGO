import { Component } from '@angular/core';
import {MyAuthService} from '../../../services/auth-services/my-auth.service';

@Component({
  selector: 'app-user-layout',
  templateUrl: './user-layout.component.html',
  styleUrl: './user-layout.component.css'
})
export class UserLayoutComponent {

  constructor(public authService: MyAuthService){}


}
