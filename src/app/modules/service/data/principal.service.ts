import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { checktoken } from 'src/app/interceptors/token.interceptor';
import { API_URL } from 'src/environments/environment';
@Injectable({
    providedIn: 'root',
})
export class PrincipalService {
    usuario: any;
    constructor(private http: HttpClient) {}

    listarCantidades() {
        return this.http.get(`${API_URL}/listarCantidades`, { context: checktoken(), });
    }

    listarEstudiantesMateria() {
        return this.http.get(`${API_URL}/listarEstudiantesMateria`, { context: checktoken(), });
    }

    listarEstudiantesNivel() {
        return this.http.get(`${API_URL}/listarEstudiantesNivel`, { context: checktoken(), });
    }
}
