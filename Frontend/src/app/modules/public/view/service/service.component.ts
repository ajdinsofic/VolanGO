import { Component } from '@angular/core';
import {ServicePieceComponent} from '../../component/service-piece/service-piece.component';
import {FactCounterComponent} from '../../component/fact-counter/fact-counter.component';
import {BannerComponent} from '../../component/banner/banner.component';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrl: './service.component.css',
  // standalone:true,
  // imports: [
  //   ServicePieceComponent,
  //   FactCounterComponent,
  //   BannerComponent,
  //   RouterLink
  // ]
})
export class ServiceComponent {

}
