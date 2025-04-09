import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot} from '@angular/router';
import {jwtDecode} from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';

export const AuthGuardServiceUser: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const cookieService = inject(CookieService);

  // Uzmi access token iz kolačića
  const token = cookieService.get('accessToken');

  if (!token) {
    // Ako token ne postoji, redirektuj na login stranicu
    return true;
  }

  try {
    // Dekodiraj token
    const decodedToken: any = jwtDecode(token);

    // Proveri rolu korisnika iz tokena
    const userRole = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    ; // Pretpostavljamo da je rola u tokenu pod ključem 'role'

    // Proveri da li korisnik ima odgovarajuću rolu
    if (userRole === 'user') {
      // Ako rola u tokenu odgovara roli rute, dozvolite pristup
      return true;
    } else {
      // Ako nema odgovarajuću rolu, redirektujte na stranicu za pristup odbijen
      return false;
    }
  } catch (error) {
    console.error('Error decoding token', error);
    // U slučaju greške u dekodiranju tokena, redirektujte na login
    return false;
  }
};

export const AuthGuardServiceAdmin: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const cookieService = inject(CookieService);

  // Uzmi access token iz kolačića
  const token = cookieService.get('accessToken');

  if (!token) {
    // Ako token ne postoji, redirektuj na login stranicu
    return true;
  }

  try {
    // Dekodiraj token
    const decodedToken: any = jwtDecode(token);

    // Proveri rolu korisnika iz tokena
    const userRole = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    ; // Pretpostavljamo da je rola u tokenu pod ključem 'role'

    // Proveri da li korisnik ima odgovarajuću rolu
    if (userRole === 'admin') {
      // Ako rola u tokenu odgovara roli rute, dozvolite pristup
      return true;
    } else {
      // Ako nema odgovarajuću rolu, redirektujte na stranicu za pristup odbijen
      return false;
    }
  } catch (error) {
    console.error('Error decoding token', error);
    // U slučaju greške u dekodiranju tokena, redirektujte na login
    return false;
  }
};

// export const AuthGuardService: CanActivateFn = (route, state) => {
//   const authService = inject(MyAuthService);
//   const router = inject(Router);

//   return authService.isLoggedIn().pipe(
//     map(isAuthenticated => {
//       if (!isAuthenticated) {
//         router.navigateByUrl('/login');
//         return false;
//       }

//       // Provjera rute i uloge
//       const expectedRole = route.data['role']; // Npr., { role: 'admin' } u ruti
//       if (expectedRole) {
//         return authService.getUserRole().pipe(
//           map(userRole => {
//             if (userRole === expectedRole) {
//               return true;
//             } else {
//               router.navigateByUrl('/public/home'); // Ili druga stranica za neprihvatljive korisnike
//               return false;
//             }
//           }),
//           catchError(() => {
//             router.navigateByUrl('/login');
//             return of(false);
//           })
//         );
//       }

//       return true; // Ako ruta ne zahtijeva specifičnu ulogu
//     }),
//     catchError(() => {
//       router.navigateByUrl('/login');
//       return of(false);
//     })
//   );
// };






// export class AuthGuardData {
//   isAdmin?: boolean;
//   isUser?: boolean;
// }
//
// @Injectable({
//   providedIn: 'root'
// })
// export class AuthGuard  implements CanActivate {
//
//   //
//   constructor(private authService: MyAuthService, private router: Router) {
//   }
//
//   canActivate(): boolean {
//     const authInfo = this.authService.getMyAuthInfo();
//     console.log('Auth Info in Guard:', authInfo);
//     if (authInfo?.isLoggedIn) {
//       return true; // Allow access if logged in
//     }
//     // Redirect to login if not logged in
//     this.router.navigate(['/auth/login']);
//     return false;
//   }

  // canActivate(route: ActivatedRouteSnapshot): boolean {
  //   const guardData = route.data as AuthGuardData;  // Cast to AuthGuardData
  //
  //
  //   // Provjera da li je korisnik prijavljen
  //   /*
  //   if (!this.authService.isLoggedIn()) {
  //     this.router.navigate(['/auth/login']);
  //     return false;
  //   }*/
  //
  //   // Provjera prava pristupa za administratora
  //   if (guardData.isAdmin && !this.authService.isAdmin()) {
  //     this.router.navigate(['/unauthorized']);
  //     return false;
  //   }
  //
  //   // Provjera prava pristupa za menadžera
  //   if (guardData.isUser && !this.authService.isUser()) {
  //     this.router.navigate(['/unauthorized']);
  //     return false;
  //   }
  //
  //   return true; // Dozvoljen pristup
  // }

// }
