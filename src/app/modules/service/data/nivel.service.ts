import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from 'src/environments/environment';

@Injectable()
export class NivelService {

    constructor(private http: HttpClient) { }


    listarNivel(){
        return this.http.get(`${API_URL}/listarNivel`);
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
    gestionarNivelEstado(criterio: any){
        return this.http.post(`${API_URL}/gestionarNivelEstado`, criterio)
    }
}
