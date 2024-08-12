import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../modules/service/core/token.service';

/**
 * Guard function that determines whether a route can be activated.
 * It checks the validity of the token using the TokenService.
 * 
 * @returns {boolean} Returns `true` if the token is valid, `false` otherwise.
 */
export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const tokenService = inject(TokenService);

  // Check if the token is valid
  const isValidToken = tokenService.isValidToken();

  if (!isValidToken) {
    // If the token is not valid, navigate to the expired session page
    router.navigate(['/expired']);
    return false;
  }

  // If the token is valid, allow access to the route
  return true;
};
