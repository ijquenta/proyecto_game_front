import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from 'src/environments/environment';

@Injectable()
export class RolService {

    constructor(private http: HttpClient) { }
    // Operation CRUD
    gestionarRol(criterio: any){
        return this.http.post(`${API_URL}/gestionarRol`, criterio);
    }
    getTipoRol(){
        return this.http.get(`${API_URL}/tipoRol`);
    }
    getListarRoles(){
        return this.http.get(`${API_URL}/listarRoles`);
    }
}
