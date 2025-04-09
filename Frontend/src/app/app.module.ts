import {NgModule} from '@angular/core';
import {BrowserModule, Title} from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule, provideHttpClient} from '@angular/common/http';
import {MyAuthInterceptor} from './services/auth-services/my-auth-interceptor.service';
import {MyAuthService} from './services/auth-services/my-auth.service';
import {SharedModule} from './modules/shared/shared.module';
import {ErrorInterceptor} from './services/auth-services/error-interceptor';
import {RouterModule} from '@angular/router';
import { GoogleMapsModule } from '@angular/google-maps';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ChatBoxComponent } from './chat-box/chat-box.component';
import { NgxPasswordStrengthMeter } from 'ngx-password-strength-meter';



export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [AppComponent, ChatBoxComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    SharedModule,
    RouterModule,
    NgxPasswordStrengthMeter,
    GoogleMapsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    // provideHttpClient(),
    HttpClient,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MyAuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
        useClass: ErrorInterceptor,
      multi: true // Ensures multiple interceptors can be used if needed
    },
    MyAuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}