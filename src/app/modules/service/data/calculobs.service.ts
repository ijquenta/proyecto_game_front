import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from 'src/environments/environment';

import { DialogService } from 'primeng/dynamicdialog';
import { BehaviorSubject, forkJoin, share } from 'rxjs';
import { FormCalculoBSComponent } from 'src/app/components/adm-calculobs/form-calculobs/form-calculobs.component';
import { DiccionarioService } from './diccionario.service';
import { SharedService } from './shared.service';

//Ivan
import { AdmCalculobsService } from './adm-calculobs.service';
import { FormCalculoBSModComponent } from 'src/app/components/adm-calculobs/form-calculobs-mod/form-calculobs-mod.component';
import { RegistroCalculoBS } from 'src/app/models/registro-calculobs';
import { RegistroPersona } from 'src/app/models/registro-calculobs-persona';
import { FormDeduccionComponent } from 'src/app/components/adm-calculobs/deduccion/form-deduccion/form-deduccion.component';

@Injectable({
  providedIn: 'root'
})
export class BenSocialService {

  private confirm: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient,
              private sharedService: SharedService,
              private dialogService: DialogService, 
              private diccionario: DiccionarioService,
              private admCalculobsService: AdmCalculobsService
              ) { }
  errors: any;
  getData(registroCalculoBS: any){
    console.log("getData->",registroCalculoBS);
    this.confirmDialogObsData = false;
    const bodyTM = {"codTipoMotivo": ''}
    forkJoin(
      this.admCalculobsService.listarTipoMotivo(bodyTM),
      this.admCalculobsService.listarDesignaciones(registroCalculoBS),
    ).subscribe(
      (result: any) => {
        this.sharedService.tipoMotivo = result[0];
        this.sharedService.listaDesignaciones = result[1];
        this.setDataForm(registroCalculoBS);      
      }
      ,error => {
        this.errors = error;
        console.log("error",error);
        }
      )
  }
  getData2(dataModificar: any){
    // console.log("getData2->",dataModificar);
    this.confirmDialogObsData = false;
    // const body = {"idGestion": idGestion, "idMes":idMes, "idPartida": idPartida}
    const bodyTM = {"codTipoMotivo": ''}
    forkJoin(
      this.admCalculobsService.listarTipoMotivo(bodyTM),
      // this.diccionario.obtenerDatosModificar(body)
      // this.diccionario.getApertura(body), 
      // this.diccionario.getNivel(body),
      // this.diccionario.getAutoridad(body),
      // this.diccionario.getTipoAutoridad(body),
      // this.diccionario.getTipoModificacion(),
      // this.diccionario.getMesesRecuperados(body),
      // this.diccionario.getTipoEstudio(body)
    ).subscribe(
      (result: any) => {
        this.sharedService.tipoMotivo = result[0];
        // this.sharedService.cargos = "A";
        // this.sharedService.aperturas = result[1];
        // this.sharedService.niveles = result[2];
        // this.sharedService.autoridades = result[3];
        // this.sharedService.tipoAutoridades = result[4];
        // this.sharedService.tipoModificacion = result[5];
        // this.sharedService.meses = result[6];
        // this.sharedService.tipoEstudio = result[7];
        // console.log(this.sharedService)
        this.setDataForm2(dataModificar);    
      }
    )
    
  }
  getDataDeduccion(registroDeduccion: any){
    // console.log("getData->",registroCalculoBS);
    this.confirmDialogObsData = false;
    const bodyTM = { "ano": registroDeduccion.ano, "mes": registroDeduccion.mes, "codDocente": registroDeduccion.codDocente,"nroLiquidacion": registroDeduccion.nroLiquidacion }
    forkJoin(
        this.admCalculobsService.listarTipoDeduccionDocente(bodyTM),
       // this.admCalculobsService.obtenerSaldoDeduccionDocente(bodyTM)
    ).subscribe(
      (result: any) => {
        this.sharedService.tipoDeduccion = result[0];
      //  this.sharedService.saldo = result[1];
        this.setDataFormDeduccion(registroDeduccion);      
      }
    ) 
  }
  get confirmDialogObs(){
    return this.confirm.asObservable();
  }
  setDataFormDeduccion(registroDeduccion: any){
    console.log("setDataForm->", registroDeduccion)
    const ref = this.dialogService.open(FormDeduccionComponent, {
      data: registroDeduccion,
      header: 'Registrar Deduccion',
      width: '60%'
    });
    ref.onClose.subscribe((result: any) => {
      if (result)
        this.confirmDialogObsData = result;
    });
  }

  set confirmDialogObsData(result: boolean){
    this.confirm.next(result);
  }
  setDataForm(registroCalculoBS: any){
    // console.log("setDataForm->", registroCalculoBS)
    if(registroCalculoBS.tform){
      const ref = this.dialogService.open(FormCalculoBSComponent, {
        data: registroCalculoBS,
        header: 'Registro Nuevo',
        width: '75%'
      });
      ref.onClose.subscribe((result: any) => {
        if (result)
          this.confirmDialogObsData = result;
      });
    }
    else {
      const ref = this.dialogService.open(FormCalculoBSComponent, {
        data: registroCalculoBS,
        header: 'Modificar Registro',
        width: '75%'
      });
      ref.onClose.subscribe((result: any) => {
        if (result)
          this.confirmDialogObsData = result;
      });
    }
    
  }
  setDataForm2(dataModificar: any){
    // console.log("setDataForm2->", dataModificar)
    const ref = this.dialogService.open(FormCalculoBSModComponent, {
      data: dataModificar,
      header: 'Modificar Registro',
      width: '90%'
    });
    ref.onClose.subscribe((result: any) => {
      if (result)
        this.confirmDialogObsData = result;
    });
  }



  // form.ts

}