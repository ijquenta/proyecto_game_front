import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from 'src/environments/environment';
import { checktoken } from 'src/app/interceptors/token.interceptor';
@Injectable()
export class InscripcionService {

    constructor(private http: HttpClient) { }


    listarInscripcion(){
        return this.http.get(`${API_URL}/listarInscripcion`, { context: checktoken() });
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

    listarComboMatriculaEstudiante(criterio: any){
        return this.http.post(`${API_URL}/listarComboMatriculaEstudiante`, criterio)
    }

    gestionarInscripcionEstado(criterio: any){
        return this.http.post(`${API_URL}/gestionarInscripcionEstado`, criterio);
    }

    obtenerEstudiantesInscritos(criterio: any){
        return this.http.post(`${API_URL}/obtenerEstudiantesInscritos`, criterio, { context: checktoken() });
    }

    getCursoMateriaByIds(criterio: any){
        return this.http.post(`${API_URL}/getCursoMateriaByIds`, criterio, { context: checktoken() });
    }
}
