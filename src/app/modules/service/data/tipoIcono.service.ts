import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from 'src/environments/environment';
import { TipoIcono } from '../../models/diccionario';
import { Observable } from 'rxjs';
import { checktoken } from 'src/app/interceptors/token.interceptor';

@Injectable()
export class TipoIconoService {
    constructor(private http: HttpClient) {}

    // Menu Services

    getTipoIcono(): Observable<TipoIcono[]> {
        return this.http.get<TipoIcono[]>(`${API_URL}/getTipoIcono`, { context: checktoken(), });
    }

    findIdIcono(data: any) {
        return this.http.post(`${API_URL}/findIdIcono`, data, { context: checktoken(), });
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
