import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {tap} from 'rxjs/operators';
import {MyConfig} from '../../my-config';
import {MyAuthService} from '../../services/auth-services/my-auth.service';
import {LoginTokenDto} from '../../services/auth-services/dto/login-token-dto';
import {MyBaseEndpointAsync} from '../../helper/my-base-endpoint-async.interface';
import {MyAuthInfo} from '../../services/auth-services/dto/my-auth-info';
import {Observable} from 'rxjs';

export interface LoginRequest {
  email: string;
  password: string;
}




// export interface AdminLoginRequest {
//   adminId: string;
//   password: string;
// }

@Injectable({
  providedIn: 'root'
})
export class AuthLoginEndpointService {
  private apiUrl = `${MyConfig.api_address}/login`;

  constructor(private httpClient: HttpClient) {}

  handleAsync(loginRequest: any): Observable<any> {
    return this.httpClient.post<any>(this.apiUrl, loginRequest);
  }
}

//
// export class AuthLoginEndpointService implements MyBaseEndpointAsync<LoginRequest, LoginTokenDto> {
//
//   // private apiUrl: string='';
//
//   private adminUsernames = ['admin1', 'admin2', 'superadmin'];
//
//   constructor(private httpClient: HttpClient, private myAuthService: MyAuthService,) {
//   }
//
//   private determineApiUrl(): string {
//     const authInfo = this.myAuthService.getMyAuthInfo();
//     return authInfo?.isUser
//       ? `${MyConfig.api_address}/login/user`
//       : `${MyConfig.api_address}/login/admin`;
//   }
//
//   handleAsync(request: LoginRequest) {
//     // Determine endpoint dynamically based on username prefix
//     const endpoint = request.username.startsWith('admin_') ? 'admin' : 'user';
//     const apiUrl = `${MyConfig.api_address}/login/${endpoint}`; // Dynamically resolve URL
//
//     return this.httpClient.post<any>(apiUrl, request).pipe(
//       tap((response) => {
//         // If login failed, let the caller handle the error
//         if (response.success === false) {
//           return; // Do not proceed further
//         }
//
//         // Save auth info to local storage if successful
//         this.myAuthService.setLoggedInUser({
//           token: response.token,
//           myAuthInfo: response.myAuthInfo,
//         });
//       })
//     );
//   }
//
//   // handleAsync(request: LoginRequest) {
//   //   return this.httpClient.post<LoginTokenDto>(this.apiUrl, request).pipe(
//   //     tap((response) => {
//   //       // Infer the role on the frontend based on the username
//   //       const isAdmin = this.adminUsernames.includes(request.username);
//   //       const isUser = !isAdmin;
//   //
//   //       // Create the myAuthInfo object
//   //       const myAuthInfo = {
//   //         userId: response.myAuthInfo?.userId,
//   //         username: response.myAuthInfo?.username || '',
//   //         firstName: response.myAuthInfo?.firstName || '',
//   //         lastName: response.myAuthInfo?.lastName || '',
//   //         isAdmin: isAdmin,
//   //         isUser: isUser,
//   //         isLoggedIn: true
//   //       };
//   //
//   //       // Save the auth data in the service
//   //       this.myAuthService.setLoggedInUser({
//   //         token: response.token,
//   //         myAuthInfo: myAuthInfo
//   //       });
//   //     })
//   //   );
//   // }
//
//
//
//   // handleAdminAsync(request: AdminLoginRequest) {
//   //   return this.httpClient.post<LoginTokenDto>(`${this.apiUrl}/admin`, request).pipe(
//   //     tap((response) => {
//   //       this.myAuthService.setLoggedInUser({
//   //         token: response.token,
//   //         myAuthInfo: response.myAuthInfo,
//   //       });
//   //     })
//   //   );
//   // }
//
//   // Add a public getter to expose myAuthService
//   getAuthService(): MyAuthService {
//     return this.myAuthService;
//   }
//
// }
