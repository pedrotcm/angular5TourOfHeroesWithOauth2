import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {JwtHelperService} from '@auth0/angular-jwt';
import {catchError, map, tap} from 'rxjs/operators';
import * as decode from 'jwt-decode';
import 'rxjs/add/observable/throw';
import {CookieService} from 'ngx-cookie-service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    'Authorization': 'Basic ' + btoa('meusalao-server:m3u$aL40API$3rV3r')
  })
};

@Injectable()
export class AuthenticationService {

  private authUrl = 'http://localhost:8080/oauth/token';

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService,
    private router: Router,
    private cookieService: CookieService
  ) {}

  login(username: string, password: string): Observable<boolean> {
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);
    params.append('grant_type', 'password');

    return this.http.post(this.authUrl, params.toString(), httpOptions)
      .pipe(
      map(response => {
        // login successful if there's a jwt token in the response
        const access_token = response && response['access_token'];
        if (access_token) {
          // store username and jwt token in local storage to keep user logged in between page refreshes
          this.cookieService.set('currentUser', JSON.stringify({access_token: access_token, refresh_token: response['refresh_token']}));

          // return true to indicate successful login
          return true;
        } else {
          // return false to indicate failed login
          return false;
        }
      }),
      catchError((err, caught) => {
        console.log(err);
        return Observable.throw(err.message || 'Server error');
      })
      );
  }

  refreshToken(): Observable<boolean> {
    console.log(this.getRefreshToken());
    const params = new URLSearchParams();
    params.append('refresh_token', this.getRefreshToken());
    params.append('grant_type', 'refresh_token');

    return this.http.post(this.authUrl, params.toString(), httpOptions)
      .pipe(
      map(response => {
        console.log(response);
        // login successful if there's a jwt token in the response
        const access_token = response && response['access_token'];
        if (access_token) {
          // store username and jwt token in local storage to keep user logged in between page refreshes
          this.cookieService.set('currentUser', JSON.stringify({access_token: access_token, refresh_token: response['refresh_token']}));

          // return true to indicate successful login
          return true;
        } else {
          // return false to indicate failed login
          return false;
        }
      }),
      catchError((err, caught) => {
        console.log(err);
        return Observable.throw(err || 'Server error');
      })
      //      catchError((error: any) => Observable.throw(error.error || 'Server error'))
      );
  }

  logout(): void {
    this.cookieService.delete('currentUser');
    this.router.navigate(['login']);
  }

  getToken(): string {
    if (this.cookieService.get('currentUser')) {
      const currentUser = JSON.parse(this.cookieService.get('currentUser'));
      const token = currentUser && currentUser.access_token;
      return token;
    }
    return null;
  }

  getRefreshToken(): string {
    if (this.cookieService.get('currentUser')) {
      const currentUser = JSON.parse(this.cookieService.get('currentUser'));
      const refresh_token = currentUser && currentUser.refresh_token;
      return refresh_token;
    }
    return null;
  }

  public isAuthenticated(): boolean {
    const token = this.getToken();
    //    return token ? !this.jwtHelper.isTokenExpired(token) : false
    return token ? true : false;
  }

  public hasAccess(privilageRoleList: Array<string>): boolean {
    // decode the token to get its payload
    const tokenPayload = this.getToken() ? decode(this.getToken()) : [];
    for (const privilageName of privilageRoleList) {
      for (const role of tokenPayload.role || []) {
        if (role.authority === privilageName) {
          return true;
        }
      }
    }
    return false;
  }

}
