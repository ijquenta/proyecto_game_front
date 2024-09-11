import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from 'src/environments/environment';
import { checktoken } from 'src/app/interceptors/token.interceptor';

@Injectable({
    providedIn: 'root', // Hace que el servicio esté disponible globalmente
})

export class HorarioService {
    constructor(private http: HttpClient) {}

    getHorarios() {
        return this.http.get(`${API_URL}/horarios`, { context: checktoken() });
    }

    getHorariosByCursoMateria(curmatid: number) {
        return this.http.get(`${API_URL}/horarios/${curmatid}`, { context: checktoken() });
    }

    createHorario(horario: any) {
        return this.http.post(`${API_URL}/horarios`, horario, { context: checktoken() });
    }

    updateHorario(horid: number) {
        return this.http.put(`${API_URL}/horarios/${horid}`, { context: checktoken() });
    }

    deleteHorario(horid: number) {
        return this.http.delete(`${API_URL}/horarios/${horid}`, { context: checktoken() });
    }

    getHorariosPorCurmatid(curmatid: number) {
        return this.http.get(`${API_URL}/getHorariosPorCurmatid/${curmatid}`, { context: checktoken() });
    }
}
