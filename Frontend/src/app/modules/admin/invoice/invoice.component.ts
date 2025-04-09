  import {Component, OnInit} from '@angular/core';
  import {Invoice, InvoiceService} from "../../../services/invoice.service";
  import {FormBuilder, FormGroup, Validators} from "@angular/forms";

  @Component({
    selector: 'app-invoice',
    templateUrl: './invoice.component.html',
    styleUrl: './invoice.component.css'
  })
  export class InvoiceComponent implements OnInit  {
    invoices: Invoice[] = [];
    invoiceForm: FormGroup;
    isEditMode = false;
    selectedInvoiceId: number | null = null;
    filteredInvoices: Invoice[] = [];
    minAmount: number | null = null;
    maxAmount: number | null = null;


    constructor(
        private invoiceService: InvoiceService,
        private fb: FormBuilder
    ) {
      this.invoiceForm = this.fb.group({
        reservationId: [null, [Validators.required, Validators.pattern('^[0-9]+$')]],  // Only numbers
        invoiceDate: [null, [Validators.required]],
        amount: [null, [Validators.required, Validators.min(0)]],  // Amount must be >= 0
        paymentMethod: [null, [Validators.required, Validators.minLength(3)]],  // At least 3 characters
        status: [null, [Validators.required, Validators.minLength(3)]]
      });
    }

    ngOnInit(): void {
      this.loadInvoices();
      this.filteredInvoices = [...this.invoices];
    }


    loadInvoices(): void {
      this.invoiceService.getInvoices().subscribe((data) => {
        this.invoices = data;
        this.filteredInvoices = data;
      });
    }

    applyAmountFilter(): void {
      this.filteredInvoices = this.invoices.filter((invoice) => {
        const matchesMinAmount = this.minAmount === null || invoice.amount >= this.minAmount;
        const matchesMaxAmount = this.maxAmount === null || invoice.amount <= this.maxAmount;

        return matchesMinAmount && matchesMaxAmount;
      });
    }

    // Clear the filter and show all invoices
    clearFilter(): void {
      this.minAmount = null;
      this.maxAmount = null;
      this.filteredInvoices = [...this.invoices];
    }

    onSubmit(): void {
      this.invoiceForm.markAllAsTouched();
      if (this.invoiceForm.valid) {
        if (this.isEditMode && this.selectedInvoiceId !== null) {
          this.invoiceService
              .updateInvoice(this.selectedInvoiceId, this.invoiceForm.value)
              .subscribe(() => {
                this.loadInvoices();
                this.resetForm();
              });
        } else {
          this.invoiceService.createInvoice(this.invoiceForm.value).subscribe(
              () => {
                this.loadInvoices();
                this.resetForm();
              },
              (error) => {
                console.error('Error creating invoice:', error);
                alert('Failed to create invoice. Please check the entered data.');
              }
          );
        }
      }
    }

    onEdit(invoice: Invoice): void {
      this.isEditMode = true;
      this.selectedInvoiceId = invoice.invoiceId;
      this.invoiceForm.patchValue(invoice);
    }

    onDelete(id: number): void {
        this.invoiceService.deleteInvoice(id).subscribe({
          next: () => {
            this.loadInvoices(); // Reload the invoices after deletion
          },
          error: (error) => {
            console.error('Error deleting invoice:', error);
            alert('Failed to delete the invoice. Please try again.');
          },
        });

    }

    resetForm(): void {
      this.isEditMode = false;
      this.selectedInvoiceId = null;
      this.invoiceForm.reset();
    }


    // Helper method to check if the form control is valid
    isFieldInvalid(field: string): boolean {
      const control = this.invoiceForm.get(field);
      return control ? control.invalid && control.touched : false;
    }

    // Helper method to get the error message for a form control
    getErrorMessage(field: string): string {
      const control = this.invoiceForm.get(field);
      if (control?.hasError('required')) {
        return `${field} is required.`;
      }
      if (control?.hasError('pattern')) {
        return `${field} must be a valid number.`;
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
