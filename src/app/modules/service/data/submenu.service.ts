import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from 'src/environments/environment';
import { Menu } from '../../models/menu';
import { TipoMenu } from '../../models/diccionario';
import { SubMenu } from '../../models/submenu';
import { Observable } from 'rxjs';

@Injectable()
export class SubMenuService {
    constructor(private http: HttpClient) {}

    // Sub Menu Services
    getListSubMenu(): Observable<SubMenu[]> {
        return this.http.get<SubMenu[]>(`${API_URL}/getListSubMenu`);
    }

    createSubMenu(data: any) {
        return this.http.post(`${API_URL}/createSubMenu`, data);
    }

    updateSubMenu(submenid: number, data: SubMenu) {
        return this.http.put(`${API_URL}/updateSubMenu/${submenid}`, data);
    }

    deleteSubMenu(submenid: number) {
        return this.http.delete(`${API_URL}/deleteSubMenu/${submenid}`);
    }

    getTipoMenu(): Observable<TipoMenu[]> {
        return this.http.get<TipoMenu[]>(`${API_URL}/getTipoMenu`);
    }
}
