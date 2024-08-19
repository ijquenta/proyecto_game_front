import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from 'src/environments/environment';
import { checktoken } from 'src/app/interceptors/token.interceptor';

@Injectable({
    providedIn: 'root',
})
export class EstudianteService {
    constructor(private http: HttpClient) {}

    obtenerMateriasInscritas(criterio: any) {
        return this.http.post(`${API_URL}/obtenerMateriasInscritas`, criterio);
    }

    listarEstudiante() {
        return this.http.get(`${API_URL}/listarEstudiante`);
    }
}
