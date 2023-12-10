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

import { CursoMateria } from 'src/app/modules/models/curso';
@Component({
  templateUrl: './nota-docente.component.html',
  styleUrls: ['./nota-docente.component.scss']
})

// export class NotaEstudianteComponent implements OnInit, OnDestroy {
export class NotaDocenteComponent implements OnInit {

  @ViewChild('dtexc') dtexc: Table | undefined;
  @ViewChild('autocomplete') autocomplete:AutoComplete | undefined;

// ------------- Datos Beneficio Social -------------

  criterio: any = '';
  loading: boolean = false;
  loading2: boolean = false;
  listarMateriasInscritas: CursoMateria[] = [];
  listarNotaEstudianteMateria: Nota[] = [];
  listarNotaEstudianteCurso: Nota[] = [];
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
    private authService: AuthService
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
                this.notaService.listarNotaDocente(criterio).subscribe(
                    (result: any) => {
                        this.listarMateriasInscritas = result as CursoMateria[];
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

  listarNotaMateria(data: CursoMateria){
    this.loading2 = true;
    this.verNotasClicked = true;
    const criterio = {
        curmatid: data.curmatid,
    }
    this.notaService.listarNotaEstudianteCurso(criterio).subscribe((result: any) => {
        this.listarNotaEstudianteCurso = result as Nota[];
        console.log(" ", result)
        this.loading2 = false;
      this.messageService.add({severity:'info', summary:'Correcto', detail:'Información obtenida'});
    //   this.listarBenSoc();

    },
    error => {
      this.errors = error;
      console.log("error",error);
      this.messageService.add({severity:'warn', summary:'Error', detail:'Algo salio mal!'});
    });
  }
  addNota(data: any){
    console.log(data)
  }
  updateNota(data: any){
    console.log(data)
  }



}

