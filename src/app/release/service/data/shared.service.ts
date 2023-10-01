import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RolProceso } from 'src/app/release/models/rol';
import { Proceso, Solicitante, Estamento } from 'src/app/release/models/diccionario';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  procesos: Proceso[] = [];
  solicitante!: Solicitante;
  estamento: Estamento[] = [];

  private confirmDialog: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private sharingIdRolnObs: BehaviorSubject<number> = new BehaviorSubject<number>(1);
  private sharingRolProcesoObs: BehaviorSubject<RolProceso> = new BehaviorSubject<RolProceso>(new RolProceso());
  constructor() {}

  get idRolObs(){
    return this.sharingIdRolnObs.asObservable();
  }
  set idRolObsData(idRol: number){
    this.sharingIdRolnObs.next(idRol);
  }
  get rolProcesoObs(){
    return this.sharingRolProcesoObs.asObservable();
  }
  set rolProcesoObsData(rolProceso: RolProceso){
    this.sharingRolProcesoObs.next(rolProceso);
  }

  get confirmDialogObs(){
    return this.confirmDialog.asObservable();
  }
  set confirmDialogObsData(visible: boolean){
    this.confirmDialog.next(visible);
  }
}
