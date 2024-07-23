import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../../api/product';
import { API_URL } from 'src/environments/environment';
import { Usuario } from '../../models/usuario';
import { Rol } from '../../models/rol';
import { TokenService } from 'src/app/modules/service/core/token.service';
import { checktoken } from 'src/app/interceptors/token.interceptor';
import { ArchivosService } from '../util/archivos.service';
import { NgxSpinnerService } from 'ngx-spinner';
const httpOptions = {
    responseType: 'arraybuffer' as 'json'
};
@Injectable({
    providedIn: 'root',
})
export class MaterialService {

    constructor(private http: HttpClient, private tokenService: TokenService, private archivos: ArchivosService, private spinner: NgxSpinnerService,) { }


    listarMaterial(){
        return this.http.get(`${API_URL}/listarMaterial`)
    }


    listarTexto(){
        return this.http.get(`${API_URL}/listarTexto`)
    }

    insertarTexto(data) {
        return this.http.post(`${API_URL}/insertarTexto`, data);
    }

    getFileTexto(pagarchivo: any) {
        const nombreArchivo = pagarchivo;
        const nombreArchivov2 = pagarchivo.replace('.pdf', '');
        this.spinner.show();
        this.http.get(`${API_URL}/texto/download/${nombreArchivo}`, httpOptions)
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

    listarMateriaTexto(){
        return this.http.get(`${API_URL}/listarMateriaTexto`)
    }

    insertarMateriaTexto(data) {
        return this.http.post(`${API_URL}/insertarMateriaTexto`, data);
    }

    modificarMateriaTexto(data) {
        return this.http.post(`${API_URL}/modificarMateriaTexto`, data);
    }



}
