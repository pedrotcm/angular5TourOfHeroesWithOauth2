import {AuthenticationService} from '../_services/authentication.service';
import {
  Component, ChangeDetectorRef, ViewChildren,
  Query, QueryList, Directive, ElementRef, HostBinding, AfterViewInit, Input, OnInit
} from '@angular/core';
import {RouterLink, Router, ActivatedRoute} from '@angular/router';


@Directive({
  /* tslint:disable-next-line:directive-selector */
  selector: '[secured]'
})
export class SecuredDirective implements AfterViewInit {

  @Input('accessControlList')
  accessControlList: Array<string>;

  constructor(
    private router: Router,
    // private routerLink: RouterLink,
    private activatedRoute: ActivatedRoute,
    private eltRef: ElementRef,
    private authenticationService: AuthenticationService) {
  }

  ngAfterViewInit() {
    const hasAccess = this.checkResourcePrivelageAcl(this.accessControlList);
    if (!hasAccess) {
      const el: HTMLElement = this.eltRef.nativeElement;
      el.parentNode.removeChild(el);
    }
  }

  private checkResourcePrivelageAcl(privilageList: Array<string>): boolean {
    return this.authenticationService.hasAccess(privilageList);
  }


}
