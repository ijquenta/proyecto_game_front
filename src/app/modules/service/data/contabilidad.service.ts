import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from 'src/environments/environment';
import { checktoken } from 'src/app/interceptors/token.interceptor';
import { ArchivosService } from '../util/archivos.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/modules/service/core/auth.service';

const httpOptions = {
    responseType: 'arraybuffer' as 'json'
};

@Injectable({
    providedIn: 'root',
})
export class ContabilidadService {
    usuario: any;
    constructor(
        private http: HttpClient,
        private archivos: ArchivosService,
        private spinner: NgxSpinnerService,
        private authService: AuthService
    ) { }

    listarCursoMateriaContabilidad(data) {
        return this.http.post(`${API_URL}/listarCursoMateriaContabilidad`, data);
    }

    rptCursoMateriaContabilidad(fecini:any, fecfin:any, descuento: any[], resumen:any[]) {
        this.usuario = this.authService.usuario$.getValue();

        const criterio = {
            fecini: fecini,
            fecfin: fecfin,
            descuentos: descuento,
            resumen: resumen
        }

        this.spinner.show();
        this.http.post(`${API_URL}/rptCursoMateriaContabilidad`, criterio, httpOptions).subscribe({
            next: (data: any) => {
                this.spinner.hide();
                this.archivos.generateReportPDF(data, 'Reporte Curso Materia Contabilidad');
            },
            error: (error) => {
                this.spinner.hide();
                console.error(error);
                this.archivos.showToast();
            }
        });
    }
}
