
import { Injectable } from '@angular/core'; // Importa el decorador Injectable desde Angular Core
import { getCookie, setCookie, removeCookie } from 'typescript-cookie'; // Importa funciones para manipulación de cookies desde typescript-cookie
import jwt_decode, { JwtPayload } from "jwt-decode"; // Importa la función jwt_decode y la interfaz JwtPayload desde la librería jwt-decode

@Injectable({
    providedIn: 'root'
})

export class TokenService {

    constructor() { }

    // Método para guardar el token en una cookie
    saveToken(token: string) {
        setCookie('token', token, { expires: 365, path: '/' });
    }

    // Método para obtener el token desde la cookie
    getToken() {
        const token = getCookie('token');
        return token
    }

    // Método para eliminar el token de la cookie
    removeToken() {
        removeCookie('token');
    }

    // Método para verificar si el token es válido
    isValidToken() {
        const token = this.getToken();
        if (!token) {
            return false;
        }
        const decodeToken = jwt_decode<JwtPayload>(token);
        if (decodeToken && decodeToken?.exp) {
            const tokenDate = new Date(0); // Obtiene la fecha de expiración del token y compara con la fecha actual
            tokenDate.setUTCSeconds(decodeToken.exp);
            const today = new Date();
            return tokenDate.getTime() > today.getTime();
        }
        return true;
    }
}

