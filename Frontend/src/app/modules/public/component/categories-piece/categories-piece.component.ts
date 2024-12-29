import {AfterViewInit, Component, OnInit} from '@angular/core';
import {NgForOf} from '@angular/common';

declare var $: any;

interface Vehicle {
  name: string;
  img: string;
  review: string;
  stars: number;
  price: string;
  details: string[];
}

@Component({
  selector: 'app-categories-piece',
  templateUrl: './categories-piece.component.html',
  styleUrl: './categories-piece.component.css',
  // standalone:true,
  // imports: [
  //   NgForOf
  // ]
})
export class CategoriesPieceComponent implements AfterViewInit{

  ngAfterViewInit(): void {
    $('.categories-carousel').owlCarousel({
      autoplay: true,
      smartSpeed: 1000,
      margin: 25,
      loop: true,
      nav: true,
      dots: true,
      responsive: {
        0: { items: 1 },
        576: { items: 2 },
        768: { items: 3 },
        // 992: { items: 4 }
      }
    });
  }


  vehicles = [
    {
      name: 'Mercedes Benz R3',
      img: '/assets/img/car-1.png',
      review: '4.5 Review',
      stars: 4.5,
      price: '$99:00/Day',
      details: ['4 Seat', 'AT/MT', 'Petrol', '2015', 'AUTO', '27K']
    },
    {
      name: 'Toyota Corolla Cross',
      img: '/assets/img/car-2.png',
      review: '3.5 Review',
      stars: 3.5,
      price: '$128:00/Day',
      details: ['4 Seat', 'AT/MT', 'Petrol', '2015', 'AUTO', '27K']
    },
    {
      name: 'Tesla Model S Plaid',
      img: '/assets/img/car-3.png',
      review: '3.8 Review',
      stars: 3.8,
      price: '$170:00/Day',
      details: ['4 Seat', 'AT/MT', 'Petrol', '2015', 'AUTO', '27K']
    },
    {
      name: 'Hyundai Kona Electric',
      img: '/assets/img/car-4.png',
      review: '4.8 Review',
      stars: 4.8,
      price: '$187:00/Day',
      details: ['4 Seat', 'AT/MT', 'Petrol', '2015', 'AUTO', '27K']
    }
  ];


  generateStars(rating: number): string[] {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 > 0 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    return [
      ...Array(fullStars).fill('fas fa-star'), // Full stars
      ...Array(halfStar).fill('fas fa-star-half-alt'), // Half star
      ...Array(emptyStars).fill('far fa-star') // Empty stars
    ];
  }

}
