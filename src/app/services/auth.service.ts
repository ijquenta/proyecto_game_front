
import { API_URL } from './../../environments/environment.prod';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { map, tap } from 'rxjs/operators';
import { TokenService } from 'src/app/services/token.service'
//models
import { ResponseLogin } from './../modules/models/auth.model';
import { Usuario } from '../modules/models/usuario';

import jwt_decode from "jwt-decode";
import { BehaviorSubject, Observable } from 'rxjs';

import { checktoken } from '../interceptors/token.interceptor';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

//   apiUrl = environment.API_URL2;
  API_URL = environment.API_URL;


  usuario$ = new BehaviorSubject<Usuario | null>(null);

  isLoggedIn$: Observable<boolean> = this.usuario$.pipe(map(Boolean));

  constructor(private http: HttpClient, private tokenService: TokenService) { }

//   login(email: string, password: string){
//       return this.http.post(`${this.apiUrl}/api/v1/auth/login`, {
//         email,
//         password
//       })
//   }
  login(usuname: string, usupassword: string){
    // Petición POST /login
    return this.http.post<ResponseLogin>(`${this.API_URL}/login`, {
        usuname, usupassword
    })
    .pipe( // pipe-tap Operación antes de devolver cualquier operación(Subscripción)
      tap((response) => {
        // console.log("Tap: ", response);
        this.tokenService.saveToken(response.auth_token); // Guardamos el token
      })
    );
}

  register(name: string, email: string, password: string) {
    return this.http.post(`${this.API_URL}/api/v1/auth/register`, {
      name,
      email,
      password
    })
  }
  // Esta disponible
  isAvailable(email: string){
    return this.http.post(`${this.API_URL}/api/v1/auth/is-available`, {
      email
    })
  }

  registrar(criterio: any){
    return this.http.post(`${this.API_URL}/register`, criterio);
  }

  logout(){
    this.tokenService.removeToken();
  }

  getPerfil(): Observable<any> {
    const token = this.tokenService.getToken();
    // const token2 = this.tokenService.getToken();
    // console.log("getPerfil: ", token);
    let decode: any = (jwt_decode(token));
    // console.log("Token decode: ", decode);

    // console.log("Token decode: ", decode.sub);
    const criterio = {
      usuid: decode.sub
    };
    return this.http.post(`${API_URL}/auth/perfil`, criterio, {
    //   headers: {
    //     Authorization: `Bearer ${token2}`
    //   }
    context: checktoken()
    }).pipe(
        tap(user => {
            this.usuario$.next(user);
        })
    );
  }



  getDataUsuario(){
    return this.usuario$.getValue();
  }

//   userrol: any;
//   getRole(){
//     this.userrol = this.usuario$.getValue();
//     // console.log("Rol usuario: ", this.userrol)
//     return this.userrol;
//   }
//   isAuthenticated() {
//     const sesion = this.tokenService.getToken();
//     return !(sesion === null);
//   }
//   getIdUsuario(){
//     if (this.isAuthenticated()){
//       const token = this.tokenService.getToken();
//       let decode:any = (jwt_decode(token));
//       return decode['identity']['idUsuario'];
//     }
//     return []
//   }

//   getUsername(){
//     if (this.isAuthenticated()){
//       const token: any = this.getAuthenticatedToken();
//       let decode:any = (jwt_decode(token));
//       return decode['identity']['username'];
//     }
//     return []
//   }

}
