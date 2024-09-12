import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from 'src/environments/environment';
import { Operacion } from '../../models/operacion';
import { Observable } from 'rxjs';
import { checktoken } from 'src/app/interceptors/token.interceptor';

@Injectable()
export class OperacionService {
    constructor(private http: HttpClient) {}

    // Operation Services

    getOperations(): Observable<Operacion[]> {
        return this.http.get<Operacion[]>(`${API_URL}/getOperations`, { context: checktoken(), });
    }

    createOperation(data: any) {
        return this.http.post(`${API_URL}/createOperation`, data, { context: checktoken(), });
    }

    updateOperation(opeid: number, data: any) {
        return this.http.put(`${API_URL}/updateOperation/${opeid}`, data, { context: checktoken(), });
    }

    deleteOperation(opeid: number) {
        return this.http.delete(`${API_URL}/deleteOperation/${opeid}`, { context: checktoken(), });
    }

    // Other Examples

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
        return this.http.get(`${API_URL}/listarPermisoRol`, { context: checktoken(), });
    }

    getPermisos() {
        return this.http.get(`${API_URL}/getPermisos`, { context: checktoken(), });
    }

    getRoles() {
        return this.http.get(`${API_URL}/getRoles`, { context: checktoken(), });
    }

    getOperaciones() {
        return this.http.get(`${API_URL}/getOperaciones`, { context: checktoken(), });
    }

    updatePermiso(permiso: any) {
        return this.http.post(`${API_URL}/updatePermiso`, permiso, { context: checktoken(), });
    }

    getTipoOperacion() {
        return this.http.get(`${API_URL}/getTipoOperacion`, { context: checktoken(), });
    }
}
