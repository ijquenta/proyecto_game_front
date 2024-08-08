import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { Product } from '../../api/product';
import { API_URL } from 'src/environments/environment';

import { Usuario } from '../../models/usuario';
import { NgxSpinnerService } from 'ngx-spinner';
import { ArchivosService } from '../util/archivos.service';

const httpOptions = {
    responseType: 'arraybuffer' as 'json'
};

@Injectable()
export class ReporteService {

    constructor(private http: HttpClient, private spinner: NgxSpinnerService, private archivos: ArchivosService) { }

    // getUsuario() {
    //     return this.http.get<any>(`${API_URL}/listaUsuarios`)
    //         .toPromise()
    //         .then(res => res.data as Usuario[])
    //         .then(data => data)
    // }

    // getUsuario(){
    //     return this.http.get(`${API_URL}/listaUsuarios`);
    // }
    // getProductsSmall() {
    //     return this.http.get<any>('assets/release/data/products-small.json')
    //         .toPromise()
    //         .then(res => res.data as Product[])
    //         .then(data => data);
    // }

    // getProducts() {
    //     return this.http.get<any>('assets/release/data/products.json')
    //         .toPromise()
    //         .then(res => res.data as Product[])
    //         .then(data => data);
    // }

    // getProductsMixed() {
    //     return this.http.get<any>('assets/release/data/products-mixed.json')
    //         .toPromise()
    //         .then(res => res.data as Product[])
    //         .then(data => data);
    // }

    // getProductsWithOrdersSmall() {
    //     return this.http.get<any>('assets/release/data/products-orders-small.json')
    //         .toPromise()
    //         .then(res => res.data as Product[])
    //         .then(data => data);
    // }

    rptUsuarios() {

        this.spinner.show();
        return this.http.post(`${API_URL}/rptTotalesSigma`, {}, httpOptions).subscribe(
          (data: any) => {
            this.spinner.hide();
            this.archivos.generateReportPDF(data, `Reporte Usuarios`);
          },
          (error) => {
            this.spinner.hide();
            console.log(error);
            this.archivos.showToast();
          }
        )
      }
}
