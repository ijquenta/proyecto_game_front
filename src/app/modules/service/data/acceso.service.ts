import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from 'src/environments/environment';

@Injectable()
export class AccesoService {

    constructor(private http: HttpClient) { }

    getAccesses(){
        return this.http.get(`${API_URL}/getAccesses`)
    }

    getSubMenus(){
        return this.http.get(`${API_URL}/getSubMenus`)
    }

    getSubMenuType(){
        return this.http.get(`${API_URL}/getSubMenuType`);
    }

    createAccess(data: any){
        return this.http.post(`${API_URL}/createAccess`, data);
    }

    updateAccess(accid: number, data: any){
        return this.http.put(`${API_URL}/updateAccess/${accid}`, data)
    }

    deleteAccess(accid: number) {
        return this.http.delete(`${API_URL}/deleteAccess/${accid}`)
    }

    // Examples

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

    addPermiso(permiso: any){
        return this.http.post(`${API_URL}/addPermiso`, permiso)
    }

    deletePermiso(permiso: any){
        return this.http.post(`${API_URL}/deletePermiso`, permiso)
    }
}
