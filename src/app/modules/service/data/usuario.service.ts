import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../../api/product';
import { API_URL } from 'src/environments/environment';
import { Usuario } from '../../models/usuario';
import { Rol } from '../../models/rol';

@Injectable({
    providedIn: 'root', // o 'any' si se proporciona en algún otro lugar
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
        // registroModRol.rolId = criterio.rolid;
        // registroModRol.rolNombre = criterio.rolnombre;
        // registroModRol.rolDescripcion = criterio.roldescripcion;
        // registroModRol.rolUsuMod = 'Usu Modddd';
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
}
