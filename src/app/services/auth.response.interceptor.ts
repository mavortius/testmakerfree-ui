import {Injectable, Injector} from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest,
  HttpResponse
} from '@angular/common/http';
import {Router} from '@angular/router';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/do';

import {AuthService} from './auth.service';

@Injectable()
export class AuthResponseInterceptor implements HttpInterceptor {
  currentRequest: HttpRequest<any>;
  auth: AuthService;

  constructor(private injector: Injector,
              private router: Router) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.auth = this.injector.get(AuthService);
    const token = (this.auth.isLoggedIn()) ? this.auth.getAuth()!.token : null;

    if (token) {
      this.currentRequest = request;

      return next.handle(request)
        .do((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            // do nothing
          }
        }, (error) => {
          return this.handleError(error);
        });
    } else {
      return next.handle(request);
    }
  }

  handleError(err: any) {
    if (err instanceof HttpErrorResponse) {
      if (err.status === 401) {
        console.log('Token expired. Attempting refresh...');
        this.auth.refreshToken()
          .subscribe(result => {
            if (result) {
              console.log('refresh token successful');
              const http = this.injector.get(HttpClient);

              http.request(this.currentRequest).subscribe(res => {
                // do nothing
              }, error => console.log(error));
            } else {
              console.log('refresh token failed');
              this.auth.logout();
              this.router.navigate(['login']);
            }
          }, error => console.log(error));
      }
    }
    return Observable.throw(err);
  }
}
