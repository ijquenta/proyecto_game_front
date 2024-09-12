import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from 'src/environments/environment';
import { Rol } from '../../models/rol';
import { checktoken } from 'src/app/interceptors/token.interceptor';

@Injectable({
    providedIn: 'root',
})
export class MateriaService {
    constructor(private http: HttpClient) {}

    listarMateria() {
        return this.http.get(`${API_URL}/listarMateria`, { context: checktoken(), });
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
    ListarPersona() {
        return this.http.get(`${API_URL}/listarPersona`, { context: checktoken(), });
    }
    eliminarMateria(criterio: any) {
        return this.http.post(`${API_URL}/eliminarMateria`, criterio, { context: checktoken(), });
    }
    insertarMateria(criterio: any) {
        return this.http.post(`${API_URL}/insertarMateria`, criterio, { context: checktoken(), });
    }
    modificarMateria(criterio: any) {
        return this.http.post(`${API_URL}/modificarMateria`, criterio, { context: checktoken(), });
    }
    gestionarMateriaEstado(criterio: any) {
        return this.http.post(`${API_URL}/gestionarMateriaEstado`, criterio, { context: checktoken(), });
    }

    getMateriaById(matid: Number) {
        return this.http.get(`${API_URL}/getMateriaById/${matid}`, { context: checktoken(), });
    }

    getInformacionDocente(criterio: any){
        return this.http.post(`${API_URL}/getInformacionDocente`, criterio, { context: checktoken() });
    }
}
