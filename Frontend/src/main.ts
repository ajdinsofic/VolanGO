// import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
//
// import { AppModule } from './app/app.module';
//
// platformBrowserDynamic().bootstrapModule(AppModule, {
//   ngZoneEventCoalescing: true
// })
//   .catch(err => console.error(err));


import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { appRoutes } from './app/app-routing.module';
import { MyAuthInterceptor } from './app/services/auth-services/my-auth-interceptor.service';
import { MyAuthService } from './app/services/auth-services/my-auth.service';
import {HttpService} from './app/services/http.service';

//radi-standard
// bootstrapApplication(AppComponent, {
//   providers: [
//     provideHttpClient(
//       // withInterceptors([MyAuthInterceptor]) // Adding HTTP interceptors
//     ),
//     provideRouter(appRoutes), // Routing configuration
//     MyAuthService, // Register MyAuthService
//     HttpService
//   ],
// }).catch((err) => console.error(err));

//test
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
