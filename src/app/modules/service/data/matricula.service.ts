import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from 'src/environments/environment';
import { Rol } from '../../models/rol';

@Injectable()
export class MatriculaService {

    constructor(private http: HttpClient) { }


    listarMatricula(){
        return this.http.get(`${API_URL}/listarMatricula`);
    }

    listarTipoMatricula(){
        return this.http.get(`${API_URL}/listarTipoMatricula`);
    }

    insertarMatricula(criterio: any){
        return this.http.post(`${API_URL}/insertarMatricula`, criterio);
    }

    modificarMatricula(criterio: any){
        return this.http.post(`${API_URL}/modificarMatricula`, criterio);
    }

    eliminarMatricula(criterio: any){
        return this.http.post(`${API_URL}/eliminarMatricula`, criterio);
    }

    gestionarMatriculaEstado(criterio: any){
        return this.http.post(`${API_URL}/gestionarMatriculaEstado`, criterio);
    }

    insertarTipoMatricula(criterio: any){
        return this.http.post(`${API_URL}/insertarTipoMatricula`, criterio);
    }

    modificarTipoMatricula(criterio: any){
        return this.http.post(`${API_URL}/modificarTipoMatricula`, criterio);
    }

    gestionarTipoMatriculaEstado(criterio: any){
        return this.http.post(`${API_URL}/gestionarTipoMatriculaEstado`, criterio);
    }

    listarTipoMatriculaCombo(){
        return this.http.get(`${API_URL}/listarTipoMatriculaCombo`);
    }

    listarTipoPersonaEstudiante(){
        return this.http.get(`${API_URL}/listarTipoPersonaEstudiante`);
    }
}
