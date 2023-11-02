import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../../api/product';
import { API_URL } from 'src/environments/environment';
import { Usuario } from '../../models/usuario';
import { Rol } from '../../models/rol';

@Injectable()
export class UsuarioService {

    constructor(private http: HttpClient) { }

    // getUsuario() {
    //     console.log("GetUsuario");
    //     return this.http.get<any>(`${API_URL}/listaUsuarios`)
    //         .toPromise()
    //         .then(res => res.data as Usuario[])
    //         .then(data => data)
    // }

    getUsuario(){
        // console.log("GetUsuario");
        return this.http.get(`${API_URL}/listaUsuarios`);
    }

    getRoles(){
        // console.log("Roles");
        // return this.http.get(`${API_URL}/listarRoles`);
        return this.http.get(`${API_URL}/tipoRol`);
    }

    crearRol(criterio: any){
        // console.log("Service Crear Rol", criterio);
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
    // registrarDatosBeneficio(criterio: any) {
    //     return this.http.post(`${API_URL}/registrarBeneficioNuevo`, criterio);
    // }

    // getProductsSmall() {
    //     return this.http.get<any>('assets/release/data/products-small.json')
    //         .toPromise()
    //         .then(res => res.data as Product[])
    //         .then(data => data);
    // }

    // getProducts() {
    //     return this.http.get<any>('assets/release/data/products.json')
    //         .toPromise()
    //         .then(res => res.data as Product[])
    //         .then(data => data);
    // }

    // getProductsMixed() {
    //     return this.http.get<any>('assets/release/data/products-mixed.json')
    //         .toPromise()
    //         .then(res => res.data as Product[])
    //         .then(data => data);
    // }

    // getProductsWithOrdersSmall() {
    //     return this.http.get<any>('assets/release/data/products-orders-small.json')
    //         .toPromise()
    //         .then(res => res.data as Product[])
    //         .then(data => data);
    // }
}
