import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SolicitanteService {
  constructor(private http: HttpClient ) { }

  //POST
  obtenerDatosPersonal(criterio:any) {
    console.log(criterio)
    return this.http.post(`${API_URL}/personal-data`, criterio);
  }

}
