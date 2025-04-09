import {Component} from '@angular/core';
import { MyAuthService } from '../../../services/auth-services/my-auth.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {
constructor(public authService : MyAuthService){

}


}
