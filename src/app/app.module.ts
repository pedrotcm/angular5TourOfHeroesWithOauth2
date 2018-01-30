import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';


import {AppComponent} from './app.component';
import {HeroesComponent} from './_components/heroes/heroes.component';
import {FormsModule} from '@angular/forms';
import {HeroDetailsComponent} from './_components/hero-details/hero-details.component';
import {HeroService} from './_services/hero.service';
import {MessagesComponent} from './_components/messages/messages.component';
import {MessageService} from './_services/message.service';
import {AppRoutingModule} from './app-routing.module';
import {RouterModule} from '@angular/router';
import {DashboardComponent} from './_components/dashboard/dashboard.component';
import {HttpClientModule} from '@angular/common/http';
import {HttpClientInMemoryWebApiModule} from 'angular-in-memory-web-api';
import {InMemoryDataService} from './_services/in-memory-data.service';
import {HeroSearchComponent} from './_components/hero-search/hero-search.component';
import {HomeComponent} from './_components/home/home.component';
import {LoginComponent} from './_components/login/login.component';
import {SecuredDirective} from './_directives/secured.directive';
import {AuthGuardService} from './_guards/auth-guard.service';
import {RoleGuardService} from './_guards/role-guard.service';
import {AuthenticationService} from './_services/authentication.service';
import {JwtInterceptor} from './jwt.interceptor';
import {JwtModule, JwtHelperService} from '@auth0/angular-jwt';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';

@NgModule({
  declarations: [
    AppComponent,
    HeroesComponent,
    HeroDetailsComponent,
    MessagesComponent,
    DashboardComponent,
    HeroSearchComponent,
    HomeComponent,
    LoginComponent,
    SecuredDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return null;
        },
        whitelistedDomains: ['localhost:4200']
      }
    })

    //    HttpClientInMemoryWebApiModule.forRoot(
    //      InMemoryDataService, {dataEncapsulation: false}
    //    )
  ],
  providers: [HeroService, MessageService, AuthenticationService, AuthGuardService, RoleGuardService, CookieService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule {}
