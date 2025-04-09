import { Component } from '@angular/core';
import { Router } from '@angular/router';

import {RegisterRequest} from './register-request.modul';
import {AuthRegisterService} from '../../../services/auth-services/auth-register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  currentStep: number = 1;
  registerRequest: RegisterRequest = {
    UserName: '',
    FirstName: '',
    LastName: '',
    Email: '',
    PhoneNumber: '',
    Gender: '',
    Password: '',
    DateOfBirth: '',
  };

  errorMessage: string | null = null;
  captchaResponse: string | null = null;

  constructor(private registerService: AuthRegisterService, private router: Router) {}

  nextStep() {
    if (this.currentStep < 4) {
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  onCaptchaResolved(response: string | null) {
    this.captchaResponse = response; // Save the token
  }

  onSubmit(): void {
    if(this.captchaResponse){
      const registerPayload ={
        ...this.registerRequest,
        captchaToken: this.captchaResponse,
      };
      // Validate data (optional)
      console.log(this.registerRequest);
      if (this.registerRequest.Password.length < 6) {
        this.errorMessage = 'Password must be at least 6 characters long.';
        return;
      }

      // Call the service to send the data to the backend
      this.registerService.register(registerPayload).subscribe({
        next: () => {
          console.log('Registration successful');
          sessionStorage.setItem('email', this.registerRequest.Email);
          alert("Registracija uspjesna")
          this.router.navigate(['/public-/view/home']);
        },
        error: (error) => {
          console.error('Registration error:', error);
          this.errorMessage = 'An error occurred during registration.';
        },
      });
    }
  }
}
