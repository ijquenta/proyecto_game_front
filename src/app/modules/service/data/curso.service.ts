import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { checktoken } from 'src/app/interceptors/token.interceptor';
import { API_URL } from 'src/environments/environment';

@Injectable(
    {
        providedIn: 'root'
    }
)
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

    getCursoById(curid: Number){
        return this.http.get(`${API_URL}/getCursoById/${curid}`, { context: checktoken() });
    }

    getTipoCurso(){
        return this.http.get(`${API_URL}/getTipoCurso`, { context: checktoken() });
    }

    getTipoMateriaByCursoId(curid: any){
        return this.http.get(`${API_URL}/getTipoMateriaByCursoId/${curid}`, { context: checktoken() });
    }
}
