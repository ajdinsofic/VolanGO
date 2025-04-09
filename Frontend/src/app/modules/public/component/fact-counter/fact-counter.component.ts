import { Component } from '@angular/core';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-fact-counter',
  templateUrl: './fact-counter.component.html',
  styleUrl: './fact-counter.component.css',
  // standalone:true,
  // imports: [
  //   NgForOf
  // ]
})
export class FactCounterComponent {
  counters = [
    {
      value: 829,
      label: 'Happy Clients', // Translation key
      icon: 'fas fa-thumbs-up',
      delay: '0.1s'
    },
    {
      value: 56,
      label: 'Number of Cars',
      icon: 'fas fa-car-alt',
      delay: '0.3s'
    },
    {
      value: 127,
      label: 'Car Centers',
      icon: 'fas fa-building',
      delay: '0.5s'
    },
    {
      value: 589,
      label: 'Total kilometers',
      icon: 'fas fa-clock',
      delay: '0.7s'
    }
  ];

}
