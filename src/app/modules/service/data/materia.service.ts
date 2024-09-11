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
        return this.http.get(`${API_URL}/listarMateria`);
    }
    getRoles() {
        return this.http.get(`${API_URL}/tipoRol`);
    }
    crearRol(criterio: any) {
        return this.http.post(`${API_URL}/crearRol`, criterio);
    }
    modificarRol(criterio: any) {
        let registroModRol = new Rol();
        return this.http.post(`${API_URL}/modificarRol`, registroModRol);
    }
    eliminarRol(criterio: any) {
        return this.http.post(`${API_URL}/eliminarRol`, criterio);
    }
    ListarPersona() {
        return this.http.get(`${API_URL}/listarPersona`);
    }
    eliminarMateria(criterio: any) {
        return this.http.post(`${API_URL}/eliminarMateria`, criterio);
    }
    insertarMateria(criterio: any) {
        return this.http.post(`${API_URL}/insertarMateria`, criterio);
    }
    modificarMateria(criterio: any) {
        return this.http.post(`${API_URL}/modificarMateria`, criterio);
    }
    gestionarMateriaEstado(criterio: any) {
        return this.http.post(`${API_URL}/gestionarMateriaEstado`, criterio);
    }

    getMateriaById(matid: Number) {
        return this.http.get(`${API_URL}/getMateriaById/${matid}`, {
            context: checktoken(),
        });
    }

    getInformacionDocente(criterio: any){
        return this.http.post(`${API_URL}/getInformacionDocente`, criterio, { context: checktoken() });
    }
}
