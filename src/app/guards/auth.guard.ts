import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
        private router: Router,
        private tokenService: TokenService
        ){}
  canActivate(): boolean {
    // route: ActivatedRouteSnapshot,
    // state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    // const token = this.tokenService.getToken();
    const isValidToken = this.tokenService.isValidToken();
    // console.log("AuthGuard: ", isValidToken)
    // if(!token) {
    if(!isValidToken) {
        this.router.navigate(['/login']);
        return false;
    }
    return true;

    // if (localStorage.getItem('token') !== undefined && localStorage.getItem('token')) {
    //     return true;
    //   }
    //   this.router.navigate(['/']);
    //   return false;
  }

}
