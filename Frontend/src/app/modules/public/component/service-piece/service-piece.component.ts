import { Component } from '@angular/core';
import {NgClass, NgForOf} from '@angular/common';

@Component({
  selector: 'app-service-piece',
  templateUrl: './service-piece.component.html',
  styleUrl: './service-piece.component.css',
  // standalone:true,
  // imports: [
  //   NgForOf,
  //   NgClass
  // ]
})
export class ServicePieceComponent {

  sectionDescription = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ut amet nemo expedita asperiores commodi accusantium at cum harum, excepturi, quia tempora cupiditate! Adipisci facilis modi quisquam quia distinctio.';

  services = [
    {
      title: 'phoneReservation',  // Translation key
      description: 'phoneReservationDescription',  // Translation key
      icon: 'fa-phone-alt'
    },
    {
      title: 'specialRates',
      description: 'specialRatesDescription',
      icon: 'fa-money-bill-alt'
    },
    {
      title: 'oneWayRental',
      description: 'oneWayRentalDescription',
      icon: 'fa-road'
    },
    {
      title: 'lifeInsurance',
      description: 'lifeInsuranceDescription',
      icon: 'fa-umbrella'
    },
    {
      title: 'cityToCity',
      description: 'cityToCityDescription',
      icon: 'fa-building'
    },
    {
      title: 'freeRides',
      description: 'freeRidesDescription',
      icon: 'fa-car-alt'
    }
  ];


}
