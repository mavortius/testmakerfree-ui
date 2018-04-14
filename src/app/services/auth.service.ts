import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {HttpClient} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import {environment} from '../../environments/environment';

@Injectable()
export class AuthService {
  authKey = 'auth';
  clientId = 'TestMakerFree';

  constructor(private http: HttpClient,
              @Inject(PLATFORM_ID) private platformId: any) {
  }

  login(username: string, password: string): Observable<any> {
    const url = `${environment.apiUrl}/api/token/auth`;
    const data = {
      username: username,
      password: password,
      client_id: this.clientId,
      grant_type: 'password',
      client_secret: 'offline_access profile email'
    };

    return this.http.post<TokenResponse>(url, data)
      .map((res) => {
        const token = res && res.token;

        if (token) {
          this.setAuth(res);

          return true;
        }

        return Observable.throw('Unauthorized');
      });
  }

  logout(): boolean {
    this.setAuth(null);
    return true;
  }

  setAuth(auth: TokenResponse | null): boolean {
    if (isPlatformBrowser(this.platformId)) {
      if (auth) {
        localStorage.setItem(this.authKey, JSON.stringify(auth));
      } else {
        localStorage.removeItem(this.authKey);
      }
    }

    return true;
  }

  getAuth(): TokenResponse | null {
    if (isPlatformBrowser(this.platformId)) {
      const i = localStorage.getItem(this.authKey);

      if (i) {
        return JSON.parse(i);
      }
    }
    return null;
  }

  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.authKey) != null;
    }
    return false;
  }
}
