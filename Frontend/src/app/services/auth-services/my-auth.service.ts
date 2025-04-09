import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import { CookieService } from 'ngx-cookie-service';
import {Injectable} from "@angular/core";
import {MyAuthInfo} from "./dto/my-auth-info";
import {LoginTokenDto} from './dto/login-token-dto';
import {LoginRequest} from '../../modules/auth/login/dto/login-request';
import {LoginReponse} from '../../modules/auth/login/dto/login-responce';
import {map, Observable, of} from 'rxjs';
import {MyConfig} from '../../my-config';
import {catchError} from 'rxjs/operators';
import { ActivatedRoute, Router } from "@angular/router";
import { filterRequest } from "../../modules/public/view/generateOffers/dto/filterRequest";
import { RequestUser } from "../../modules/user/dto/user";



@Injectable(
  {providedIn: 'root'}
)



export class MyAuthService {
  private http: any;
  vehicles: any;

  constructor(private httpClient: HttpClient, private cookieService: CookieService, private route : Router, private router: ActivatedRoute) {
  }
  private apiUrl = `${MyConfig.api_address}`;
  //`${MyConfig.api_address}/login`
  //kurs
  login(credentials: LoginRequest): Observable<LoginReponse> {
    return this.httpClient.post<LoginReponse>(`${this.apiUrl}/login`, credentials)
      .pipe(map(response => {
          document.cookie = `accessToken=${response.accessToken};`;
          document.cookie = `refreshToken=${response.refreshToken};`;
          document.cookie = `userId=${response.userId};`;
        return response;
      }))
  }

  sendVerificationEmail(email: string): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/api/verification/send-verification-email`, JSON.stringify(email), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  verifyEmail(email: string, code: string): Observable<any> {
    const body = {
      email:email.trim(),
      code:code.trim()
    };
    return this.httpClient.post(`${this.apiUrl}/api/verification/verify-email`, body, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  refreshToken() : Observable<LoginReponse> {
    const refreshToken = this.getRefreshTOkenFromCookie();

    return this.httpClient.post<LoginReponse>(this.apiUrl, { refreshToken})
      .pipe(map (response=>{
        document.cookie = `accessToken = ${response.accessToken};`;
      document.cookie =`refreshToken = ${response.refreshToken};`;
      return response;
    }))
  }

  private getRefreshTOkenFromCookie():string | null{
    const cookieString = document.cookie;
    const cookieArray = cookieString.split('; ');
    for (const cookie of cookieArray) {
      const [name, value] = cookie.split('=');

      if(name == 'refreshToken'){
        return value;
      }
    }

    return null;
  }

  getAccessToken(): string | null {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [key, value] = cookie.split('=');
      if (key.trim() === 'accessToken') {
        return decodeURIComponent(value); // Decode if URL-encoded
      }
    }
    return null;
  }

  isLoggedIn(): Observable<boolean | string>{
    const token = this.getAccessToken();
    // Uzmi token iz localStorage

    if (token === null) {
        return of(false); // Ako token ne postoji, vrati false
    }

    // Pošaljemo token u request body kao objekat { token: accessToken }
    return this.isAdminOrUser(token);

  }

  getDropOffLocations(): Observable<any>{
     return this.httpClient.get(`${this.apiUrl}/get/locations`);
  }

  getFilterVehicles(filter: any, page: number, pageSize: number): Observable<any> {
    // Kreiranje HttpParams objekta
    let params = new HttpParams();
  
    // Dodavanje filtera u HttpParams
    for (const key in filter) {
      if (filter[key]) {
        params = params.set(key, filter[key]);
      }
    }
  
    // Dodavanje parametara za paginaciju
    params = params.set('page', page.toString());
    params = params.set('pageSize', pageSize.toString());
  
    // Slanje GET zahteva sa parametrima
    return this.httpClient.get<any>(`${this.apiUrl}/get/filter`, { params });
  }
  // isAdminOrUser(token: string | null) : Observable<boolean>{
  //   if(token == null){
  //     return of(false)
  //   }
  //   return this.httpClient.post(`${this.apiUrl}/search/isAdminOrUser`, { token })
  //       .pipe(
  //           map(() => true),  // Ako backend vrati uspješan odgovor, korisnik je logovan
  //           catchError(() => of(false))  // Ako dođe do greške, vrati false
  //       );
  // }

  isAdminOrUser(token: string | null): Observable<boolean | string> {
    if (token == null) {
        return of(false);
    }

    return this.httpClient.post<{ role: string }>(`${this.apiUrl}/search/isAdminOrUser`, { token })
        .pipe(
            map(response => {
                if (response.role !== null) {
                  return response.role;
                }

                return false; // Ako nije ni admin ni user, smatraj kao neautorizovanog
            }),
            catchError(error => {
              console.error('Greška u API pozivu:', error); // Logujte grešku
              return of(false); // Vratite false ako dođe do greške
          }) // Ako dođe do greške, vrati false
        );
}

  deleteCookie(): void {
    this.cookieService.deleteAll();
  }
  // Funkcija za log-out koja briše accessToken cookie
  logOut = (): void => {
    this.deleteCookie();
    this.route.navigate(['/public/home'])
  }

  getVehicles(viewRequest: any): Observable<any> {
    return this.httpClient.get<any>(`${this.apiUrl}/get/vehicles`, { params: viewRequest });
  }

  getVehiclesInfo(vehicleName: string): Observable<any> {
    const params = new HttpParams().set('name', vehicleName);
    return this.httpClient.get<any>(`${this.apiUrl}/get/vehiclesInfo`, { params });
  }

  getUserInfo(email: string){
    const params = new HttpParams().set('email', email);
    return this.httpClient.get<any>(`${this.apiUrl}/search/UserDetails`, { params })
  }

  SaveChanges(userData: RequestUser) {
    return this.httpClient.put<RequestUser>(`${this.apiUrl}/search/update/UserInfo`, userData, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }
  CartOpen(): boolean {
    this.router.queryParams.subscribe((params) =>{
      if(params['cartOption'] === 'true'){
        return true;
      }
      else{
        return false;
      }
    })
    return false;
}

closeCart() {
  this.updateUrlParam('false');
}

// Helper function to update the URL
private updateUrlParam(cartOptionValue: string) {
  this.router.queryParams.subscribe((params) => {
    const updatedParams = { ...params, cartOption: cartOptionValue };

    // Navigate to update the URL without refreshing the page
    this.route.navigate([], {
      queryParams: updatedParams,
      queryParamsHandling: 'merge', // Keeps other query parameters intact
    });
  });
}
  
  sendCode(phoneNumber: string): Observable<any> {
    return this.httpClient.post(
      `${this.apiUrl}/api/twofactor/send-code`,
      JSON.stringify(phoneNumber),
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  verifySentCode(phoneNumber: string, code: string): Observable<any> {
    const requestBody = {
      phoneNumber: phoneNumber,
      code: code,
    };
    return this.httpClient.post(`${this.apiUrl}/api/twofactor/verify-code`, requestBody, {
      headers: { 'Content-Type': 'application/json' },
    });
  }




  getUserRole(): Observable<string> {
    const token = this.getAccessToken();
    if (!token) {
      return of('guest'); // Pretpostavljena uloga za neautentificirane korisnike
    }

    // Parsirajte token (npr. JWT) ili napravite API poziv za dohvaćanje uloge
    return this.httpClient.get<{ role: string }>(`${this.apiUrl}/user-role`).pipe(
      map(response => response.role),
      catchError(() => of('guest')) // Ako poziv ne uspije, pretpostavite da je 'guest'
    );
  }
  // dodao

  getVehicleImages(vehicleId: number): Observable<any> {
    return this.httpClient.get<any>(`${this.apiUrl}/get/vehicleImages`, {
      params: { vehicleId },
    });
  }


  // getMyAuthInfo(): MyAuthInfo | null {
  //   return this.getLoginToken()?.myAuthInfo ?? null;
  // }
  //
  // isLoggedIn(): boolean {
  //   return this.getMyAuthInfo() != null && this.getMyAuthInfo()!.isLoggedIn;
  // }
  //
  // isAdmin(): boolean {
  //   return this.getMyAuthInfo()?.isAdmin ?? false;
  // }
  //
  // isUser(): boolean {
  //   return this.getMyAuthInfo()?.isUser ?? false;
  // }
  //
  // setLoggedInUser(x: LoginTokenDto | null) {
  //   if (x == null) {
  //     window.localStorage.setItem("my-auth-token", '');
  //     console.log('Stored auth token:', localStorage.getItem('my-auth-token'));
  //
  //   } else {
  //     window.localStorage.setItem("my-auth-token", JSON.stringify(x));
  //     console.log('Stored auth token:', localStorage.getItem('my-auth-token'));
  //
  //   }
  // }
  //
  // getLoginToken(): LoginTokenDto | null {
  //   let tokenString = window.localStorage.getItem("my-auth-token") ?? "";
  //   try {
  //     return JSON.parse(tokenString);
  //   } catch (e) {
  //     return null;
  //   }
  // }

  // setLoggedInUser(data: { token: string; myAuthInfo: any }): void {
  //   localStorage.setItem('my-auth-token', data.token);
  //   localStorage.setItem('my-auth-info', JSON.stringify(data.myAuthInfo));
  // }

  // getMyAuthInfo(): any {
  //   const authInfo = localStorage.getItem('my-auth-info');
  //   return authInfo ? JSON.parse(authInfo) : null;
  // }

  // isAdmin(): boolean {
  //   const authInfo = this.getMyAuthInfo();
  //   return authInfo?.isAdmin || false;
  // }

  // isAdminAsync(credentials: LoginRequest): Observable<boolean> {
  //   return this.httpClient.post<{ isAdmin: boolean }>(`${this.apiUrl}/search/isAdminOrUser`, credentials).pipe(
  //     map(response => response.isAdmin), // Extract the `isAdmin` field
  //     catchError(error => {
  //       console.error('Error verifying admin status:', error);
  //       return of(false); // Default to `false` if the verification fails
  //     })
  //   );
  // }

  // isAdminAsync(credentials: LoginRequest): Observable<boolean> {
  //   return this.httpClient.post<boolean>(`${this.apiUrl}/isAdminOrUser`, credentials)
  //     .pipe(map(response =>{
  //       return response;
  //     }))
  // }

  // isUser(): boolean {
  //   const authInfo = this.getMyAuthInfo();
  //   return authInfo?.isUser || false;
  // }

  // // Save the login token
  // setLoginToken(token: string): void {
  //   localStorage.setItem(this.tokenKey, token);
  // }

  // // Retrieve the login token
  // getLoginToken(): { token: string } | null {
  //   const token = localStorage.getItem(this.tokenKey);
  //   return token ? { token } : null;
  // }

  // // Clear the token on logout
  // clearLoginToken(): void {
  //   localStorage.removeItem(this.tokenKey);
  // }
}
