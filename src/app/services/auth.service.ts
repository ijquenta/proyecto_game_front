import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { tap } from 'rxjs/operators';
import { TokenService } from 'src/app/services/token.service'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl = environment.API_URL2;
  apiUrl2 = environment.API_URL;

  constructor(private http: HttpClient, private tokenService: TokenService) { }

//   login(email: string, password: string){
//       return this.http.post(`${this.apiUrl}/api/v1/auth/login`, {
//         email,
//         password
//       })
//   }
  login(email: string, password: string){
    
    return this.http.post(`${this.apiUrl2}/login`, {
      email,
      password
    })
    .pipe(
      tap((response: any) => { 
        this.tokenService.saveToken(response.auth_token);
      })
    );
}

  register(name: string, email: string, password: string) {
    return this.http.post(`${this.apiUrl}/api/v1/auth/register`, {
      name,
      email,
      password
    })
  }
  // Esta disponible
  isAvailable(email: string){
    return this.http.post(`${this.apiUrl}/api/v1/auth/is-available`, {
      email
    })
  }
}
