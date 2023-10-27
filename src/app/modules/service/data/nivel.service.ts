import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from 'src/environments/environment';

@Injectable()
export class NivelService {

    constructor(private http: HttpClient) { }


    listarNivel(){
        console.log("Listar-Nivel-Service");
        return this.http.get(`${API_URL}/listarNivel`);
    }
    insertarNivel(criterio: any){
        console.log("Insertar-Nivel-Service");
        return this.http.post(`${API_URL}/insertarNivel`, criterio);
    }
}
