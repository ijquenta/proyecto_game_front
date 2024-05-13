import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from 'src/environments/environment';

@Injectable()
export class CursoService {

    constructor(private http: HttpClient) { }


    listarCursoMateria(){
        return this.http.get(`${API_URL}/listarCursoMateria`);
    }

    eliminarCursoMateria(criterio: any){
        return this.http.post(`${API_URL}/eliminarCursoMateria`, criterio);
    }

    insertarCursoMateria(criterio: any){
        return this.http.post(`${API_URL}/insertarCursoMateria`, criterio);
    }

    modificarCursoMateria(criterio: any){
        return this.http.post(`${API_URL}/modificarCursoMateria`, criterio);
    }

    listaCursoCombo(){
        return this.http.get(`${API_URL}/listaCursoCombo`);
    }

    gestonarCursoMateriaEstado(criterio: any) {
        return this.http.post(`${API_URL}/gestionarCursoMateriaEstado`, criterio);
    }
}
