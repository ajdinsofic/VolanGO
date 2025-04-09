import { Component } from '@angular/core';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-blog-pieces',
  templateUrl: './blog-pieces.component.html',
  styleUrl: './blog-pieces.component.css',
  // standalone:true,
  // imports: [
  //   NgForOf
  // ]
})
export class BlogPiecesComponent {
  blogPosts = [
    {
      date: '30 Dec 2025',
      author: 'Martin.C',
      comments: 15,
      titleKey: 'rentalFinesTitle',
      descriptionKey: 'rentalFinesDescription',
      image: '/assets/img/blog-1.jpg',
      delay: '0.1s',
    },
    {
      date: '25 Dec 2025',
      author: 'Sarah.M',
      comments: 38,
      titleKey: 'rentalCostTitle',
      descriptionKey: 'rentalCostDescription',
      image: '/assets/img/blog-2.jpg',
      delay: '0.3s',
    },
    {
      date: '27 Dec 2025',
      author: 'John.P',
      comments: 78,
      titleKey: 'requiredDocsTitle',
      descriptionKey: 'requiredDocsDescription',
      image: '/assets/img/blog-3.jpg',
      delay: '0.5s',
    },
  ];
  getDelay(post: any): string {
    if (post.title === 'Rental Cars how to check driving fines?') {
      return '0.1s';
    } else if (post.title === 'Rental cost of sport and other cars') {
      return '0.3s';
    } else {
      return '0.5s';
    }
  }
}
