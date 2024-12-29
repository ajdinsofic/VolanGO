import { Component } from '@angular/core';
import {FeaturesPieceComponent} from '../../component/features-piece/features-piece.component';
import {FactCounterComponent} from '../../component/fact-counter/fact-counter.component';
import {BannerComponent} from '../../component/banner/banner.component';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-feature',
  templateUrl: './feature.component.html',
  styleUrl: './feature.component.css',
  // standalone:true,
  // imports: [
  //   FeaturesPieceComponent,
  //   FactCounterComponent,
  //   BannerComponent,
  //   RouterLink
  // ]
})
export class FeatureComponent {

}
