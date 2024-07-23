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

import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  templateUrl: './nota-estudiante.component.html',
  styleUrls: ['./nota-estudiante.component.scss']
})

export class NotaEstudianteComponent implements OnInit {

  @ViewChild('dtexc') dtexc: Table | undefined;
  @ViewChild('autocomplete') autocomplete:AutoComplete | undefined;

  criterio: any = '';
  loading: boolean = false;
  loading2: boolean = false;
  listarMateriasInscritas: Inscripcion[] = [];
  listarNotaEstudianteMateria: Nota[] = [];
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
    private spinner: NgxSpinnerService,
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
                this.spinner.show();
                this.notaService.listarNotaEstudiante(criterio).subscribe(
                    (result: any) => {
                        this.spinner.hide();
                        this.listarMateriasInscritas = result as Inscripcion[];
                        console.log("lista_materias_inscritas", this.listarMateriasInscritas)
                        // this.messageService.add({severity: 'info', summary: 'Correcto', detail: 'Información obtenida'});
                    },
                    error => {
                        this.spinner.hide();
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
    const criterio = {
        perid: data.peridestudiante,
        curid: data.curid,
        matid: data.matid
    }
    this.notaService.listarNotaEstudianteMateria(criterio).subscribe((result: any) => {
        this.listarNotaEstudianteMateria = result as Nota[];
        this.loading2 = false;
    //   this.messageService.add({severity:'info', summary:'Correcto', detail:'Información obtenida'});
    },
    error => {
      this.errors = error;
      console.log("error",error);
      this.messageService.add({severity:'warn', summary:'Error', detail:'Algo salio mal!'});
    });
  }
    // Método de busqueda en la tabla
    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }
}
