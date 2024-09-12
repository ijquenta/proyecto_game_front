import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL, API_URL_PAGO_ARCHIVO } from 'src/environments/environment';
import { TokenService } from 'src/app/modules/service/core/token.service';
import { checktoken } from 'src/app/interceptors/token.interceptor';
import { ArchivosService } from '../util/archivos.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/modules/service/core/auth.service';
import { MessageService } from 'primeng/api';

const httpOptions = {
    responseType: 'arraybuffer' as 'json',
};

@Injectable({
    providedIn: 'root',
})
export class PagoService {
    usuario: any;
    constructor(
        private http: HttpClient,
        private tokenService: TokenService,
        private archivos: ArchivosService,
        private spinner: NgxSpinnerService,
        private authService: AuthService,
        private messageService: MessageService
    ) {}

    listarPago() {
        return this.http.get(`${API_URL}/listarPago`, {
            context: checktoken(),
        });
    }

    listarPagoCurso() {
        return this.http.get(`${API_URL}/listarPagoCurso`, { context: checktoken() });
    }

    listarPagoEstudiante(data) {
        return this.http.post(`${API_URL}/listarPagoEstudiante`, data, { context: checktoken() });
    }

    listarPagoEstudianteMateria(data) {
        return this.http.post(`${API_URL}/listarPagoEstudianteMateria`, data, { context: checktoken() });
    }

    listarPagoEstudiantesMateria(data) {
        return this.http.post(`${API_URL}/listarPagoEstudiantesMateria`, data, { context: checktoken(), });
    }

    managePayment(data) {
        return this.http.post(`${API_URL}/managePayment`, data, { context: checktoken(), });
    }

    insertarPago(data) {
        return this.http.post(`${API_URL}/insertarPago`, data, { context: checktoken(), });
    }

    modificarPago(data) {
        return this.http.post(`${API_URL}/modificarPago`, data, { context: checktoken(), });
    }

    asignarPagoInscripcion(data) {
        return this.http.post(`${API_URL}/asignarPagoInscripcion`, data, { context: checktoken(), });
    }

    asignarPagoMatricula(data) {
        return this.http.post(`${API_URL}/asignarPagoMatricula`, data, { context: checktoken(), });
    }

    obtenerUltimoPago() {
        return this.http.get(`${API_URL}/obtenerUltimoPago`, { context: checktoken(), });
    }

    getTipoPago() {
        return this.http.get(`${API_URL}/tipoPago`, { context: checktoken(), });
    }

    getFilePago(pagarchivo: any) {
        const nombreArchivo = pagarchivo;
        const nombreArchivoV2 = 'ArchivoPago';
        this.spinner.show();
        this.http
            .get(`${API_URL}/pago/download/${nombreArchivo}`, httpOptions)
            .subscribe({
                next: (data: any) => {
                    this.archivos.generateReportPDF(data, nombreArchivoV2);
                    this.spinner.hide();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Archivo de pago',
                        detail: 'Se obtuvo correctamente',
                    });
                },
                error: (error) => {
                    this.spinner.hide();
                    console.error(error);
                    this.messageService.add({
                        severity: 'warn',
                        summary: 'Archivo de pago',
                        detail: 'No se pudo obtener el archivo',
                    });
                },
            });
    }

    getPagoById(pagid: Number) {
        return this.http.get(`${API_URL}/getPagoById/${pagid}`, { context: checktoken(), });
    }

    getPagoArchivo(filename: string) {
        this.spinner.show();
        this.http
            .get(`${API_URL_PAGO_ARCHIVO}/${filename}`, httpOptions)
            .subscribe({
                next: (data: any) => {
                    this.spinner.hide();
                    this.archivos.generateReportPDF(data, filename);
                },
                error: (error) => {
                    this.spinner.hide();
                    console.error(error);
                    this.archivos.showToast();
                },
            });
    }

    manageAssignPayment(data) {
        return this.http.post(`${API_URL}/manageAssignPayment`, data, { context: checktoken(), });
    }

    rptPagoEstudianteMateria(data: any) {
        this.spinner.show();
        this.http.post(`${API_URL}/rptPagoEstudianteMateria`, data, httpOptions).subscribe({
                next: (data: any) => {
                    this.spinner.hide();
                    this.archivos.generateReportPDF(data, 'Reporte Pago');
                },
                error: (error) => {
                    this.spinner.hide();
                    console.error(error);
                    this.archivos.showToast();
                }
            });
    }

    generarComprobantePagoEstudiante(data: any) {
        this.spinner.show();
        this.http.post(`${API_URL}/generarComprobantePagoEstudiante`, data, httpOptions).subscribe({
                next: (data: any) => {
                    this.spinner.hide();
                    this.archivos.generateReportPDF(data, 'Reporte Pago Estudiante');
                },
                error: (error) => {
                    this.spinner.hide();
                    console.error(error);
                    this.archivos.showToast();
                }
            });
    }

    generarComprobantePagoMatricula(data: any) {
        this.spinner.show();
        this.http.post(`${API_URL}/generarComprobantePagoMatricula`, data, httpOptions).subscribe({
                next: (data: any) => {
                    this.spinner.hide();
                    this.archivos.generateReportPDF(data, 'Reporte Pago Matricula Estudiante');
                },
                error: (error) => {
                    this.spinner.hide();
                    console.error(error);
                    this.archivos.showToast();
                }
            });
    }
}
