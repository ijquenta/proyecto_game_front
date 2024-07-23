import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from 'src/environments/environment';
import { Rol } from '../../models/rol';
import { TokenService } from 'src/app/modules/service/core/token.service';
import { checktoken } from 'src/app/interceptors/token.interceptor';
import { Observable } from 'rxjs';

import { ArchivosService } from '../util/archivos.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/modules/service/core/auth.service';

const httpOptions = {
    responseType: 'arraybuffer' as 'json'
};

@Injectable({
    providedIn: 'root',
})

export class PersonaService {

    usuario: any;
    constructor(private http: HttpClient,
                private tokenService: TokenService,
                private archivos: ArchivosService,
                private spinner: NgxSpinnerService,
                private authService: AuthService) { }


    modificiarPerfil(criterio: any){
        return this.http.post(`${API_URL}/modificarPerfil`, criterio, { context: checktoken()})
    }

    mostrarPerfil(perid: number){
        return this.http.get(`${API_URL}/mostrarDatosPersona/${perid}`, { context: checktoken()})
    }

    // Servicios Informacion Admision

    rptInformacionAdmision(perid: number) {
        this.usuario = this.authService.getUserData();
        const criterio = {
            perid: perid,
            usuname: this.usuario[0]?.usuname
        }
        this.spinner.show();
        this.http.post(`${API_URL}/rptInformacionAdmision`, criterio, httpOptions)
            .subscribe(
                (data: any) => {
                    this.spinner.hide();
                    this.archivos.generateReportPDF(data, 'Reporte Ficha Admisíon');
                },
                (error) => {
                    this.spinner.hide();
                    console.error(error);
                    this.archivos.showToast();
                }
            );
    }

    listarInformacionPersonal(perid: number){
        return this.http.get(`${API_URL}/informacionPersonal/${perid}`, { context: checktoken()})
    }

    adicionarInformacionPersonal(criterio: any){
        return this.http.post(`${API_URL}/informacionPersonal`, criterio, { context: checktoken()})
    }

    modificarInformacionPersonal(criterio: any, perid: number){
        return this.http.put(`${API_URL}/informacionPersonal/${perid}`, criterio, { context: checktoken()})
    }

    listarInformacionAcademica(perid: number){
        return this.http.get(`${API_URL}/informacionAcademica/${perid}`, { context: checktoken()})
    }

    adicionarInformacionAcademica(criterio: any){
        return this.http.post(`${API_URL}/informacionAcademica`, criterio, { context: checktoken()})
    }

    modificarInformacionAcademica(criterio: any, perinfoaca: number){
        return this.http.put(`${API_URL}/informacionAcademica/${perinfoaca}`, criterio, { context: checktoken()})
    }

    eliminarInformacionAcademica(perinfoaca: number){
        return this.http.delete(`${API_URL}/informacionAcademica/${perinfoaca}`, { context: checktoken()})
    }

    // Servicios Informacion Ministerial


    listarInformacionMinisterial(perid: number){
        return this.http.get(`${API_URL}/informacionMinisterial/${perid}`, { context: checktoken()})
    }

    adicionarInformacionMinisterial(criterio: any){
        return this.http.post(`${API_URL}/informacionMinisterial`, criterio, { context: checktoken()})
    }

    modificarInformacionMinisterial(criterio: any, perinfomin: number){
        return this.http.put(`${API_URL}/informacionMinisterial/${perinfomin}`, criterio, { context: checktoken()})
    }


    // Servicios Documento

    listarDocumentoAdmision(perid: number){
        return this.http.get(`${API_URL}/documentoAdmision/${perid}`, { context: checktoken()})
    }

    mostrarDocumentoAdmision(filename: any) {
        this.spinner.show();
        this.http.get(`${API_URL}/documentoAdmision/${filename}`, httpOptions)
        .subscribe(
            (data: any) => {
            this.spinner.hide();
            this.archivos.generateReportPDF(data, filename);
            },
            (error) => {
            this.spinner.hide();
            console.error(error);
            this.archivos.showToast();
            }
        );
    }

    adicionarDocumentoAdmision(criterio: any){
        return this.http.post(`${API_URL}/documentoAdmision`, criterio, { context: checktoken()})
    }

    modificarDocumentoAdmision(criterio: any){
        return this.http.put(`${API_URL}/documentoAdmision`, criterio, { context: checktoken()})
    }


    // Servicios Tipo Profesión

    listarTipoProfesion(){
        return this.http.get(`${API_URL}/tipoProfesion`, { context: checktoken()})
    }

    adicionarTipoProfesion(criterio: any){
        return this.http.post(`${API_URL}/tipoProfesion`, criterio, { context: checktoken()})
    }

    modificarTipoProfesion(criterio: any, proid: number){
        return this.http.put(`${API_URL}/tipoProfesion/${proid}`, criterio, { context: checktoken()})
    }

    eliminarTipoProfesion(proid: number){
        return this.http.delete(`${API_URL}/tipoProfesion/${proid}`, { context: checktoken()})
    }

    // Servicios Tipo Educación

    listarTipoEducacion(){
        return this.http.get(`${API_URL}/tipoEducacion`, { context: checktoken()})
    }

    adicionarTipoEducacion(criterio: any){
        return this.http.post(`${API_URL}/tipoEducacion`, criterio, { context: checktoken()})
    }

    modificarTipoEducacion(criterio: any, eduid: number){
        return this.http.put(`${API_URL}/tipoEducacion/${eduid}`, criterio, { context: checktoken()})
    }

    eliminarTipoEducacion(eduid: number){
        return this.http.delete(`${API_URL}/tipoEducacion/${eduid}`, { context: checktoken()})
    }


    // Servicios Tipo Cargo

    listarTipoCargo(){
        return this.http.get(`${API_URL}/tipoCargo`, { context: checktoken()})
    }

    adicionarTipoCargo(criterio: any){
        return this.http.post(`${API_URL}/tipoCargo`, criterio, { context: checktoken()})
    }

    modificarTipoCargo(criterio: any, carid: number){
        return this.http.put(`${API_URL}/tipoCargo/${carid}`, criterio, { context: checktoken()})
    }

    eliminarTipoCargo(carid: number){
        return this.http.delete(`${API_URL}/tipoCargo/${carid}`, { context: checktoken()})
    }



    // Person's Services
    getPersons(): Observable<any> {
        return this.http.get(`${API_URL}/listarPersona`, { context: checktoken() });
    }

    managePerson(criterio: any){
        return this.http.post(`${API_URL}/managePerson`, criterio, { context: checktoken() });
    }

    deletePerson(criterio: any){
        return this.http.post(`${API_URL}/eliminarPersona`, criterio, { context: checktoken()});
    }





    actualizarDatosPersonales(criterio: any){
        return this.http.post(`${API_URL}/actualizarDatosPersonales`, criterio);
    }

    registrarPersona(criterio: any){
        return this.http.post(`${API_URL}/registrarPersona`, criterio);
    }

    getUsuario(){
        return this.http.get(`${API_URL}/listaUsuarios`);
    }

    getRoles(){
        return this.http.get(`${API_URL}/tipoRol`);
    }

    crearRol(criterio: any){
        return this.http.post(`${API_URL}/crearRol`, criterio);
    }

    modificarRol(criterio: any){
        let registroModRol = new Rol();
        return this.http.post(`${API_URL}/modificarRol`, registroModRol);
    }

    eliminarRol(criterio: any){
        return this.http.post(`${API_URL}/eliminarRol`, criterio);
    }

    getTipoDocumento(){
      return this.http.get(`${API_URL}/tipoDocumento`)
    }

    getTipoEstadoCivil(){
      return this.http.get(`${API_URL}/tipoEstadoCivil`)
    }

    getTipoGenero(){
      return this.http.get(`${API_URL}/tipoGenero`)
    }

    getTipoPais(){
      return this.http.get(`${API_URL}/tipoPais`)
    }

    getTipoCiudad(){
      return this.http.get(`${API_URL}/tipoCiudad`)
    }


}
