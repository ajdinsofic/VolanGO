import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UserLayoutComponent} from './user-layout/user-layout.component';
import {UserDashboardComponent} from './user-dashboard/user-dashboard.component';
import {ReservationComponent} from './reservation/reservation.component';


const routes: Routes = [
  {
    path: '',
    component: UserLayoutComponent,
    children: [
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      {path: 'dashboard', component: UserDashboardComponent},
      {path: 'reservation', component: ReservationComponent},
      {path: '**', redirectTo: 'dashboard'}
    ]

  }

];


// path: '',
//   component: AdminLayoutComponent,
//   children: [
//   {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
//   {path: 'dashboard', component: DashboardComponent},
//   {path: 'cities', component: CitiesComponent},
//   {path: 'cities/new', component: CitiesEditComponent},
//   {path: 'cities/edit/:id', component: CitiesEditComponent},
//   {path: 'destination', component: DestinationComponent},
//   {path: 'order', component: ReservationComponent},
//   {path: '**', component: AdminErrorPageComponent} // Default ruta
// ]



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
