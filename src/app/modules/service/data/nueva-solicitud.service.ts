import { Injectable } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { FormSolicitudComponent } from 'src/app/release/components/solicitud/tramite/form-solicitud/form-solicitud.component';
import { CamundaService } from './camunda.service';
import { SolicitanteService } from './solicitante.service';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root'
})
export class NuevaSolicitudService {

  private confirm: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor(
    private sharedService: SharedService,
    private dialogService: DialogService, 
    private camunda: CamundaService,
    private solicitante: SolicitanteService) { }

  get confirmDialogObs(){
    return this.confirm.asObservable();
  }
  set confirmDialogObsData(result: boolean){
    this.confirm.next(result);
  }

  getData(dataMensual: any){
    this.confirmDialogObsData = false;
    const body = {
      "nroCi": dataMensual.ci,
      "nomCompleto": dataMensual.nombreCompleto
    }
    console.log(body)
    forkJoin(
      this.camunda.listarProceso({}),
      this.solicitante.obtenerDatosPersonal(body)
    ).subscribe(
      (result: any) => {
        console.log("Resultado ver", result)
        this.sharedService.procesos = result[0];
        this.sharedService.solicitante = result[1];
        this.setDataForm(dataMensual);
      }
    )
  }

  setDataForm(data: any){
    const ref = this.dialogService.open(FormSolicitudComponent, {
      data: data,
      header: 'Nuevo Tramite',
      width: '90%'
    });
    ref.onClose.subscribe((result: any) => {
      if (result)
        this.confirmDialogObsData = result;
        console.log("this.confirmDialogObsData--->",result)
    });
  }
}
