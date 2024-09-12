import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../modules/service/core/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HasRoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    // Obtén los roles necesarios desde los datos de la ruta
    const requiredRoles: string[] = route.data['role'];

    // Si no se definieron roles en la ruta, redirige al acceso denegado
    if (!requiredRoles) {
      this.router.navigate(['/access-denied']);
      return new Observable<boolean>((observer) => observer.next(false));
    }

    // Utiliza la función getProfile() para obtener los datos del usuario
    return this.authService.getProfile().pipe(
      map((userData) => {

        if (!userData || !userData[0]) {
          this.router.navigate(['/access-denied']);
          return false;
        }

        const userRole = userData[0]?.rolnombre;

        // Verifica si el rol del usuario coincide con alguno de los roles permitidos
        if (requiredRoles.includes(userRole)) {
          return true;
        } else {
          this.router.navigate(['/access-denied']);
          return false;
        }
      })
    );
  }
}
