import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from 'src/environments/environment';
import { checktoken } from 'src/app/interceptors/token.interceptor';
import { ArchivosService } from '../util/archivos.service';
import { NgxSpinnerService } from 'ngx-spinner';

const httpOptions = {
    responseType: 'arraybuffer' as 'json',
};

@Injectable({
    providedIn: 'root',
})
export class MaterialService {
    constructor(
        private http: HttpClient,
        private archivos: ArchivosService,
        private spinner: NgxSpinnerService
    ) {}

    listarMaterial() {
        return this.http.get(`${API_URL}/listarMaterial`, { context: checktoken(), });
    }

    listarTexto() {
        return this.http.get(`${API_URL}/listarTexto`, { context: checktoken(), });
    }

    insertarTexto(data) {
        return this.http.post(`${API_URL}/insertarTexto`, data, { context: checktoken(), });
    }

    getFileTexto(textdocumento: any) {
        const nombreArchivo = textdocumento;
        const nombreArchivov2 = textdocumento.replace('.pdf', '');
        this.spinner.show();
        this.http
            .get(`${API_URL}/texto/download/${nombreArchivo}`, httpOptions)
            .subscribe({
                next: (data: any) => {
                    this.spinner.hide();
                    this.archivos.generateReportPDF(data, nombreArchivov2);
                },
                error: (error) => {
                    this.spinner.hide();
                    console.error(error);
                    this.archivos.showToast();
                },
            });
    }

    // Rutas para Texto
    getTextos() {
        return this.http.get(`${API_URL}/getTextos`, { context: checktoken() });
    }

    createTexto(data: any) {
        return this.http.post(`${API_URL}/createTexto`, data, { context: checktoken(), });
    }

    updateTexto(id: number, data: any) {
        return this.http.put(`${API_URL}/updateTexto/${id}`, data, { context: checktoken(), });
    }

    deleteTexto(id: number) {
        return this.http.delete(`${API_URL}/deleteTexto/${id}`, { context: checktoken(), });
    }

    // Rutas para TipoTexto
    getTipoTexto() {
        return this.http.get(`${API_URL}/getTipoTextos`, { context: checktoken() });
    }

    createTipoTexto(data: any) {
        return this.http.post(`${API_URL}/createTipoTexto`, data, { context: checktoken(), });
    }

    updateTipoTexto(id: number, data: any) {
        return this.http.put(`${API_URL}/updateTipoTexto/${id}`, data, { context: checktoken(), });
    }

    deleteTipoTexto(id: number) {
        return this.http.delete(`${API_URL}/deleteTipoTexto/${id}`, { context: checktoken(), });
    }

    // Rutas para TipoIdiomaTexto
    getTipoIdiomaTexto() {
        return this.http.get(`${API_URL}/getTipoIdiomaTextos`, { context: checktoken(), });
    }

    createTipoIdiomaTexto(data: any) {
        return this.http.post(`${API_URL}/createTipoIdiomaTexto`, data, { context: checktoken(), });
    }

    updateTipoIdiomaTexto(id: number, data: any) {
        return this.http.put(`${API_URL}/updateTipoIdiomaTexto/${id}`, data, { context: checktoken(), });
    }

    deleteTipoIdiomaTexto(id: number) {
        return this.http.delete(`${API_URL}/deleteTipoIdiomaTexto/${id}`, { context: checktoken(), });
    }

    // Rutas para TipoCategoriaTexto
    getTipoCategoriaTexto() {
        return this.http.get(`${API_URL}/getTipoCategoriaTextos`, { context: checktoken(), });
    }

    createTipoCategoriaTexto(data: any) {
        return this.http.post(`${API_URL}/createTipoCategoriaTexto`, data, { context: checktoken(), });
    }

    updateTipoCategoriaTexto(id: number, data: any) {
        return this.http.put(`${API_URL}/updateTipoCategoriaTexto/${id}`, data, { context: checktoken() } );
    }

    deleteTipoCategoriaTexto(id: number) {
        return this.http.delete(`${API_URL}/deleteTipoCategoriaTexto/${id}`, { context: checktoken(), });
    }

    // Rutas para TipoExtensionTexto
    getTipoExtensionTexto() {
        return this.http.get(`${API_URL}/getTipoExtensionTextos`, { context: checktoken(), });
    }

    createTipoExtensionTexto(data: any) {
        return this.http.post(`${API_URL}/createTipoExtensionTexto`, data, { context: checktoken(), });
    }

    updateTipoExtensionTexto(id: number, data: any) {
        return this.http.put(`${API_URL}/updateTipoExtensionTexto/${id}`, data, { context: checktoken() } );
    }

    deleteTipoExtensionTexto(id: number) {
        return this.http.delete(`${API_URL}/deleteTipoExtensionTexto/${id}`, { context: checktoken(), });
    }

    // Rutas para MateriaTexto
    getMateriaTexto() {
        return this.http.get(`${API_URL}/getMateriaTextos`, { context: checktoken(), });
    }

    createMateriaTexto(data: any) {
        return this.http.post(`${API_URL}/createMateriaTexto`, data, { context: checktoken(), });
    }

    updateMateriaTexto(mattexid: number, data: any) {
        return this.http.put(`${API_URL}/updateMateriaTexto/${mattexid}`, data, { context: checktoken(), } );
    }

    deleteMateriaTexto(mattexid: number) {
        return this.http.delete(`${API_URL}/deleteMateriaTexto/${mattexid}`, { context: checktoken(), });
    }

    getTextoCombo() {
        return this.http.get(`${API_URL}/getListTextoCombo`, { context: checktoken(), });
    }

    getMateriaCombo() {
        return this.http.get(`${API_URL}/getListMateriaCombo`, { context: checktoken(), });
    }

    getMateriaTextoEstudiante(peridestudiante: number) {
        return this.http.get(`${API_URL}/getMateriaTextosEstudiante/${peridestudiante}`, { context: checktoken(), });
    }
}
