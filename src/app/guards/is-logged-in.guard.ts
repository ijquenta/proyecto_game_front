import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class IsLoggedInGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const requiredRoles = route.data.requiredRoles as Array<string>;

    // Verifica si el usuario está autenticado y tiene el rol necesario.
    const userRoles = this.authService.getPerfil();  // Implementa este método en tu servicio de autenticación.

    if (this.hasRequiredRole(userRoles)) {
      return true;
    } else {
      // Redirige a la página de inicio de sesión u otra página de acceso denegado.
      this.router.navigate(['/login']);  // Ajusta la ruta según tus necesidades.
      return false;
    }
  }

  private hasRequiredRole(userRoles: Array<string>, requiredRoles: Array<string>): boolean {
    // Lógica para verificar si el usuario tiene el rol necesario.
    // Puedes implementar esto según tu estructura de roles.

    // Por ejemplo:
    return requiredRoles.some(role => userRoles.includes(role));
  }
}
