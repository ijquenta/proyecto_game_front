import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from 'src/environments/environment';

@Injectable()
export class InscripcionService {

    constructor(private http: HttpClient) { }


    listarInscripcion(){
        return this.http.get(`${API_URL}/listarInscripcion`);
    }
    insertarNivel(criterio: any){
        return this.http.post(`${API_URL}/insertarNivel`, criterio);
    }
    eliminarNivel(criterio: any){
        return this.http.post(`${API_URL}/eliminarNivel`, criterio);
    }
    modificarNivel(criterio: any){
        return this.http.post(`${API_URL}/modificarNivel`, criterio);
    }
}
