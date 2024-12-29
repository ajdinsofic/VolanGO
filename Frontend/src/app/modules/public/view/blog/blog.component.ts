import { Component } from '@angular/core';
import {BlogPiecesComponent} from '../../component/blog-pieces/blog-pieces.component';
import {FactCounterComponent} from '../../component/fact-counter/fact-counter.component';
import {BannerComponent} from '../../component/banner/banner.component';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css',
  // standalone:true,
  // imports: [
  //   BlogPiecesComponent,
  //   FactCounterComponent,
  //   BannerComponent,
  //   RouterLink
  // ]
})
export class BlogComponent {

}
