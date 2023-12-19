import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AutoComplete } from 'primeng/autocomplete';
import { Table } from 'primeng/table';
import { Observable, forkJoin } from 'rxjs';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ReporteService } from 'src/app/modules/service/data/reporte.service';

import { NotaService } from 'src/app/modules/service/data/nota.service';
import { AuthService } from 'src/app/services/auth.service';
import { Nota } from 'src/app/modules/models/nota';
import { Inscripcion } from 'src/app/modules/models/inscripcion';
import { Usuario } from 'src/app/modules/models/usuario';
import { Pago } from 'src/app/modules/models/pago';
import { PagoService } from 'src/app/modules/service/data/pago.service';
import { CursoMateria } from 'src/app/modules/models/curso';
@Component({
  templateUrl: './pago-crud.component.html'
})

export class PagoCrudComponent implements OnInit {

  @ViewChild('dtexc') dtexc: Table | undefined;
  @ViewChild('autocomplete') autocomplete:AutoComplete | undefined;

  criterio: any = '';
  loading: boolean = false;
  loading2: boolean = false;
  listarMateriasInscritas: CursoMateria[] = [];
  listarNotaEstudianteMateria: Pago[] = [];
  notaEstudiante = new Inscripcion();
  notaEstudianteMateria = new Nota();
  verNotasClicked: boolean = false;
  errors: any;
  usuario: Usuario;
  verMateriaClicked: boolean = false;
  pago = new Pago();
  optionPago: boolean = false;
  pagoRegistroDialog: boolean = false;
  curid: any;
  matid: any;
  TipoPago: Pago[] = [];
  tipoPagoSeleccionado = new Pago();
  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private dialogService: DialogService,
    private reporteService: ReporteService,
    private notaService: NotaService,
    private authService: AuthService,
    private pagoService: PagoService
    ) {
    }
    ngOnInit(): void {


        this.verMateriaClicked = true;
        this.loading = true;
        this.authService.usuario$.subscribe((user => {
            if (user && Array.isArray(user) && user.length > 0) {
                this.usuario = user[0];
                this.pagoService.listarPagoCurso().subscribe(
                    (result: any) => {
                        this.listarMateriasInscritas = result as CursoMateria[];
                        console.log(this.listarMateriasInscritas)
                        this.loading = false;
                        this.messageService.add({severity: 'info', summary: 'Correcto', detail: 'Información obtenida'});
                    },
                    error => {
                        this.errors = error;
                        console.log("error", error);
                        this.messageService.add({severity: 'warn', summary: 'Error', detail: 'Algo salió mal!'});
                    }
                );
            }
        }));
    }

  listarNotaMateria(data: Nota){
    this.loading2 = true;
    this.verNotasClicked = true;
    this.curid = data.curid;
    this.matid = data.matid;
    const criterio = {
        curid: data.curid,
        matid: data.matid
    }
    this.pagoService.listarPagoEstudiantesMateria(criterio).subscribe((result: any) => {
        this.listarNotaEstudianteMateria = result as Pago[];
        console.log(this.listarNotaEstudianteMateria)
        this.loading2 = false;
      this.messageService.add({severity:'info', summary:'Correcto', detail:'Información obtenida'});
    },
    error => {
      this.errors = error;
      console.log("error",error);
      this.messageService.add({severity:'warn', summary:'Error', detail:'Algo salio mal!'});
    });
  }
  getSeverityColor(pagestado: number): string {
    switch (pagestado) {
      case 1:
        return 'success'; // Color para pagado
      case 2:
        return 'warning'; // Color para pendiente
      case 3:
        return 'danger';  // Color para sin pagar
      default:
        return 'info';    // Puedes ajustar este valor por defecto según tus necesidades
    }
  }
  getText(pagestado: number): string {
    switch (pagestado) {
      case 1:
        return 'Pagado'; // Color para pagado
      case 2:
        return 'Falta Pagar'; // Color para pendiente
      case 3:
        return 'Pendiente';  // Color para sin pagar
      default:
        return 'Sin pagar';    // Puedes ajustar este valor por defecto según tus necesidades
    }
  }
  addNota(data: any) {
    this.pago = { ...data }
    console.log(this.pago)
    this.optionPago = true;
    this.pagoRegistroDialog = true;
  }
  updateNota(data: Pago) {
     this.pago = { ...data };
     console.log(this.pago);
     this.optionPago = false;
     this.pagoRegistroDialog = true;
  }
  hideDialog(){
    this.pagoRegistroDialog = false;
  }
  registrarPago() {
    if (this.optionPago) {
        this.pago.tipo = 1;
        this.pago.pagid = null
        this.pago.pagrusureg = 'ijquenta';
        this.pagoService.gestionarPago(this.pago).subscribe((result: any) => {
            this.pagoRegistroDialog = false;
            this.pago = new Pago();
            // const criterio = {
            //     curid: this.curid,
            //     matid: this.matid
            // }
            // this.loading2 = true
            // this.listarNotaMateria(this.criterio);
            this.messageService.add({ severity: 'info', summary: 'Correcto', detail: 'Nota registrada.' });
        },
            error => {
                this.errors = error;
                console.log("error", error);
                this.messageService.add({ severity: 'warn', summary: 'Error', detail: 'Algo salio mal!' });
            });
    }
    else {
        this.pago.tipo = 2;
        this.pago.pagrusureg = 'ijquenta';
        this.pagoService.gestionarPago(this.pago).subscribe((result: any) => {
            this.messageService.add({ severity: 'success', summary: 'Correcto', detail: 'Nota modificada.' });
            this.pagoRegistroDialog = false;
            this.pago = new Pago();
            // const criterio = {
            //     curmatid: this.curmatid
            // }
            this.loading2 = true
            // this.listarNotas(criterio);
        },
            error => {
                this.errors = error;
                console.log("error", error);
                this.messageService.add({ severity: 'warn', summary: 'Error', detail: 'Algo salio mal!' });
            });
    }
}
}
