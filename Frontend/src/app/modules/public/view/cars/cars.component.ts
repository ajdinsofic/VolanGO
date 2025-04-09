import { Component } from '@angular/core';
import {CategoriesPieceComponent} from '../../component/categories-piece/categories-piece.component';
import {CentralProcessComponent} from '../../component/central-process/central-process.component';
import {BannerComponent} from '../../component/banner/banner.component';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-cars',
  templateUrl: './cars.component.html',
  styleUrl: './cars.component.css',
  // standalone:true,
  // imports: [
  //   CategoriesPieceComponent,
  //   CentralProcessComponent,
  //   BannerComponent,
  //   RouterLink
  // ]
})
export class CarsComponent {

}
