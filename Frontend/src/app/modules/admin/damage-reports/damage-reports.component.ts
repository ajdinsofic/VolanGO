import { Component, OnInit } from '@angular/core';
import { DamageReportsService, DamageReport } from '../../../services/damage-reports.service';
import {User} from '../../../services/auth-services/dto/user.model';
import {Vehicle} from '../../../services/auth-services/dto/vehicle.model';
import {Reservation} from '../../../services/auth-services/dto/reservation.model';

@Component({
  selector: 'app-damage-reports',
  templateUrl: './damage-reports.component.html',
  styleUrls: ['./damage-reports.component.css']
})
export class DamageReportsComponent implements OnInit {
  damageReports: DamageReport[] = [];
  reservations: any[] = [];
  vehicles: any[] = [];
  users: any[] = [];

  adding = false;
  editing = false;

  currentReport: DamageReport = {
    damageReportId: 0,
    reservationId: 0,
    vehicleId: 0,
    userId: 0,
    reportDate: '',
    description: '',
    estimatedRepairCost: 0,
    status: ''
  };

  constructor(private service: DamageReportsService) {}

  ngOnInit(): void {
    this.fetchData();
    this.loadDropdownData();
  }

  fetchData() {
    this.service.getAll().subscribe((data: DamageReport[]) => {
      this.damageReports = data;
    });
  }

  loadDropdownData() {
    this.service.getReservations().subscribe((data: Reservation[]) => {
      this.reservations = data;
    });

    this.service.getVehicles().subscribe((data: Vehicle[]) => {
      this.vehicles = data;
    });

    this.service.getUsers().subscribe((data: User[]) => {
      this.users = data;
    });
  }

  addReport() {
    this.adding = true;
    this.editing = false;
    this.currentReport = {
      damageReportId: 0,
      reservationId: 0,
      vehicleId: 0,
      userId: 0,
      reportDate: '',
      description: '',
      estimatedRepairCost: 0,
      status: ''
    };
  }

  editReport(report: DamageReport) {
    this.editing = true;
    this.adding = false;
    this.currentReport = { ...report };
  }

  save() {
    // Ensure the reportDate is converted to a proper ISO string in UTC format
    if (this.currentReport.reportDate) {
      const date = new Date(this.currentReport.reportDate);
      this.currentReport.reportDate = date.toISOString(); // Converts to UTC
    }

    if (this.editing) {
      this.service
        .update(this.currentReport.damageReportId, this.currentReport)
        .subscribe(
          () => this.handleSuccess(),
          (error) => console.error('Error updating report:', error)
        );
    } else {
      this.service
        .create(this.currentReport)
        .subscribe(
          () => this.handleSuccess(),
          (error) => console.error('Error creating report:', error)
        );
    }
  }

  delete(id: number) {
    this.service.delete(id).subscribe(() => this.fetchData());
  }

  handleSuccess() {
    this.adding = false;
    this.editing = false;
    this.fetchData();
  }

  cancel() {
    this.adding = false;
    this.editing = false;
  }
}
