import { inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  UrlSegment,
  UrlTree,
} from '@angular/router';
import { Router } from '@angular/router';

import { map, Observable, tap } from 'rxjs';
import { AuthService } from '../modules/service/core/auth.service';
import { Role } from '../modules/models/roles.type';
import { Rol } from '../modules/models/rol';


@Injectable({
  providedIn: 'root',
})
export class HasRoleGuard implements CanLoad, CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

    usurol: any;


    canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
        if(this.hasRole(route)){
          return this.hasRole(route);
        }
        else {
          this.router.createUrlTree(['/login'])
          return this.hasRole(route);
        }

    }

    canLoad(route: ActivatedRouteSnapshot): Observable<boolean> {
      if(this.hasRole(route)){
        return this.hasRole(route);
      }
      else {
        this.router.createUrlTree(['/login'])
        return this.hasRole(route);
      }
    }

    private hasRole(route: Route | ActivatedRouteSnapshot) {
        const allowedRoles = route.data?.['allowedRoles']; // Roles permitidos

        console.log("allowedRoles: ", allowedRoles);

        this.usurol = this.authService.getUserData();
        console.log("rol_usuario: ", this.usurol[0].rolnombre)
        return this.authService.usuario$.pipe(
            map((user) => Boolean(allowedRoles.includes( this.usurol[0].rolnombre))),
            // tap((hasRole) => hasRole === false && alert('Acceso Denegado'))
        )

    }


  }
// Only available for v14.2 and above

export const hasRole = (allowedRoles: any[]) => {
  return () => {
    const authService = inject(AuthService);
    const usurol = authService.getUserData();
    const usu = usurol ? usurol[0].rolnombre : null;
    // console.log("rol_usuario: ", usu);
    return authService.usuario$.pipe(
      map((user) => Boolean(user && allowedRoles.includes(usu))),
   //    tap((hasRole) => hasRole === false && alert('Acceso Denegado'))
    );
  };
};


