import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AdminRoutingModule} from './admin-routing.module';
import {DashboardComponent} from './dashboard/dashboard.component';
import {DestinationComponent} from './destination/destination.component';
import {AdminLayoutComponent} from './admin-layout/admin-layout.component';
import {ReservationsComponent} from './reservation/reservation.component';
import {AdminErrorPageComponent} from './admin-error-page/admin-error-page.component';
import {CitiesComponent} from './cities/cities.component';
import {CitiesEditComponent} from './cities/cities-edit/cities-edit.component';
import {FormsModule} from '@angular/forms';
import {SharedModule} from '../shared/shared.module';
import { LocationsComponent } from './locations/locations.component';
import { DocumentsComponent } from './documents/documents.component';
import { DamageReportsComponent } from './damage-reports/damage-reports.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { InsuranceComponent } from './insurance/insurance.component';


@NgModule({
  declarations: [
    DashboardComponent,
    DestinationComponent,
    AdminLayoutComponent,
    ReservationsComponent,
    AdminErrorPageComponent,
    CitiesComponent,
    CitiesEditComponent,
    LocationsComponent,
    DocumentsComponent,
    DamageReportsComponent,
    InvoiceComponent,
    InsuranceComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    SharedModule // Omogućava pristup svemu što je eksportovano iz SharedModule
  ],
  providers: []
})
export class AdminModule {
}
