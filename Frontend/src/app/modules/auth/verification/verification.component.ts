import { Component, OnInit } from '@angular/core';
import { MyAuthService } from '../../../services/auth-services/my-auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.css'],
})
export class VerificationComponent implements OnInit {
  email: string = '';
  code: string = '';
  message: string = '';
  isCodeExpired: boolean = false;
  canResendCode: boolean = false;
  countdown: number = 60;

  constructor(private authService: MyAuthService, private router: Router) {}

  ngOnInit(): void {
    const savedEmail = sessionStorage.getItem('email');
    if (!savedEmail) {
      this.router.navigate(['/register']);
    } else {
      this.email = savedEmail;
      this.startCountdown();
    }
    this.resendCode();
  }

  verifyCode(): void {
    this.authService.verifyEmail(this.email, this.code).subscribe({
      next: (res) => {
        this.message = 'Verification successful! Redirecting...';
        setTimeout(() => {
          sessionStorage.removeItem('email');
          console.log(res);
          this.router.navigate(['/auth/login']);
        }, 2000);
      },
      error: (err) => {
        this.message =
          JSON.stringify(err.error);
      },
    });
  }

  resendCode(): void {
    this.message = ''; // Reset any previous message
    this.authService.sendVerificationEmail(this.email).subscribe({
      next: () => {
        this.message = 'Verification code resent successfully!';
        this.canResendCode = false;
        this.startCountdown(); // Start 60-second countdown
      },
      error: (error) => {
        console.error('Error resending verification email:', error);
        this.message = error.error?.message || 'Error sending verification code. Please try again.';
      },
    });
  }

  startCountdown(): void {
    this.canResendCode = false;
    this.countdown = 60;
    const timer = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        this.canResendCode = true;
        clearInterval(timer);
      }
    }, 1000);
  }
}
