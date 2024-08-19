import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from 'src/environments/environment';
@Injectable({
    providedIn: 'root',
})
export class PrincipalService {
    usuario: any;
    constructor(private http: HttpClient) {}

    listarCantidades() {
        return this.http.get(`${API_URL}/listarCantidades`);
    }

    listarEstudiantesMateria() {
        return this.http.get(`${API_URL}/listarEstudiantesMateria`);
    }

    listarEstudiantesNivel() {
        return this.http.get(`${API_URL}/listarEstudiantesNivel`);
    }
}
