import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DiccionarioService {

  constructor(private http: HttpClient ) { }
  searchPersona(criterio:any) {
    return this.http.post(`${API_URL}/searchPerson`, criterio);
  }

  getTipoMateria(criterio: any){
    return this.http.post(`${API_URL}/listaMateriaCombo`, criterio);
  }
  getListaPersonaDocenteCombo(criterio: any){
    // console.log("Get Persona: ", criterio)
    return this.http.post(`${API_URL}/listaPersonaDocenteCombo`, criterio);
  }

  getMesesDisponibles(criterio:any) {
    return this.http.post(`${API_URL}/mes`, criterio);
  }
  getMesesRecuperados(criterio:any) {
    return this.http.put(`${API_URL}/mes`, criterio);
  }
  obtenerDatosModificar(criterio: any){
    return this.http.post(`${API_URL}/obtenerDatosModificar`, criterio);
  }

  // getCargo(criterio:any) {
  //   return this.http.post(`${API_URL}/cargo`, criterio);
  // }
  // getNivel(criterio:any) {
  //   return this.http.post(`${API_URL}/nivel`, criterio);
  // }
  // getApertura(criterio:any) {
  //   return this.http.post(`${API_URL}/apertura`, criterio);
  // }
  // getTipoEstudio(criterio:any) {
  //   return this.http.post(`${API_URL}/tipoEstudio`, criterio);
  // }
  // getTipoAportante(criterio:any) {
  //   return this.http.post(`${API_URL}/tipoAportante`, criterio);
  // }
  // getTipoEntidadAfp() {
  //   return this.http.get(`${API_URL}/tipoEntidad`);
  // }

  // getTipoAutoridad(criterio:any) {
  //   return this.http.post(`${API_URL}/tipoAutoridad`, criterio);
  // }
  // getAutoridad(criterio:any) {
  //   return this.http.post(`${API_URL}/autoridad`, criterio);
  // }
  // getTipoModificacion() {
  //   return this.http.get(`${API_URL}/tipoModificacion`);
  // }
}
