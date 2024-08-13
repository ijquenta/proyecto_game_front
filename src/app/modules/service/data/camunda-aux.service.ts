import { API_URL } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CamundaAuxService {

  data:any;

  constructor(
    private http: HttpClient
  ) { }

  //funcion para iniciar el tramite
  startProcessDefinition(processDefinitionId: any, userId:string, businessKey: any){
    const params = {
      "link": `${processDefinitionId}/submit-form`,
      "payload": {
        "variables": {
          "startUserId": {
            "value": userId,
            "type": "String"
          },
        },
        "businessKey": businessKey
      }
    }
    this.http.post(`${API_URL}/process-definition`, params).subscribe((result: any) => {
      this.data = result
      console.log(`Proceso definido iniciad: ${this.data}`);
      return this.data
    })
  //   this.camunda.procesoDefinicion(params).subscribe((result: any) => {
  //     if(result){
  //       this.process = result
  //       this.listarProcesoInstancia()
  //     }else{
  //       console.log('No se puedo realizar la tarea')
  //     }
  //     console.log(this.process)
  // });
  }

  //funcion para obtener el proceso instanciado
  procesInstance(businessKey: any){
    const params = {
      "link": "",
      "payload": {
        "businessKey": businessKey
      }
    }
    this.http.post(`${API_URL}/process-instance`, params).subscribe((result: any) =>{
      this.data = result
      console.log(`Process Instance: ${this.data}`);
      return this.data
    })
    // this.camunda.postProcesoInstancia(params).subscribe((result: any) => {
    //   this.process_instance = result[0]
    //   this.listarTarea()
    // });
  }

  //funcion para listar todas las tareas mediante el proceso isntanciado
  listTask(processInstanceId: any){
    const params = {
      "link": `?processInstanceId=${processInstanceId}`
    }
    return this.http.get(`${API_URL}/task`, { params: params } )
    // .subscribe(
    //   (result: any) => {
    //     this.data = result
    //     console.log('Task', this.data);
    //     return this.data
    //   }
    // )


    // this.camunda.getTask(params).subscribe((result: any) => {
    //   this.task = result[0]
    //   this.anclar()
    // });
  }

  //funcion para anclarse a la tarea
  claim(taskId: any, userId: string){
    const params = {
      "link": `${taskId}/claim`,
      "payload": {
        "userId": userId
      }
    }
    return this.http.post(`${API_URL}/task`, params)
    // .subscribe(
    //   (result: any) =>{
    //     this.data = result
    //     console.log(`Claim: ${this.data}`);
    //     return this.data
    //   }
    // )

    // this.camunda.postTask(params).subscribe((result: any) => {
    //   if(!this.boolTask){
    //     this.completarSolicitud()
    //   }else{
    //     this.ref.close(true);
    //   }
    // });
  }

  submitFormTask(taskId: any, payload:any):Observable<any>{
    const params = {
      "link": `${taskId}/submit-form`,
      "payload": payload
    }
    console.log(params);
    return this.http.post(`${API_URL}/task`, params )
  }

}
