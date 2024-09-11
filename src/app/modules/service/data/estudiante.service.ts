import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from 'src/environments/environment';
import { checktoken } from 'src/app/interceptors/token.interceptor';
import { TokenService } from 'src/app/modules/service/core/token.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ArchivosService } from '../util/archivos.service';
import { AuthService } from 'src/app/modules/service/core/auth.service';
import { Usuario } from 'src/app/modules/models/usuario';

const httpOptions = {
    responseType: 'arraybuffer' as 'json',
};

@Injectable({
    providedIn: 'root',
})

export class EstudianteService {
    usuario: Usuario;
    constructor(
        private http: HttpClient,
        private tokenService: TokenService,
        private spinner: NgxSpinnerService,
        private archivos: ArchivosService,
        private authService: AuthService
    ) {}

    obtenerMateriasInscritas(criterio: any) {
        return this.http.post(`${API_URL}/obtenerMateriasInscritas`, criterio);
    }

    listarEstudiante() {
        return this.http.get(`${API_URL}/listarEstudiante`);
    }

    rptCursoMateriaEstudiante(data: any) {
        this.spinner.show();
        this.http.post(`${API_URL}/rptCursoMateriaEstudiante`, data, httpOptions).subscribe({
            next: (data: any) => {
                this.spinner.hide();
                this.archivos.generateReportPDF(
                    data,
                    'Reporte Curso Materia Estudiante'
                );
            },
            error: (error) => {
                this.spinner.hide();
                console.error(error);
                this.archivos.showToast();
            }
        });
    }
}
