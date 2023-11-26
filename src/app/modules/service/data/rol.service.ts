import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from 'src/environments/environment';

@Injectable()
export class RolService {

    constructor(private http: HttpClient) { }


    gestionarRol(criterio: any){
        // console.log("Datos a Gestionar Rol: ", criterio);
        return this.http.post(`${API_URL}/gestionarRol`, criterio);
    }

    getTipoRol(){
        // console.log("Tipo Rol");
        return this.http.get(`${API_URL}/tipoRol`);
    }

    getListarRoles(){
        // console.log("Listar Roles: ");
        return this.http.get(`${API_URL}/listarRoles`);
    }


}
