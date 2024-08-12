import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { TokenService } from '../modules/service/core/token.service';

@Injectable({
  providedIn: 'root'
})
export class RedirectGuard implements CanActivate {
  constructor(
    private router: Router,
    private tokenService: TokenService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const isValidToken = this.tokenService.isValidToken();

    // Verifica si el usuario está en la ruta raíz ('/')
    if (isValidToken && state.url === '/') {
      this.router.navigate(['/principal']);
      return false;  // Previene el acceso a la página de inicio de sesión
    }

    return true;
  }
}
