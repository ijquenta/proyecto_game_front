import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { checktoken } from 'src/app/interceptors/token.interceptor';

@Injectable({
    providedIn: 'root',
})
export class UsuarioService {
    constructor(private http: HttpClient) {}

    obtenerUsuarios() {
        return this.http.get(`${API_URL}/usuarios`);
    }

    obtenerUsuarioPorId(id: any) {
        return this.http.get(`${API_URL}/usuarios/${id}`);
    }

    obtenerPacientes() {
        return this.http.get(`${API_URL}/pacientes`);
    }

    obtenerDoctores() {
        return this.http.get(`${API_URL}/doctores`);
    }

    obtenerSesiones(){
        return this.http.get(`${API_URL}/sesiones`);
    }

    crearUsuario(criterio: any) {
        return this.http.post(`${API_URL}/usuarios`, criterio);
    }

    crearPaciente(criterio: any) {
        return this.http.post(`${API_URL}/pacientes`, criterio);
    }

    crearDoctor(criterio: any) {
        return this.http.post(`${API_URL}/doctores`, criterio);
    }

    crearSesion(criterio: any) {
        return this.http.post(`${API_URL}/sesiones`, criterio);
    }

    modificarUsuario(criterio: any, id: any) {
        return this.http.put(`${API_URL}/usuarios/${id}`, criterio);
    }

    modificarPaciente(criterio: any, id: any) {
        return this.http.put(`${API_URL}/pacientes/${id}`, criterio);
    }

    modificarDoctor(criterio: any, id: any) {
        return this.http.put(`${API_URL}/doctores/${id}`, criterio);
    }

    modificarSesion(criterio: any, id: any) {
        return this.http.put(`${API_URL}/sesiones/${id}`, criterio);
    }

    desactivarUsuario(id: any) {
        return this.http.delete(`${API_URL}/usuarios/${id}`);
    }

    desactivarPaciente(id: any) {
        return this.http.delete(`${API_URL}/pacientes/${id}`);
    }

    desactivarDoctor(id: any) {
        return this.http.delete(`${API_URL}/doctores/${id}`);
    }

    desactivarSesion(id: any) {
        return this.http.delete(`${API_URL}/sesiones/${id}`);
    }





    //


    getUsuario() {
        return this.http.get(`${API_URL}/listaUsuarios`, { context: checktoken(), });
    }

    getPacientes() {
        return this.http.get(`${API_URL}/pacientes`);
    }

    getUsers() {
        return this.http.get(`${API_URL}/getUsers`, { context: checktoken(), });
    }

    getRoles() {
        return this.http.get(`${API_URL}/tipoRol`, { context: checktoken(), });
    }

    crearRol(criterio: any) {
        return this.http.post(`${API_URL}/crearRol`, criterio, { context: checktoken(), });
    }

    eliminarRol(criterio: any) {
        return this.http.post(`${API_URL}/eliminarRol`, criterio, { context: checktoken(), });
    }

    listaUsuario() {
        return this.http.get(`${API_URL}/listaUsuario`, { context: checktoken(), });
    }

    listaProgreso() {
        return this.http.get(`${API_URL}/progresos`);
    }

    gestionarUsuario(criterio: any) {
        return this.http.post(`${API_URL}/gestionarUsuario`, criterio, { context: checktoken(), });
    }

    getTipoPersona() {
        return this.http.get(`${API_URL}/tipoPersona`, { context: checktoken(), });
    }

    getTipoPersonaDocente() {
        return this.http.get(`${API_URL}/tipoPersonaDocente`, { context: checktoken(), });
    }

    gestionarUsuarioEstado(criterio: any) {
        return this.http.post(`${API_URL}/gestionarUsuarioEstado`, criterio, { context: checktoken(), });
    }

    gestionarUsuarioPassword(criterio: any) {
        return this.http.post(`${API_URL}/gestionarUsuarioPassword`, criterio, { context: checktoken(), });
    }

    buscarUsuario(criterio: any): Observable<any> {
        return this.http.post<any>(`${API_URL}/buscarUsuario`, criterio, { context: checktoken(), });
    }

    requestChangePassword(criterio: any) {
        return this.http.post(`${API_URL}/requestChangePassword`, criterio, { context: checktoken(), });
    }

    resetPassword(token: any, criterio: any) {
        return this.http.post(`${API_URL}/auth/resetPassword/${token}`, criterio, { context: checktoken() } );
    }

    changePassword(criterio: any) {
        return this.http.post(`${API_URL}/changePassword`, criterio, { context: checktoken(), });
    }
}
