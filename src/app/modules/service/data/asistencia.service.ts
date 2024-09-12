import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from 'src/environments/environment';
import { checktoken } from 'src/app/interceptors/token.interceptor';

@Injectable({
    providedIn: 'root',
})
export class AsistenciaService {

    constructor(private http: HttpClient) { }

    listarAsistencia(){
        return this.http.get(`${API_URL}/listarAsistencia`, { context: checktoken(), })
    }


}
