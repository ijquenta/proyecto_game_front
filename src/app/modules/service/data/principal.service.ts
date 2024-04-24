import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../../api/product';
import { API_URL } from 'src/environments/environment';
import { Usuario } from '../../models/usuario';
import { Rol } from '../../models/rol';
import { TokenService } from 'src/app/services/token.service';
import { checktoken } from 'src/app/interceptors/token.interceptor';
import { ArchivosService } from '../util/archivos.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/services/auth.service';
const httpOptions = {
    responseType: 'arraybuffer' as 'json'
};
@Injectable({
    providedIn: 'root',
})
export class PrincipalService {
    usuario: any;
    constructor(private http: HttpClient,
                private tokenService: TokenService,
                private archivos: ArchivosService,
                private spinner: NgxSpinnerService,
                private authService: AuthService) { }


    listarCursoMateriaContabilidad(data) {
        return this.http.post(`${API_URL}/listarCursoMateriaContabilidad`, data);
    }

    rptCursoMateriaContabilidad(fecini:any, fecfin:any, descuento: any[], resumen:any[]) {
        // console.log(data);
        this.usuario = this.authService.usuario$.getValue();
        // const curmatid = data.curmatid;
        // const criterio = {
        //     curmatid: curmatid,
        //     usuname: this.usuario?.[0]?.usuname
        // };

        const criterio = {
            fecini: fecini,
            fecfin: fecfin,
            descuentos: descuento,
            resumen: resumen
        }

        // if (!criterio.usuname) {
        //     console.error('No se pudo obtener la información del usuario.');
        //     return;
        // }

        console.log("rpt", criterio)
        this.spinner.show();
        this.http.post(`${API_URL}/rptCursoMateriaContabilidad`, criterio, httpOptions)
            .subscribe(
                (data: any) => {
                    this.spinner.hide();
                    this.archivos.generateReportPDF(data, 'Reporte Curso Materia Contabilidad');
                },
                (error) => {
                    this.spinner.hide();
                    console.error(error);
                    this.archivos.showToast();
                }
            );
    }
















    // Otros

    listarPago(){
        return this.http.get(`${API_URL}/listarPago`)
    }

    listarPagoCurso(){
        return this.http.get(`${API_URL}/listarPagoCurso`)
    }

    listarPagoEstudiante(data) {
        return this.http.post(`${API_URL}/listarPagoEstudiante`, data);
    }

    listarPagoEstudianteMateria(data) {
        return this.http.post(`${API_URL}/listarPagoEstudianteMateria`, data);
    }

    listarPagoEstudiantesMateria(data) {
        return this.http.post(`${API_URL}/listarPagoEstudiantesMateria`, data);
    }

    gestionarPago(data) {
        return this.http.post(`${API_URL}/gestionarPago`, data);
    }

    insertarPago(data) {
        return this.http.post(`${API_URL}/insertarPago`, data);
    }

    modificarPago(data) {
        return this.http.post(`${API_URL}/modificarPago`, data);
    }

    asignarPagoInscripcion(data) {
        return this.http.post(`${API_URL}/asignarPagoInscripcion`, data);
    }

    obtenerUltimoPago(){
        return this.http.get(`${API_URL}/obtenerUltimoPago`);
    }

    getTipoPago(){
        return this.http.get(`${API_URL}/tipoPago`);
    }

    getFilePago(pagarchivo: any) {
        const nombreArchivo = pagarchivo;
        const nombreArchivov2 = pagarchivo.replace('.pdf', '');
        this.spinner.show();
        console.log(this.spinner);
        this.http.get(`${API_URL}/pago/download/${nombreArchivo}`, httpOptions)
        .subscribe(
            (data: any) => {
            this.spinner.hide();
            this.archivos.generateReportPDF(data, nombreArchivov2);
            },
            (error) => {
            this.spinner.hide();
            console.error(error);
            this.archivos.showToast();
            }
        );

    }

    listarCantidades() {
        return this.http.get(`${API_URL}/listarCantidades`);
    }

    listarEstudiantesMateria() {
        return this.http.get(`${API_URL}/listarEstudiantesMateria`);
    }

    listarEstudiantesNivel() {
        return this.http.get(`${API_URL}/listarEstudiantesNivel`);
    }



}
