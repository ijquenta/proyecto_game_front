import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../../api/product';
import { API_URL } from 'src/environments/environment';
import { Usuario } from '../../models/usuario';
import { Rol } from '../../models/rol';

@Injectable()
export class PersonaService {

    constructor(private http: HttpClient) { }


    gestionarPersona(criterio: any){
        console.log("Datos a GestionarPersona: ", criterio);
        return this.http.post(`${API_URL}/gestionarPersona`, criterio);
    }


    getUsuario(){
        return this.http.get(`${API_URL}/listaUsuarios`);
    }

    getRoles(){
        return this.http.get(`${API_URL}/tipoRol`);
    }

    crearRol(criterio: any){
        return this.http.post(`${API_URL}/crearRol`, criterio);
    }

    modificarRol(criterio: any){
        console.log("Service Modificar Rol", criterio);
        let registroModRol = new Rol();
        // registroModRol.rolId = criterio.rolid;
        // registroModRol.rolNombre = criterio.rolnombre;
        // registroModRol.rolDescripcion = criterio.roldescripcion;
        // registroModRol.rolUsuMod = 'Usu Modddd';
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


    getTipoDocumento(){
      return this.http.get(`${API_URL}/tipoDocumento`)
    }
    getTipoEstadoCivil(){
      return this.http.get(`${API_URL}/tipoEstadoCivil`)
    }
    getTipoGenero(){
      return this.http.get(`${API_URL}/tipoGenero`)
    }
    getTipoPais(){
      return this.http.get(`${API_URL}/tipoPais`)
    }
    getTipoCiudad(){
      return this.http.get(`${API_URL}/tipoCiudad`)
    }


}
