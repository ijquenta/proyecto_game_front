import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from 'src/environments/environment';
import { TipoIcono } from '../../models/diccionario';
import { Observable } from 'rxjs';

@Injectable()
export class TipoIconoService {

    constructor(private http: HttpClient) { }

    // Menu Services

    getTipoIcono(): Observable<TipoIcono[]>{
        return this.http.get<TipoIcono[]>(`${API_URL}/getTipoIcono`)
    }




    // Other examples
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
