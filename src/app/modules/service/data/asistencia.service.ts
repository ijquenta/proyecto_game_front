import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../../api/product';
import { API_URL } from 'src/environments/environment';
import { Usuario } from '../../models/usuario';
import { Rol } from '../../models/rol';
import { TokenService } from 'src/app/services/token.service';
import { checktoken } from 'src/app/interceptors/token.interceptor';

@Injectable({
    providedIn: 'root',
})
export class AsistenciaService {

    constructor(private http: HttpClient, private tokenService: TokenService) { }


    listarAsistencia(){
        return this.http.get(`${API_URL}/listarAsistencia`)
    }


}
