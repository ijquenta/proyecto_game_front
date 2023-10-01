import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CamundaService {
  constructor(private http: HttpClient ) { }

  // GET
  listarProceso(criterio:any) {
    //console.log(criterio)
    return this.http.get(`${API_URL}/proceso`, { params: criterio });
  }

  getTask(criterio:any) {
   // console.log(criterio)
    return this.http.get(`${API_URL}/task`, { params: criterio } );
  }

  getProcessInstance(criterio:any) {
    //console.log(criterio)
    return this.http.get(`${API_URL}/process-instance`, { params: criterio } );
  }

  getHistory(criterio:any){
   // console.log(criterio)
    return this.http.get(`${API_URL}/history`, { params: criterio } );
  }

  getFilter(criterio:any){
    console.log(criterio)
    return this.http.get(`${API_URL}/filter`, { params: criterio } );
  }


  //POST
  iniciarProceso(criterio:any) {
   // console.log(criterio)
    return this.http.post(`${API_URL}/proceso`, criterio);
  }

  procesoDefinicion(criterio:any) {
  //  console.log(criterio)
    return this.http.post(`${API_URL}/process-definition`, criterio );
  }


  postProcesoInstancia(criterio:any) {
   // console.log(criterio)
    return this.http.post(`${API_URL}/process-instance`, criterio );
  }

  completarSolicitud(criterio:any) {
   // console.log(criterio)
    return this.http.post(`${API_URL}/submit-form`, criterio );
  }

  postTask(criterio:any) {
   // console.log(criterio)
    return this.http.post(`${API_URL}/task`, criterio );
  }

  postFilter(criterio:any){
    // console.log(criterio)
    return this.http.post(`${API_URL}/filter`, criterio );
  }

}
