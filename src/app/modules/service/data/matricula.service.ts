import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { checktoken } from 'src/app/interceptors/token.interceptor';
import { API_URL } from 'src/environments/environment';

@Injectable()
export class MatriculaService {
    constructor(private http: HttpClient) {}

    listarMatricula() {
        return this.http.get(`${API_URL}/listarMatricula`, { context: checktoken() });
    }

    listarMatriculaEstudiante(perid: number){
        return this.http.get(`${API_URL}/listarMatriculaEstudiante/${perid}`, { context: checktoken() });
    }

    listarTipoMatricula() {
        return this.http.get(`${API_URL}/listarTipoMatricula`, { context: checktoken(), });
    }

    insertarMatricula(criterio: any) {
        return this.http.post(`${API_URL}/insertarMatricula`, criterio, { context: checktoken(), });
    }

    modificarMatricula(criterio: any) {
        return this.http.post(`${API_URL}/modificarMatricula`, criterio, { context: checktoken(), });
    }

    eliminarMatricula(criterio: any) {
        return this.http.post(`${API_URL}/eliminarMatricula`, criterio, { context: checktoken(), });
    }

    gestionarMatriculaEstado(criterio: any) {
        return this.http.post(`${API_URL}/gestionarMatriculaEstado`, criterio, { context: checktoken(), });
    }

    insertarTipoMatricula(criterio: any) {
        return this.http.post(`${API_URL}/insertarTipoMatricula`, criterio, { context: checktoken(), });
    }

    modificarTipoMatricula(criterio: any) {
        return this.http.post(`${API_URL}/modificarTipoMatricula`, criterio, { context: checktoken(), });
    }

    gestionarTipoMatriculaEstado(criterio: any) {
        return this.http.post(`${API_URL}/gestionarTipoMatriculaEstado`, criterio, { context: checktoken(), } );
    }

    listarTipoMatriculaCombo() {
        return this.http.get(`${API_URL}/listarTipoMatriculaCombo`, { context: checktoken(), });
    }

    listarTipoPersonaEstudiante() {
        return this.http.get(`${API_URL}/listarTipoPersonaEstudiante`, { context: checktoken(), });
    }
}
