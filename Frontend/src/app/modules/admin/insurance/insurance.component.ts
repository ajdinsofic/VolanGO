import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Insurance, InsuranceService } from '../../../services/insurance.service';

@Component({
  selector: 'app-insurance',
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.css'],
})
export class InsuranceComponent implements OnInit {
  insurances: Insurance[] = [];
  filteredInsurances: Insurance[] = [];
  insuranceForm: FormGroup;
  isEditMode = false;
  selectedInsuranceId: number | null = null;
  minPrice: number | null = null;
  maxPrice: number | null = null;

  constructor(
    private insuranceService: InsuranceService,
    private fb: FormBuilder
  ) {
    this.insuranceForm = this.fb.group({
      reservationId: [null, [Validators.required, Validators.pattern('^[0-9]+$')]], // Only numbers
      insuranceType: [null, [Validators.required, Validators.pattern('^[A-Za-z]+$'), Validators.minLength(3)]], // Letters only, min 3 chars
      cost: [null, [Validators.required, Validators.min(0.01)]], // Number, must be greater than 0
      startDate: [null, [Validators.required]],
      endDate: [null, [Validators.required]],
      provider: [null, [Validators.required, Validators.pattern('^[A-Za-z]+$'), Validators.minLength(3)]], // Letters only, min 3 chars
      policyNumber: [null, [Validators.required, Validators.pattern('^[0-9]{5,}$')]], // Only numbers, min 5 digits
      termsAndConditions: [null],
    });
  }

  ngOnInit(): void {
    this.loadInsurances();
    this.filteredInsurances = [...this.insurances];
  }

  loadInsurances(): void {
    this.insuranceService.getInsurances().subscribe((data) => {
      this.insurances = data;
      this.filteredInsurances = data;
    });
  }

  applyPriceFilter(): void {
    this.filteredInsurances = this.insurances.filter((insurance) => {
      const matchesMinPrice = this.minPrice === null || insurance.cost >= this.minPrice;
      const matchesMaxPrice = this.maxPrice === null || insurance.cost <= this.maxPrice;

      return matchesMinPrice && matchesMaxPrice;
    });
  }

  clearFilter(): void {
    this.minPrice = null;
    this.maxPrice = null;
    this.filteredInsurances = [...this.insurances];
  }


  onSubmit(): void {
    if (this.insuranceForm.valid) {
      if (this.isEditMode && this.selectedInsuranceId !== null) {
        this.insuranceService
          .updateInsurance(this.selectedInsuranceId, this.insuranceForm.value)
          .subscribe(() => {
            this.loadInsurances();
            this.resetForm();
          });
      } else {
        this.insuranceService.createInsurance(this.insuranceForm.value).subscribe(
          () => {
            this.loadInsurances();
            this.resetForm();
          },
          (error) => {
            console.error('Error creating insurance:', error);
            alert('Failed to create insurance.');
          }
        );
      }
    }
  }

  onEdit(insurance: Insurance): void {
    this.isEditMode = true;
    this.selectedInsuranceId = insurance.insuranceId;
    this.insuranceForm.patchValue(insurance);
  }

  onDelete(id: number): void {
    this.insuranceService.deleteInsurance(id).subscribe(() => {
      this.loadInsurances();
    });
  }

  resetForm(): void {
    this.isEditMode = false;
    this.selectedInsuranceId = null;
    this.insuranceForm.reset();
  }

  isFieldInvalid(field: string): boolean {
    const control = this.insuranceForm.get(field);
    return control ? control.invalid && control.touched : false;
  }

  getErrorMessage(field: string): string {
    const control = this.insuranceForm.get(field);
    if (control?.hasError('required')) {
      return `${field} is required.`;
    }
    if (control?.hasError('pattern')) {
      return `${field} must be a valid input.`;
    }
    if (control?.hasError('min')) {
      return `${field} must be greater than or equal to 0.`;
    }
    if (control?.hasError('minLength')) {
      return `${field} must be at least 3 characters long.`;
    }
    return '';
  }
}
