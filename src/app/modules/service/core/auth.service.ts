
import { API_URL } from '../../../../environments/environment'; // Importa la constante API_URL desde el archivo environment en la carpeta environments
import { Injectable } from '@angular/core'; // Importa el decorador Injectable desde Angular Core
import { HttpClient } from '@angular/common/http'; // Importa el módulo HttpClient para realizar solicitudes HTTP
import { environment } from 'src/environments/environment'; // Importa el objeto environment desde el archivo environment en la carpeta environments
import { map, tap } from 'rxjs/operators'; // Importa operadores de rxjs para manipulación de datos asincrónicos
import { TokenService } from 'src/app/modules/service/core/token.service' // Importa el servicio TokenService desde el archivo token.service
import { ResponseLogin } from '../../models/auth.model'; // Importa la interfaz ResponseLogin desde el archivo auth.model en la carpeta models
import { Usuario } from '../../models/usuario'; // Importa la interfaz Usuario desde el archivo usuario en la carpeta models
import jwt_decode from "jwt-decode"; // Importa la función jwt_decode desde la librería jwt-decode
import { BehaviorSubject, Observable } from 'rxjs'; // Importa BehaviorSubject y Observable desde rxjs para manejo de observables
import { checktoken } from '../../../interceptors/token.interceptor'; // Importa la función checktoken desde el interceptor token.interceptor

@Injectable({
    providedIn: 'root'
})

export class AuthService {

    API_URL = environment.API_URL;
    usuario$ = new BehaviorSubject<Usuario | null>(null);
    isLoggedIn$: Observable<boolean> = this.usuario$.pipe(map(Boolean));

    constructor(private http: HttpClient, private tokenService: TokenService) { }

    login(username: string) {
        return this.http.post<ResponseLogin>(`${this.API_URL}/login`, {
            username: username
        }).pipe(tap((response) => {
                this.tokenService.saveToken(response.auth_token);
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

    isAvailable(email: string) {
        return this.http.post(`${this.API_URL}/api/v1/auth/is-available`, {
            email
        })
    }

    registerUser(criterio: any) {
        return this.http.post(`${this.API_URL}/register`, criterio);
    }

    confirmEmail(token: string): Observable<any> {
        return this.http.post(`${this.API_URL}/confirm-email`, { token });
    }


    logout() {
        this.tokenService.removeToken();
    }

    getProfile(): Observable<any> {
        const token = this.tokenService.getToken();
        let decode: any = (jwt_decode(token));

        const criterio = {
            usuid: decode.sub
        };

        return this.http.post(`${API_URL}/auth/perfil`, criterio, {
            context: checktoken()
        }).pipe(
            tap(user => {
                this.usuario$.next(user);
            })
        );
    }

    getProfileToken(tk: any): Observable<any> {
        const token = tk;
        let decode: any = (jwt_decode(token));
        const criterio = {
            usuid: decode.usuid
        };

        return this.http.post(`${API_URL}/auth/perfil`, criterio, {
            context: checktoken()
        }).pipe(
            tap(user => {
                this.usuario$.next(user);
            })
        );
    }

    getUserData() {
        return this.usuario$.getValue();
    }
}
