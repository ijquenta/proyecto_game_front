
import { API_URL } from './../../environments/environment'; // Importa la constante API_URL desde el archivo environment en la carpeta environments
import { Injectable } from '@angular/core'; // Importa el decorador Injectable desde Angular Core
import { HttpClient } from '@angular/common/http'; // Importa el módulo HttpClient para realizar solicitudes HTTP
import { environment } from 'src/environments/environment'; // Importa el objeto environment desde el archivo environment en la carpeta environments
import { map, tap } from 'rxjs/operators'; // Importa operadores de rxjs para manipulación de datos asincrónicos
import { TokenService } from 'src/app/services/token.service' // Importa el servicio TokenService desde el archivo token.service
import { ResponseLogin } from './../modules/models/auth.model'; // Importa la interfaz ResponseLogin desde el archivo auth.model en la carpeta models
import { Usuario } from '../modules/models/usuario'; // Importa la interfaz Usuario desde el archivo usuario en la carpeta models
import jwt_decode from "jwt-decode"; // Importa la función jwt_decode desde la librería jwt-decode
import { BehaviorSubject, Observable } from 'rxjs'; // Importa BehaviorSubject y Observable desde rxjs para manejo de observables
import { checktoken } from '../interceptors/token.interceptor'; // Importa la función checktoken desde el interceptor token.interceptor

@Injectable({
    providedIn: 'root'
})

export class AuthService {

    API_URL = environment.API_URL; // Api Url

    usuario$ = new BehaviorSubject<Usuario | null>(null); // Usuario

    isLoggedIn$: Observable<boolean> = this.usuario$.pipe(map(Boolean)); // Esta logueado

    constructor(private http: HttpClient, private tokenService: TokenService) { }

    login(usuname: string, usupassword: string) {

        // Realiza una solicitud POST al endpoint de inicio de sesión y guarda el token de autenticación
        return this.http.post<ResponseLogin>(`${this.API_URL}/login`, {
            usuname, usupassword
        })
            .pipe(
                tap((response) => {
                    this.tokenService.saveToken(response.auth_token);
                })
            );
    }

    register(name: string, email: string, password: string) {

        // Realiza una solicitud POST al endpoint de registro
        return this.http.post(`${this.API_URL}/api/v1/auth/register`, {
            name,
            email,
            password
        })
    }

    isAvailable(email: string) { // Esta disponible
        return this.http.post(`${this.API_URL}/api/v1/auth/is-available`, {
            email
        })
    }

    registrar(criterio: any) {
        return this.http.post(`${this.API_URL}/register`, criterio);
    }

    confirmEmail(token: string): Observable<any> {
        const url = `${this.API_URL}/confirmar-correo`;
        const body = { token: token }; // El token se envía en el cuerpo de la solicitud POST
        return this.http.post<any>(url, body);
    }


    logout() { // Salir
        this.tokenService.removeToken();
    }

    getPerfil(): Observable<any> {
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

    getDataUsuario() {
        return this.usuario$.getValue();
    }
}
