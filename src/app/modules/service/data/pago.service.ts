import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../../api/product';
import { API_URL } from 'src/environments/environment';
import { Usuario } from '../../models/usuario';
import { Rol } from '../../models/rol';
import { TokenService } from 'src/app/services/token.service';
import { checktoken } from 'src/app/interceptors/token.interceptor';

@Injectable({
    providedIn: 'root',
})
export class PagoService {

    constructor(private http: HttpClient, private tokenService: TokenService) { }


    listarPago(){
        return this.http.get(`${API_URL}/listarPago`)
    }

    listarPagoCurso(){
        return this.http.get(`${API_URL}/listarPagoCurso`)
    }

    listarPagoEstudiante(data) {
        return this.http.post(`${API_URL}/listarPagoEstudiante`, data);
    }

    listarPagoEstudianteMateria(data) {
        return this.http.post(`${API_URL}/listarPagoEstudianteMateria`, data);
    }

    listarPagoEstudiantesMateria(data) {
        return this.http.post(`${API_URL}/listarPagoEstudiantesMateria`, data);
    }

    gestionarPago(data) {
        return this.http.post(`${API_URL}/gestionarPago`, data);
    }
}
