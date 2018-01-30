import {AuthenticationService} from '../_services/authentication.service';
import {Injectable} from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot
} from '@angular/router';
import * as decode from 'jwt-decode';


@Injectable()
export class RoleGuardService implements CanActivate {

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    // this will be passed from the route config
    // on the data property
    let expectedRoles = route.data.expectedRole;
    if (!Array.isArray(route.data.expectedRole)) {
      expectedRoles = [route.data.expectedRole];
    }

    const hasAccess = this.authenticationService.hasAccess(expectedRoles);
    if (!this.authenticationService.isAuthenticated() || !hasAccess) {
      this.router.navigate(['home']);
      return false;
    }
    return true;
  }
}
