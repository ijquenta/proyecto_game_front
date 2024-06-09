import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from 'src/environments/environment';
import { Operacion } from '../../models/operacion';
import { Observable } from 'rxjs';

@Injectable()
export class OperacionService {

    constructor(private http: HttpClient) { }

    // Operation Services

    getOperations(): Observable<Operacion[]>{
        return this.http.get<Operacion[]>(`${API_URL}/getOperations`)
    }

    createOperation(data: any){
        return this.http.post(`${API_URL}/createOperation`, data);
    }

    updateOperation(opeid: number, data: any){
        return this.http.put(`${API_URL}/updateOperation/${opeid}`, data)
    }

    deleteOperation(opeid: number) {
        return this.http.delete(`${API_URL}/deleteOperation/${opeid}`)
    }

    // Other Examples
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
    listarPermiso(){
        return this.http.get(`${API_URL}/listarPermiso`);
    }
    listarPermisoRol(){
        return this.http.get(`${API_URL}/listarPermisoRol`);
    }
    getPermisos(){
        return this.http.get(`${API_URL}/getPermisos`)
    }
    getRoles(){
        return this.http.get(`${API_URL}/getRoles`)
    }
    getOperaciones(){
        return this.http.get(`${API_URL}/getOperaciones`)
    }
    updatePermiso(permiso: any){
        return this.http.post(`${API_URL}/updatePermiso`, permiso);
    }
    getTipoOperacion(){
        return this.http.get(`${API_URL}/getTipoOperacion`)
    }
}
