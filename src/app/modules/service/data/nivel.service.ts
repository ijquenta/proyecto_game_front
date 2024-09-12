import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { checktoken } from 'src/app/interceptors/token.interceptor';
import { API_URL } from 'src/environments/environment';

@Injectable()
export class NivelService {
    constructor(private http: HttpClient) {}

    listarNivel() {
        return this.http.get(`${API_URL}/listarNivel`, { context: checktoken(), });
    }
    insertarNivel(criterio: any) {
        return this.http.post(`${API_URL}/insertarNivel`, criterio, { context: checktoken(), });
    }
    eliminarNivel(criterio: any) {
        return this.http.post(`${API_URL}/eliminarNivel`, criterio, { context: checktoken(), });
    }
    modificarNivel(criterio: any) {
        return this.http.post(`${API_URL}/modificarNivel`, criterio, { context: checktoken(), });
    }
    gestionarNivelEstado(criterio: any) {
        return this.http.post(`${API_URL}/gestionarNivelEstado`, criterio, { context: checktoken(), });
    }
}
