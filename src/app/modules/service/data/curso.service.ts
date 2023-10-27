import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from 'src/environments/environment';

@Injectable()
export class CursoService {

    constructor(private http: HttpClient) { }


    listarCursoMateria(){
        console.log("Listar-Curso-Materia-Service");
        return this.http.get(`${API_URL}/listarCursoMateria`);
    }

    listaCursoCombo(){
        console.log("Lista Curso Combo");
        return this.http.get(`${API_URL}/listaCursoCombo`);
    }
}
