import {AuthenticationService} from './_services/authentication.service';
import {MessageService} from './_services/message.service';
import {HttpErrorResponse} from '@angular/common/http';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';
import {Injectable, Injector} from '@angular/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {catchError} from 'rxjs/operators';
import {of} from 'rxjs/observable/of';
import {
  switchMap
} from 'rxjs/operators';
import 'rxjs/add/operator/finally';


@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  private authService: AuthenticationService;
  private isRefreshingToken = false;

  constructor(
    private inj: Injector,
    private messageService: MessageService,
    private router: Router
  ) {}

  setToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    console.log(req.url);
    this.authService = this.inj.get(AuthenticationService);
    if (this.authService.getToken() && !req.url.endsWith('oauth/token')) {
      req = this.setToken(req, this.authService.getToken());
    }
    return next.handle(req).pipe(
      catchError((error, caught) => {
        console.log(error);
        if (error instanceof HttpErrorResponse) {
          switch (error.status) {
            case 400:
              return Observable.throw(error);
            case 401:
              return this.handler401Error(req, next, error);
          }
          console.log('Error status unknown!');
          return this.logout(error);
        } else {
          console.log('Error type unknown!');
          // return the error to the method that called it
          return Observable.throw(error);
        }
      })
    );
  }

  handler401Error(req: HttpRequest<any>, next: HttpHandler, error: any): Observable<HttpEvent<any>> {
    if (!this.isRefreshingToken && error.error.error_description.startsWith('Access token expired')) {
      this.isRefreshingToken = true;
      console.log('Refresh token...');
      return this.authService.refreshToken().pipe(
        switchMap(success => {
          console.log(success);
          if (success) {
            req = this.setToken(req, this.authService.getToken());
            return next.handle(req);
          }
          return this.logout(error);
        }),
        catchError((err, caught) => {
          console.log(err);
          console.log('Error in refresh token request!');
          if (error instanceof HttpErrorResponse && error.status === 401 && err.error.error_description.startsWith('Invalid refresh token (expired)')) {
            this.messageService.add('A sessão expirou!');
          }
          return this.logout(err);
        })
      ).finally(() => {
        console.log('finally.');
        this.isRefreshingToken = false;
      });
    }
    return Observable.throw(error);
  }

  logout(error: any): Observable<HttpEvent<any>> {
    this.authService.logout();
    return Observable.throw(error);
  }
}

