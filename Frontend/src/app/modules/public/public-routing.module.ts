import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PublicLayoutComponent} from './component/public-layout/public-layout.component';
import {HomeComponent} from './view/home/home.component';
import {AboutComponent} from './view/about/about.component';
import {BlogComponent} from './view/blog/blog.component';
import {ServiceComponent} from './view/service/service.component';
import {ContactComponent} from './view/contact/contact.component';
import {FeatureComponent} from './view/feature/feature.component';
import {OurTeamsComponent} from './view/our-teams/our-teams.component';
import {CarsComponent} from './view/cars/cars.component';
import {Error404Component} from './component/error404/error404.component';
import { GeneratePonudaComponent } from './view/generateOffers/generate-ponuda.component';
import { UserDashboardComponent } from './view/user-dashboard/user-dashboard.component';
import {MoveToCartComponent} from './view/move-to-cart/move-to-cart.component';

const routes: Routes = [
  {
    path: '', component: PublicLayoutComponent, children: [
      {path: '', redirectTo: 'home', pathMatch: 'full'},
      {path: 'home', component: HomeComponent},
      {path: 'about', component: AboutComponent},
      {path: 'blog', component: BlogComponent},
      {path: 'service', component: ServiceComponent},
      {path: 'contact', component: ContactComponent},
      {path: 'feature', component: FeatureComponent},
      {path: 'our-teams',component: OurTeamsComponent},
      {path: 'cars',component: CarsComponent},
      {path: 'generateOffers', component: GeneratePonudaComponent},
      {path: 'user', component: UserDashboardComponent},
      {path: 'move-to-cart', component: MoveToCartComponent},
      {path: '**', component:Error404Component}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
