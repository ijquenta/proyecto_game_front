import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from 'src/environments/environment';
import { Rol } from '../../models/rol';

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {

    constructor(private http: HttpClient) { }

    getUsuario(){
        return this.http.get(`${API_URL}/listaUsuarios`);
    }

    getRoles(){
        return this.http.get(`${API_URL}/tipoRol`);
    }

    crearRol(criterio: any){
        return this.http.post(`${API_URL}/crearRol`, criterio);
    }

    modificarRol(criterio: any){
        console.log("Service Modificar Rol", criterio);
        let registroModRol = new Rol();
        console.log("datos service->", registroModRol);
        return this.http.post(`${API_URL}/modificarRol`, registroModRol);
    }
    eliminarRol(criterio: any){
        console.log("Service Eliminar Rol", criterio);
        return this.http.post(`${API_URL}/eliminarRol`, criterio);
    }

    listaUsuario(){
        return this.http.get(`${API_URL}/listaUsuario`);
    }
    gestionarUsuario(criterio: any) {
        return this.http.post(`${API_URL}/gestionarUsuario`, criterio);
    }
    getTipoPersona(){
        return this.http.get(`${API_URL}/tipoPersona`)
    }

    gestionarUsuarioEstado(criterio: any) {
        return this.http.post(`${API_URL}/gestionarUsuarioEstado`, criterio);
    }

    gestionarUsuarioPassword(criterio: any) {
        return this.http.post(`${API_URL}/gestionarUsuarioPassword`, criterio);
    }
}
