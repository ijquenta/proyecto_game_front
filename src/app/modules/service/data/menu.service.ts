import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from 'src/environments/environment';
import { Menu } from '../../models/menu';
import { Observable } from 'rxjs';

@Injectable()
export class MenuService {

    constructor(private http: HttpClient) { }

    // Menu Services

    getMenus(): Observable<Menu[]>{
        return this.http.get<Menu[]>(`${API_URL}/getMenus`)
    }

    createMenu(data: Menu){
        return this.http.post(`${API_URL}/createMenu`, data);
    }

    updateMenu(menuid: number, data: Menu){
        return this.http.put(`${API_URL}/updateMenu/${menuid}`, data)
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
}
