import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AutoComplete } from 'primeng/autocomplete';
import { Table } from 'primeng/table';
import { Observable, forkJoin } from 'rxjs';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ReporteService } from 'src/app/modules/service/data/reporte.service';

import { NotaService } from 'src/app/modules/service/data/nota.service';
import { AuthService } from 'src/app/modules/service/core/auth.service';
import { Nota } from 'src/app/modules/models/nota';
import { Inscripcion } from 'src/app/modules/models/inscripcion';
import { Usuario } from 'src/app/modules/models/usuario';
import { Pago } from 'src/app/modules/models/pago';
import { PagoService } from 'src/app/modules/service/data/pago.service';
@Component({
  templateUrl: './pago-estudiante.component.html',
  styleUrls: ['./pago-estudiante.component.scss']
})

export class PagoEstudianteComponent implements OnInit {

  @ViewChild('dtexc') dtexc: Table | undefined;
  @ViewChild('autocomplete') autocomplete:AutoComplete | undefined;

  criterio: any = '';
  loading: boolean = false;
  loading2: boolean = false;
  listarMateriasInscritas: Inscripcion[] = [];
  listarNotaEstudianteMateria: Pago[] = [];
  notaEstudiante = new Inscripcion();
  notaEstudianteMateria = new Nota();
  verNotasClicked: boolean = false;
  errors: any;
  usuario: Usuario;
  verMateriaClicked: boolean = false;
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
        this.authService.usuario$.subscribe((user => {
            if (user && Array.isArray(user) && user.length > 0) {
                this.usuario = user[0];
                const criterio = {
                    perid: this.usuario.perid
                };
                this.pagoService.listarPagoEstudiante(criterio).subscribe(
                    (result: any) => {
                        this.listarMateriasInscritas = result as Inscripcion[];
                        // this.messageService.add({severity: 'info', summary: 'Correcto', detail: 'Información obtenida'});
                    },
                    error => {
                        this.errors = error;
                        console.error("error", error);
                        this.messageService.add({severity: 'warn', summary: 'Error', detail: 'Algo salió mal!'});
                    }
                );
            }
        }));
    }

  listarPagoMateria(data: Nota){
    this.loading2 = true;
    this.verNotasClicked = true;
    const criterio = {
        perid: data.peridestudiante,
        curid: data.curid,
        matid: data.matid
    }
    this.pagoService.listarPagoEstudianteMateria(criterio).subscribe((result: any) => {
        this.listarNotaEstudianteMateria = result as Pago[];
        console.log(this.listarNotaEstudianteMateria)
        this.loading2 = false;
    //   this.messageService.add({severity:'info', summary:'Correcto', detail:'Información obtenida'});
    },
    error => {
      this.errors = error;
      console.error("error",error);
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
  // Método de busqueda en la tabla
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal(
        (event.target as HTMLInputElement).value,
        'contains'
    );
  }
  verArchivoPago(pagarchivo: any){
    this.pagoService.getFilePago(pagarchivo);
  }
}
