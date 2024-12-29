import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserLayoutComponent } from './user-layout/user-layout.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { ReservationComponent } from './reservation/reservation.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [

    UserLayoutComponent,
    UserDashboardComponent,
    ReservationComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule
  ]
})
export class UserModule { }
