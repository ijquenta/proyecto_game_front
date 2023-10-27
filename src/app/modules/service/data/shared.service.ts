import { TipoRol } from './../../models/diccionario';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
// import { FasePlanilla } from 'src/app/models/fase';
import { Apertura, Autoridad, Cargo, Mes, Nivel, TipoAutoridad, TipoDeduccion, TipoEstudio, TipoModificacion, TipoMotivo, TipoCurso } from 'src/app/modules/models/diccionario';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  cargos: Cargo[]  = [];
  niveles: Nivel[] = [];
  aperturas: Apertura[] = [];
  autoridades: Autoridad[] = [];
  tipoAutoridades: TipoAutoridad[] = [];
  tipoModificacion: TipoModificacion[] = [];
  tipoEstudio: TipoEstudio[] = [];
  meses: Mes[] = [];
  tipoMotivo: TipoMotivo[] = [];
  listaDesignaciones: any;
  tipoCurso: TipoCurso[] = [];
  TipoRol: TipoRol[] = [];

  // Deducciones
  tipoDeduccion: TipoDeduccion[] = []

  private confirmDialog: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  // private sharingIdGestionObs: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private sharingCargosObs: BehaviorSubject<Cargo[]> = new BehaviorSubject<Cargo[] >([]);





  private sharingIdGestionObs: BehaviorSubject<number> = new BehaviorSubject<number>(0);
//   private sharingFasePlanillaObs: BehaviorSubject<FasePlanilla> = new BehaviorSubject<FasePlanilla>(new FasePlanilla());
  constructor() {}
  get idGestionObs(){
    return this.sharingIdGestionObs.asObservable();
  }
  set idGestionObsData(idGestion: number){
    this.sharingIdGestionObs.next(idGestion);
  }

//   get fasePlanillaObs(){
//     return this.sharingFasePlanillaObs.asObservable();
//   }
//   set fasePlanillaObsData(fase: FasePlanilla){
//     this.sharingFasePlanillaObs.next(fase);
//   }

  get confirmDialogObs(){
    return this.confirmDialog.asObservable();
  }
  set confirmDialogObsData(visible: boolean){
    this.confirmDialog.next(visible);
  }
}
