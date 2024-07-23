import { Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { distinctUntilChanged, map, Subscription, tap } from 'rxjs';
import { AuthService } from '../modules/service/core/auth.service';
// import { Role } from '../model';

@Directive({
  selector: '[akoShowForRoles]',
})
export class ShowForRolesDirective implements OnInit, OnDestroy {
  @Input('akoShowForRoles') allowedRoles?: any[];
  private sub?: Subscription;

  constructor(
    private authService: AuthService,
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>
  ) {}
  ngOnInit(): void {

    this.sub = this.authService.usuario$
      .pipe(
        map((user) => Boolean(user && this.allowedRoles?.includes(user.rolnombre))),
        distinctUntilChanged(),
        tap((hasRole) =>
          hasRole
            ? this.viewContainerRef.createEmbeddedView(this.templateRef)
            : this.viewContainerRef.clear()
        )
      )
      .subscribe();
  }
  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}


