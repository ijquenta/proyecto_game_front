import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from 'src/environments/environment';
import { Rol } from '../../models/rol';

@Injectable()
export class MateriaService {

    constructor(private http: HttpClient) { }


    listarMateria(){
        console.log("ListarMateria_Service");
        return this.http.get(`${API_URL}/listarMateria`);
    }

    getRoles(){
        console.log("Roles");
        // return this.http.get(`${API_URL}/listarRoles`);
        return this.http.get(`${API_URL}/tipoRol`);
    }

    crearRol(criterio: any){
        console.log("Service Crear Rol", criterio);
        return this.http.post(`${API_URL}/crearRol`, criterio);
    }

    modificarRol(criterio: any){
        console.log("Service Modificar Rol", criterio);
        let registroModRol = new Rol();
        registroModRol.rolId = criterio.rolid;
        registroModRol.rolNombre = criterio.rolnombre;
        registroModRol.rolDescripcion = criterio.roldescripcion;
        registroModRol.rolUsuMod = 'Usu Modddd';
        console.log("datos service->", registroModRol);
        return this.http.post(`${API_URL}/modificarRol`, registroModRol);
    }
    eliminarRol(criterio: any){
        console.log("Service Eliminar Rol", criterio);
        return this.http.post(`${API_URL}/eliminarRol`, criterio);
    }
    ListarPersona(){
        console.log("ListarPersona");
        return this.http.get(`${API_URL}/listarPersona`);
    }

    eliminarMateria(criterio: any){
        console.log("Service Eliminar Materia", criterio);
        return this.http.post(`${API_URL}/eliminarMateria`, criterio);
    }
    insertarMateria(criterio: any){
        console.log("Service Insertar Materia", criterio);
        return this.http.post(`${API_URL}/insertarMateria`, criterio);
    }
    modificarMateria(criterio: any){
        console.log("Service Modificar Materia", criterio);
        return this.http.post(`${API_URL}/modificarMateria`, criterio);
    }
}
