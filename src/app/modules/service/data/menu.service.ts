import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from 'src/environments/environment';
import { Menu } from '../../models/menu';
import { Observable } from 'rxjs';
import { checktoken } from 'src/app/interceptors/token.interceptor';

@Injectable()
export class MenuService {
    constructor(private http: HttpClient) {}

    getMenus(): Observable<Menu[]> {
        return this.http.get<Menu[]>(`${API_URL}/getMenus`, { context: checktoken(), });
    }

    createMenu(data: any) {
        return this.http.post(`${API_URL}/createMenu`, data, { context: checktoken(), });
    }

    updateMenu(menuid: number, data: Menu) {
        return this.http.put(`${API_URL}/updateMenu/${menuid}`, data, { context: checktoken(), });
    }

    deleteMenu(menuid: number) {
        return this.http.delete(`${API_URL}/deleteMenu/${menuid}`, { context: checktoken(), });
    }

    createOperation(data: any) {
        return this.http.post(`${API_URL}/createOperation`, data, { context: checktoken(), });
    }

    updateOperation(opeid: number, data: any) {
        return this.http.put(`${API_URL}/updateOperation/${opeid}`, data, { context: checktoken(), });
    }

    deleteOperation(opeid: number) {
        return this.http.delete(`${API_URL}/deleteOperation/${opeid}`, { context: checktoken(), });
    }
}
