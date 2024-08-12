import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../modules/service/core/auth.service';
import { inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HasRoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // Obtén el rol necesario desde los datos de la ruta
    const requiredRole = route.data['role']; // Asegúrate de definir esto en las rutas
    if (!requiredRole) {
      setTimeout(() => this.router.navigate(['/access-denied']), 0);
      return false;
    }

    // Obtén el rol del usuario desde el servicio de autenticación
    const userData = this.authService.getUserData();
    if (!userData) {
      setTimeout(() => this.router.navigate(['/access-denied']), 0);
      return false;
    }

    const userRole = userData[0]?.rolnombre; // Ajusta según tu servicio
    // Compara los roles y decide si permitir el acceso
    if (userRole === requiredRole) {
      return true;
    } else {
      setTimeout(() => this.router.navigate(['/access-denied']), 0);
      return false;
    }
  }
}
