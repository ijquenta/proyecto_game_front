import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from 'src/environments/environment';
import { checktoken } from 'src/app/interceptors/token.interceptor';

@Injectable({
    providedIn: 'root',
})
export class DiccionarioService {
    constructor(private http: HttpClient) {}

    getTipoMateria(criterio: any) {
        return this.http.post(`${API_URL}/listaMateriaCombo`, criterio);
    }

    getListaPersonaDocenteCombo(criterio: any) {
        return this.http.post(`${API_URL}/listaPersonaDocenteCombo`, criterio);
    }
}
