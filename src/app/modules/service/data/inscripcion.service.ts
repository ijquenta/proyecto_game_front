import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from 'src/environments/environment';

@Injectable()
export class InscripcionService {

    constructor(private http: HttpClient) { }


    listarInscripcion(){
        return this.http.get(`${API_URL}/listarInscripcion`);
    }
    insertarInscripcion(criterio: any){
        return this.http.post(`${API_URL}/insertarInscripcion`, criterio);
    }
    eliminarInscripcion(criterio: any){
        return this.http.post(`${API_URL}/eliminarInscripcion`, criterio);
    }
    modificarInscripcion(criterio: any){
        return this.http.post(`${API_URL}/modificarInscripcion`, criterio);
    }
    obtenerCursoMateria(criterio: any){
        return this.http.post(`${API_URL}/obtenerCursoMateria`, criterio);
    }
    listarComboCursoMateria(){
        return this.http.get(`${API_URL}/listarComboCursoMateria`);
    }
    listarComboMatricula(){
        return this.http.get(`${API_URL}/listarComboMatricula`)
    }
}
