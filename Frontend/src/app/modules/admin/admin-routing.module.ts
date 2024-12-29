import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminLayoutComponent} from './admin-layout/admin-layout.component';
import {DestinationComponent} from './destination/destination.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {ReservationsComponent} from './reservation/reservation.component';
import {AdminErrorPageComponent} from './admin-error-page/admin-error-page.component';
import {CitiesComponent} from './cities/cities.component';
import {CitiesEditComponent} from './cities/cities-edit/cities-edit.component';
import  {LocationsComponent} from './locations/locations.component';
import { DamageReportsComponent } from './damage-reports/damage-reports.component';
import { DocumentsComponent } from './documents/documents.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { InsuranceComponent } from './insurance/insurance.component';
const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      {path: 'dashboard', component: DashboardComponent},
      {path: 'locations', component: LocationsComponent },
      {path: 'damage-reports', component: DamageReportsComponent },
      {path: 'cities', component: CitiesComponent},
      {path: 'cities/new', component: CitiesEditComponent},
      {path: 'cities/edit/:id', component: CitiesEditComponent},
      {path: 'destination', component: DestinationComponent},
      {path: 'reservation', component: ReservationsComponent},
      {path: 'documentation', component: DocumentsComponent},
      {path: 'invoice', component: InvoiceComponent},
      {path: 'insurance', component: InsuranceComponent},
      {path: '**', component: AdminErrorPageComponent}, // Default ruta
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {
}
