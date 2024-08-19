import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from 'src/environments/environment';
import { Rol } from '../../models/rol';
import { TokenService } from 'src/app/modules/service/core/token.service';
import { checktoken } from 'src/app/interceptors/token.interceptor';

@Injectable({
    providedIn: 'root',
})
export class DocenteService {

    constructor(private http: HttpClient, private tokenService: TokenService) { }

    obtenerMateriasAsignadas(criterio: any){
        return this.http.post(`${API_URL}/obtenerMateriasAsignadas`, criterio);
    }

    listarDocente(){
        return this.http.get(`${API_URL}/listarDocente`)
    }

    listarMateriaEstudianteCurso(data) {
        return this.http.post(`${API_URL}/listarMateriaEstudianteCurso`, data);
    }


}
