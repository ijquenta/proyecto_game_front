import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from 'src/environments/environment';
import { checktoken } from 'src/app/interceptors/token.interceptor';
@Injectable()
export class InscripcionService {
    constructor(private http: HttpClient) {}

    listarInscripcion() {
        return this.http.get(`${API_URL}/listarInscripcion`, { context: checktoken(), });
    }

    insertarInscripcion(criterio: any) {
        return this.http.post(`${API_URL}/insertarInscripcion`, criterio, { context: checktoken(), });
    }

    eliminarInscripcion(criterio: any) {
        return this.http.post(`${API_URL}/eliminarInscripcion`, criterio, { context: checktoken(), });
    }

    modificarInscripcion(criterio: any) {
        return this.http.post(`${API_URL}/modificarInscripcion`, criterio, { context: checktoken(), });
    }

    obtenerCursoMateria(criterio: any) {
        return this.http.post(`${API_URL}/obtenerCursoMateria`, criterio, { context: checktoken(), });
    }

    listarComboCursoMateria() {
        return this.http.get(`${API_URL}/listarComboCursoMateria`, { context: checktoken(), });
    }

    listarComboMatricula() {
        return this.http.get(`${API_URL}/listarComboMatricula`, { context: checktoken(), });
    }

    listarComboMatriculaEstudiante(criterio: any) {
        return this.http.post(`${API_URL}/listarComboMatriculaEstudiante`, criterio, { context: checktoken(), } );
    }

    gestionarInscripcionEstado(criterio: any) {
        return this.http.post(`${API_URL}/gestionarInscripcionEstado`, criterio, { context: checktoken(), } );
    }

    obtenerEstudiantesInscritos(criterio: any) {
        return this.http.post(`${API_URL}/obtenerEstudiantesInscritos`, criterio, { context: checktoken() } );
    }

    getCursoMateriaByIds(criterio: any) {
        return this.http.post(`${API_URL}/getCursoMateriaByIds`, criterio, { context: checktoken(), });
    }
}
