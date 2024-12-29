import { Component } from '@angular/core';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-features-piece',
  templateUrl: './features-piece.component.html',
  styleUrl: './features-piece.component.css',
  // standalone:true,
  // imports: [
  //   NgForOf
  // ]
})
export class FeaturesPieceComponent {
  leftFeatures = [
    {
      title: 'featureLeft1Title', // Translation key
      description: 'featureLeft1Desc', // Translation key
      icon: 'fa fa-trophy fa-2x',
      delay: '0.1s'
    },
    {
      title: 'featureLeft2Title', // Translation key
      description: 'featureLeft2Desc', // Translation key
      icon: 'fa fa-road fa-2x',
      delay: '0.3s'
    }
  ];

  rightFeatures = [
    {
      title: 'featureRight1Title', // Translation key
      description: 'featureRight1Desc', // Translation key
      icon: 'fa fa-tag fa-2x',
      delay: '0.1s'
    },
    {
      title: 'featureRight2Title', // Translation key
      description: 'featureRight2Desc', // Translation key
      icon: 'fa fa-map-pin fa-2x',
      delay: '0.3s'
    }
  ];
}
