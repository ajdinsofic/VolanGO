import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthRoutingModule} from './auth-routing.module';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {ForgetPasswordComponent} from './forget-password/forget-password.component';
import {TwoFactorComponent} from './two-factor/two-factor.component';
import {FormsModule} from '@angular/forms';
import { LogoutComponent } from './logout/logout.component';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { NgxCaptchaModule } from 'ngx-captcha';
import { VerificationComponent } from './verification/verification.component';
import { NgxPasswordStrengthMeter } from 'ngx-password-strength-meter';




@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    ForgetPasswordComponent,
    TwoFactorComponent,
    LogoutComponent,
    AuthLayoutComponent,
    VerificationComponent,
  ],
  imports: [
    CommonModule,
    NgxCaptchaModule,
    NgxPasswordStrengthMeter,
    AuthRoutingModule,
    FormsModule
  ]
})
export class AuthModule {
}
