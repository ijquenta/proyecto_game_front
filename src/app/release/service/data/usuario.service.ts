import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../../api/product';
import { API_URL } from 'src/environments/environment';
import { Usuario } from '../../models/usuario';

@Injectable()
export class UsuarioService {

    constructor(private http: HttpClient) { }

    // getUsuario() {
    //     console.log("GetUsuario");
    //     return this.http.get<any>(`${API_URL}/listaUsuarios`)
    //         .toPromise()
    //         .then(res => res.data as Usuario[])
    //         .then(data => data)
    // }

    getUsuario(){
        console.log("GetUsuario");
        return this.http.get(`${API_URL}/listaUsuarios`);
    }
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
}
