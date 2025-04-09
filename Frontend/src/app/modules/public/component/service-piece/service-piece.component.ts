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

  sectionDescription = 'Our central service is dedicated to providing quick, efficient support for all your car rental needs. Whether you have questions or need assistance, our team is always ready to help you have a smooth experience.';

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
