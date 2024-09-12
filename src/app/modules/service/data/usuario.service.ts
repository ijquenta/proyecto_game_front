import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from 'src/environments/environment';
import { Rol } from '../../models/rol';
import { Observable } from 'rxjs';
import { checktoken } from 'src/app/interceptors/token.interceptor';

@Injectable({
    providedIn: 'root',
})
export class UsuarioService {
    constructor(private http: HttpClient) {}

    getUsuario() {
        return this.http.get(`${API_URL}/listaUsuarios`, { context: checktoken(), });
    }

    getUsers() {
        return this.http.get(`${API_URL}/getUsers`, { context: checktoken(), });
    }

    getRoles() {
        return this.http.get(`${API_URL}/tipoRol`, { context: checktoken(), });
    }

    crearRol(criterio: any) {
        return this.http.post(`${API_URL}/crearRol`, criterio, { context: checktoken(), });
    }

    modificarRol(criterio: any) {
        let registroModRol = new Rol();
        return this.http.post(`${API_URL}/modificarRol`, registroModRol, { context: checktoken(), });
    }
    eliminarRol(criterio: any) {
        return this.http.post(`${API_URL}/eliminarRol`, criterio, { context: checktoken(), });
    }

    listaUsuario() {
        return this.http.get(`${API_URL}/listaUsuario`, { context: checktoken(), });
    }
    gestionarUsuario(criterio: any) {
        return this.http.post(`${API_URL}/gestionarUsuario`, criterio, { context: checktoken(), });
    }

    getTipoPersona() {
        return this.http.get(`${API_URL}/tipoPersona`, { context: checktoken(), });
    }

    getTipoPersonaDocente() {
        return this.http.get(`${API_URL}/tipoPersonaDocente`, { context: checktoken(), });
    }

    gestionarUsuarioEstado(criterio: any) {
        return this.http.post(`${API_URL}/gestionarUsuarioEstado`, criterio, { context: checktoken(), });
    }

    gestionarUsuarioPassword(criterio: any) {
        return this.http.post(`${API_URL}/gestionarUsuarioPassword`, criterio, { context: checktoken(), });
    }

    buscarUsuario(criterio: any): Observable<any> {
        return this.http.post<any>(`${API_URL}/buscarUsuario`, criterio, { context: checktoken(), });
    }

    requestChangePassword(criterio: any) {
        return this.http.post(`${API_URL}/requestChangePassword`, criterio, { context: checktoken(), });
    }

    resetPassword(token: any, criterio: any) {
        return this.http.post(`${API_URL}/auth/resetPassword/${token}`, criterio, { context: checktoken() } );
    }

    changePassword(criterio: any) {
        return this.http.post(`${API_URL}/changePassword`, criterio, { context: checktoken(), });
    }
}
