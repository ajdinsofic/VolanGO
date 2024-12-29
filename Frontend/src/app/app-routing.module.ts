import {NgModule} from '@angular/core';
import {RouterModule, Routes,PreloadAllModules} from '@angular/router';
import {UnauthorizedComponent} from './modules/shared/unauthorized/unauthorized.component';
import {AuthGuardServiceUser} from './auth-guards/auth-guard.service';
import {AuthGuardServiceAdmin} from './auth-guards/auth-guard.service';


export const appRoutes: Routes = [
  {path: 'unauthorized', component: UnauthorizedComponent},
  {
    path: 'admin',
    canActivate: [AuthGuardServiceAdmin], // Proslijeđivanje potrebnih prava pristupa, ako je potrebno
    loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule)  // Lazy load  modula
  },
  {
    path: 'public',
    canActivate: [AuthGuardServiceUser],
    loadChildren: () => import('./modules/public/public.module').then(m => m.PublicModule) // Lazy load  modula
  },
  {
    path: 'client',
    loadChildren: () => import('./modules/client/client.module').then(m => m.ClientModule)  // Lazy load  modula
  },
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule)  // Lazy load  modula
  },
  { path: 'user',
    loadChildren: () => import('./modules/user/user.module').then(m => m.UserModule) },

  {path: '**', redirectTo: 'public', pathMatch: 'full'}  // Default ruta koja vodi na public
];



@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {
      preloadingStrategy: PreloadAllModules
    }),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
