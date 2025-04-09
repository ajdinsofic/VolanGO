import { Component } from '@angular/core';
import {DecimalPipe, NgClass, NgForOf} from '@angular/common';

@Component({
  selector: 'app-central-process',
  templateUrl: './central-process.component.html',
  styleUrl: './central-process.component.css',
  // standalone:true,
  // imports: [
  //   NgForOf,
  //   DecimalPipe,
  //   NgClass
  // ]
})
export class CentralProcessComponent {
  sectionDescription = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ut amet nemo expedita asperiores commodi accusantium at cum harum, excepturi, quia tempora cupiditate! Adipisci facilis modi quisquam quia distinctio.';

  steps = [
    {
      number: 1,
      titleKey: 'comeInContact',
      descriptionKey: 'comeInContactDescription',

    },
    {
      number: 2,
      titleKey: 'chooseACar',
      descriptionKey: 'chooseACarDescription',

    },
    {
      number: 3,
      titleKey: 'enjoyDriving',
      descriptionKey: 'enjoyDrivingDescription',

    },
  ];
}
