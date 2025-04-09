import { Component } from '@angular/core';
import {HeaderComponent} from '../header/header.component';
import {RouterOutlet} from '@angular/router';
import {FooterComponent} from '../footer/footer.component';

@Component({
  selector: 'app-public-layout',
  templateUrl: './public-layout.component.html',
  styleUrl: './public-layout.component.css',
  // standalone:true,
  // imports: [
  //   HeaderComponent,
  //   RouterOutlet,
  //   FooterComponent
  // ]
})
export class PublicLayoutComponent {

}
