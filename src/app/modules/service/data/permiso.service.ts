import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from 'src/environments/environment';
import { checktoken } from 'src/app/interceptors/token.interceptor';

@Injectable()
export class PermisoService {
    constructor(private http: HttpClient) {}

    listarNivel() {
        return this.http.get(`${API_URL}/listarNivel`, { context: checktoken(), });
    }

    insertarNivel(criterio: any) {
        return this.http.post(`${API_URL}/insertarNivel`, criterio, { context: checktoken(), });
    }

    eliminarNivel(criterio: any) {
        return this.http.post(`${API_URL}/eliminarNivel`, criterio, { context: checktoken(), });
    }

    modificarNivel(criterio: any) {
        return this.http.post(`${API_URL}/modificarNivel`, criterio, { context: checktoken(), });
    }

    gestionarNivelEstado(criterio: any) {
        return this.http.post(`${API_URL}/gestionarNivelEstado`, criterio, { context: checktoken(), });
    }

    listarPermiso() {
        return this.http.get(`${API_URL}/listarPermiso`, { context: checktoken(), });
    }

    listarPermisoRol() {
        return this.http.get(`${API_URL}/listarPermisoRol`);
    }

    getPermisos() {
        return this.http.get(`${API_URL}/getPermisos`, { context: checktoken(), });
    }

    getRoles() {
        return this.http.get(`${API_URL}/getRoles`, { context: checktoken() });
    }

    getOperaciones() {
        return this.http.get(`${API_URL}/getOperaciones`, { context: checktoken(), });
    }

    updatePermiso(permiso: any) {
        return this.http.post(`${API_URL}/updatePermiso`, permiso, { context: checktoken(), });
    }

    addPermiso(permiso: any) {
        return this.http.post(`${API_URL}/addPermiso`, permiso, { context: checktoken(), });
    }

    deletePermiso(permiso: any) {
        return this.http.post(`${API_URL}/deletePermiso`, permiso, { context: checktoken(), });
    }
}
