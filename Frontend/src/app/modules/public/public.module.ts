import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PublicRoutingModule} from './public-routing.module';

import {PublicLayoutComponent} from './component/public-layout/public-layout.component';

import {FormsModule} from '@angular/forms';
import { HomeComponent } from './view/home/home.component';
import { FooterComponent } from './component/footer/footer.component';
import { HeaderComponent } from './component/header/header.component';
import { FeaturesPieceComponent } from './component/features-piece/features-piece.component';
import { AboutPieceComponent } from './component/about-piece/about-piece.component';
import { FactCounterComponent } from './component/fact-counter/fact-counter.component';
import { ServicePieceComponent } from './component/service-piece/service-piece.component';
import { CategoriesPieceComponent } from './component/categories-piece/categories-piece.component';
import { CentralProcessComponent } from './component/central-process/central-process.component';
import { BlogPiecesComponent } from './component/blog-pieces/blog-pieces.component';
import { BannerComponent } from './component/banner/banner.component';
import { TeamsComponent } from './component/teams/teams.component';
import { AboutComponent } from './view/about/about.component';
import { ServiceComponent } from './view/service/service.component';
import { BlogComponent } from './view/blog/blog.component';
import { FeatureComponent } from './view/feature/feature.component';
import { CarsComponent } from './view/cars/cars.component';
import { OurTeamsComponent } from './view/our-teams/our-teams.component';
import { ContactComponent } from './view/contact/contact.component';
import { Error404Component } from './component/error404/error404.component';
import { UserDashboardComponent } from './view/user-dashboard/user-dashboard.component';
import { GeneratePonudaComponent } from './view/generateOffers/generate-ponuda.component';
import {NgbCollapse} from '@ng-bootstrap/ng-bootstrap';
import {TranslatePipe} from '@ngx-translate/core';
import { MoveToCartComponent } from './view/move-to-cart/move-to-cart.component';





@NgModule({
  declarations: [
     PublicLayoutComponent,
     HomeComponent,
     FooterComponent,
     HeaderComponent,
     FeaturesPieceComponent,
     AboutPieceComponent,
     FactCounterComponent,
     ServicePieceComponent,
     CategoriesPieceComponent,
     CentralProcessComponent,
     BlogPiecesComponent,
     BannerComponent,
     TeamsComponent,
     AboutComponent,
     ServiceComponent,
     BlogComponent,
     FeatureComponent,
     CarsComponent,
     OurTeamsComponent,
     ContactComponent,
     Error404Component,
     MoveToCartComponent,
     GeneratePonudaComponent

  ],
  imports: [
    CommonModule,
    PublicRoutingModule,
    FormsModule,
    NgbCollapse,
    TranslatePipe,
    // TeamsComponent,
    // AboutPieceComponent,
    // FactCounterComponent,
    // FeaturesPieceComponent,
    // CentralProcessComponent,
    // BannerComponent,
    // BlogPiecesComponent,
    // CategoriesPieceComponent,
    // ServicePieceComponent
  ],

})
export class PublicModule {
}
