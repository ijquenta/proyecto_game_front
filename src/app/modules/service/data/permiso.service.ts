import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from 'src/environments/environment';
import { checktoken } from 'src/app/interceptors/token.interceptor';

@Injectable()
export class PermisoService {
    constructor(private http: HttpClient) {}

    listarNivel() {
        return this.http.get(`${API_URL}/listarNivel`);
    }

    insertarNivel(criterio: any) {
        return this.http.post(`${API_URL}/insertarNivel`, criterio);
    }

    eliminarNivel(criterio: any) {
        return this.http.post(`${API_URL}/eliminarNivel`, criterio);
    }

    modificarNivel(criterio: any) {
        return this.http.post(`${API_URL}/modificarNivel`, criterio);
    }

    gestionarNivelEstado(criterio: any) {
        return this.http.post(`${API_URL}/gestionarNivelEstado`, criterio);
    }

    listarPermiso() {
        return this.http.get(`${API_URL}/listarPermiso`, {
            context: checktoken(),
        });
    }

    listarPermisoRol() {
        return this.http.get(`${API_URL}/listarPermisoRol`);
    }

    getPermisos() {
        return this.http.get(`${API_URL}/getPermisos`, {
            context: checktoken(),
        });
    }

    getRoles() {
        return this.http.get(`${API_URL}/getRoles`, { context: checktoken() });
    }

    getOperaciones() {
        return this.http.get(`${API_URL}/getOperaciones`);
    }

    updatePermiso(permiso: any) {
        return this.http.post(`${API_URL}/updatePermiso`, permiso);
    }

    addPermiso(permiso: any) {
        return this.http.post(`${API_URL}/addPermiso`, permiso);
    }

    deletePermiso(permiso: any) {
        return this.http.post(`${API_URL}/deletePermiso`, permiso);
    }
}
