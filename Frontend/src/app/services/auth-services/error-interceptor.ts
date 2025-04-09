import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {MyAuthService} from './my-auth.service';
import {Observable, switchMap, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private auth: MyAuthService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
    .pipe(
      catchError(error =>{
        if(error instanceof HttpErrorResponse && error.status === 401){
          if(!request.url.includes('/login') && !request.url.includes('/refresh')) {
            return this.handle401Error(request,next);
          }
          else{
            this.auth.logOut();
            return throwError(()=>error);
          }
        }
        else{
          return throwError(()=>error);
        }

      })
    )
  }

  private addToken(request: HttpRequest<any>):HttpRequest<any> {
    const accessToken = localStorage.getItem('accessToken');
    if(accessToken){
      return request.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`
        }
      })
    }
    return request;
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) :Observable<HttpEvent<any>> {
    return this.auth.refreshToken().pipe(
      switchMap( ()=> {
        console.log("Token refreshed successfully")
        return next.handle(this.addToken(request));
      })
      // ,
      // catchError((error)=>{
      //   console.error("Failed to refresh token: ",error);
      //   this.auth.logout()
      //   return throwError(()=>error);
      // })
    )
  }


}
