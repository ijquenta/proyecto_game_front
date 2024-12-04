import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from 'src/environments/environment';
import { TokenService } from 'src/app/modules/service/core/token.service';
import { checktoken } from 'src/app/interceptors/token.interceptor';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/modules/service/core/auth.service';

const httpOptions = {
    responseType: 'arraybuffer' as 'json',
};

@Injectable({
    providedIn: 'root',
})
export class PersonaService {
    usuario: any;
    constructor(
        private http: HttpClient,
        private tokenService: TokenService,
        private spinner: NgxSpinnerService,
        private authService: AuthService
    ) {}

    // Person services

    getPacientes() {
        return this.http.get(`${API_URL}/pacientes`);
    }

    getPersons() {
        return this.http.get(`${API_URL}/getPersons`, { context: checktoken(), });
    }

    managePerson(criterio: any) {
        return this.http.post(`${API_URL}/managePerson`, criterio, { context: checktoken(), });
    }

    deletePerson(criterio: any) {
        return this.http.post(`${API_URL}/deletePerson`, criterio, { context: checktoken(), });
    }

    deletePersonForm(perid: number) {
        return this.http.delete(`${API_URL}/deletePersonForm/${perid}`, { context: checktoken(), });
    }

    // Profile services

    updateProfile(criterio: any) {
        return this.http.post(`${API_URL}/updateProfile`, criterio, { context: checktoken(), });
    }

    showPersonData(perid: number) {
        return this.http.get(`${API_URL}/showPersonData/${perid}`, { context: checktoken(), });
    }

    // Servicios Informacion Admision


    listarInformacionPersonal(perid: number) {
        return this.http.get(`${API_URL}/informacionPersonal/${perid}`, { context: checktoken(), });
    }

    adicionarInformacionPersonal(criterio: any) {
        return this.http.post(`${API_URL}/informacionPersonal`, criterio, { context: checktoken(), });
    }

    modificarInformacionPersonal(criterio: any, perid: number) {
        return this.http.put(`${API_URL}/informacionPersonal/${perid}`, criterio, { context: checktoken() } );
    }

    listarInformacionAcademica(perid: number) {
        return this.http.get(`${API_URL}/informacionAcademica/${perid}`, { context: checktoken(), });
    }

    adicionarInformacionAcademica(criterio: any) {
        return this.http.post(`${API_URL}/informacionAcademica`, criterio, { context: checktoken(), });
    }

    modificarInformacionAcademica(criterio: any, perinfoaca: number) {
        return this.http.put(`${API_URL}/informacionAcademica/${perinfoaca}`, criterio, { context: checktoken() } );
    }

    eliminarInformacionAcademica(perinfoaca: number) {
        return this.http.delete(`${API_URL}/informacionAcademica/${perinfoaca}`, { context: checktoken() } );
    }

    // Servicios Informacion Ministerial

    listarInformacionMinisterial(perid: number) {
        return this.http.get(`${API_URL}/informacionMinisterial/${perid}`, { context: checktoken(), });
    }

    adicionarInformacionMinisterial(criterio: any) {
        return this.http.post(`${API_URL}/informacionMinisterial`, criterio, { context: checktoken(), });
    }

    modificarInformacionMinisterial(criterio: any, perinfomin: number) {
        return this.http.put(`${API_URL}/informacionMinisterial/${perinfomin}`, criterio, { context: checktoken() } );
    }

    // Servicios Documento Admisión

    listarDocumentoAdmision(perid: number) {
        return this.http.get(`${API_URL}/documentoAdmision/${perid}`, { context: checktoken(), });
    }

    adicionarDocumentoAdmision(criterio: any) {
        return this.http.post(`${API_URL}/documentoAdmision`, criterio, { context: checktoken(), });
    }

    modificarDocumentoAdmision(criterio: any) {
        return this.http.put(`${API_URL}/documentoAdmision`, criterio, { context: checktoken(), });
    }

    // Servicios Tipo Profesión

    listarTipoProfesion() {
        return this.http.get(`${API_URL}/tipoProfesion`, { context: checktoken(), });
    }

    adicionarTipoProfesion(criterio: any) {
        return this.http.post(`${API_URL}/tipoProfesion`, criterio, { context: checktoken(), });
    }

    modificarTipoProfesion(criterio: any, proid: number) {
        return this.http.put(`${API_URL}/tipoProfesion/${proid}`, criterio, { context: checktoken(), });
    }

    eliminarTipoProfesion(proid: number) {
        return this.http.delete(`${API_URL}/tipoProfesion/${proid}`, { context: checktoken(), });
    }

    // Servicios Tipo Educación

    listarTipoEducacion() {
        return this.http.get(`${API_URL}/tipoEducacion`, { context: checktoken(), });
    }

    adicionarTipoEducacion(criterio: any) {
        return this.http.post(`${API_URL}/tipoEducacion`, criterio, { context: checktoken(), });
    }

    modificarTipoEducacion(criterio: any, eduid: number) {
        return this.http.put(`${API_URL}/tipoEducacion/${eduid}`, criterio, { context: checktoken(), });
    }

    eliminarTipoEducacion(eduid: number) {
        return this.http.delete(`${API_URL}/tipoEducacion/${eduid}`, { context: checktoken(), });
    }

    // Servicios Tipo Cargo

    listarTipoCargo() {
        return this.http.get(`${API_URL}/tipoCargo`, { context: checktoken() });
    }

    adicionarTipoCargo(criterio: any) {
        return this.http.post(`${API_URL}/tipoCargo`, criterio, { context: checktoken(), });
    }

    modificarTipoCargo(criterio: any, carid: number) {
        return this.http.put(`${API_URL}/tipoCargo/${carid}`, criterio, { context: checktoken(), });
    }

    eliminarTipoCargo(carid: number) {
        return this.http.delete(`${API_URL}/tipoCargo/${carid}`, { context: checktoken(), });
    }

    // Otros servicios

    actualizarDatosPersonales(criterio: any) {
        return this.http.post(`${API_URL}/actualizarDatosPersonales`, criterio, { context: checktoken(), });
    }

    createPersonForm(criterio: any) {
        return this.http.post(`${API_URL}/createPersonForm`, criterio, { context: checktoken(), });
    }

    getUsuario() {
        return this.http.get(`${API_URL}/listaUsuarios`, { context: checktoken(), });
    }

    getRoles() {
        return this.http.get(`${API_URL}/tipoRol`, { context: checktoken(), });
    }

    crearRol(criterio: any) {
        return this.http.post(`${API_URL}/crearRol`, criterio), { context: checktoken(), };
    }

    eliminarRol(criterio: any) {
        return this.http.post(`${API_URL}/eliminarRol`, criterio, { context: checktoken(), });
    }

    getTipoDocumento() {
        return this.http.get(`${API_URL}/tipoDocumento`, { context: checktoken(), });
    }

    getTipoEstadoCivil() {
        return this.http.get(`${API_URL}/tipoEstadoCivil`, { context: checktoken(), });
    }

    getTipoGenero() {
        return this.http.get(`${API_URL}/tipoGenero`, { context: checktoken(), });
    }

    getTipoPais() {
        return this.http.get(`${API_URL}/tipoPais`, { context: checktoken(), });
    }

    getTipoCiudad() {
        return this.http.get(`${API_URL}/tipoCiudad`, { context: checktoken(), });
    }
}
