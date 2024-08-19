import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from 'src/environments/environment';
import { checktoken } from 'src/app/interceptors/token.interceptor';

@Injectable()
export class RolService {
    constructor(private http: HttpClient) {}

    getRoles() {
        return this.http.get(`${API_URL}/getRoles`, { context: checktoken() });
    }

    manageRole(criterio: any) {
        return this.http.post(`${API_URL}/manageRole`, criterio, {
            context: checktoken(),
        });
    }

    manageRoleStatus(criterio: any) {
        return this.http.post(`${API_URL}/manageRoleStatus`, criterio, {
            context: checktoken(),
        });
    }

    getTipoRol() {
        return this.http.get(`${API_URL}/tipoRol`);
    }

    deleteRole(rolid: number) {
        return this.http.delete(`${API_URL}/deleteRole/${rolid}`, {
            context: checktoken(),
        });
    }
}
