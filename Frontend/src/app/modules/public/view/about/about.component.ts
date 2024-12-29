import { Component } from '@angular/core';
import {AboutPieceComponent} from '../../component/about-piece/about-piece.component';
import {FactCounterComponent} from '../../component/fact-counter/fact-counter.component';
import {FeaturesPieceComponent} from '../../component/features-piece/features-piece.component';
import {CentralProcessComponent} from '../../component/central-process/central-process.component';
import {TeamsComponent} from '../../component/teams/teams.component';
import {BannerComponent} from '../../component/banner/banner.component';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
  // standalone:true,
  // imports: [
  //   AboutPieceComponent,
  //   FactCounterComponent,
  //   FeaturesPieceComponent,
  //   CentralProcessComponent,
  //   TeamsComponent,
  //   BannerComponent,
  //   RouterLink
  // ]
})
export class AboutComponent {

}
