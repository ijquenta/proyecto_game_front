import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from 'src/environments/environment';
import { checktoken } from 'src/app/interceptors/token.interceptor';

@Injectable()
export class AccesoService {

    constructor(private http: HttpClient) { }

    getAccesses(){
        return this.http.get(`${API_URL}/getAccesses`, { context: checktoken()})
    }

    getSubMenus(){
        return this.http.get(`${API_URL}/getSubMenus`, { context: checktoken(), })
    }

    getSubMenuType(){
        return this.http.get(`${API_URL}/getSubMenuType`, { context: checktoken(), });
    }

    createAccess(data: any){
        return this.http.post(`${API_URL}/createAccess`, data, { context: checktoken(), });
    }

    updateAccess(accid: number, data: any){
        return this.http.put(`${API_URL}/updateAccess/${accid}`, data, { context: checktoken(), })
    }

    deleteAccess(accid: number) {
        return this.http.delete(`${API_URL}/deleteAccess/${accid}`, { context: checktoken(), })
    }

    getIconoNombre(submenid: number){
        return this.http.get(`${API_URL}/getIconoNombre/${submenid}`, { context: checktoken(), })
    }
}
