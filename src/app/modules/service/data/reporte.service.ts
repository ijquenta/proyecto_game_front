import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ArchivosService } from '../util/archivos.service';

const httpOptions = {
    responseType: 'arraybuffer' as 'json'
};

@Injectable()
export class ReporteService {
    constructor(
        private http: HttpClient,
        private spinner: NgxSpinnerService,
        private archivos: ArchivosService
    ) {}

    rptUsuarios() {
        this.spinner.show();
        return this.http
            .post(`${API_URL}/rptTotalesSigma`, {}, httpOptions)
            .subscribe(
                (data: any) => {
                    this.spinner.hide();
                    this.archivos.generateReportPDF(data, `Reporte Usuarios`);
                },
                (error) => {
                    this.spinner.hide();
                    console.log(error);
                    this.archivos.showToast();
                }
            );
    }
}
