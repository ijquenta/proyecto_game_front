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

export class NotaDocenteComponent implements OnInit {

    @ViewChild('dtexc') dtexc: Table | undefined;
    @ViewChild('autocomplete') autocomplete: AutoComplete | undefined;

    // ------------- Datos Nota -------------

    criterio: any = '';
    loading: boolean = false;
    loading2: boolean = false;
    listarMateriasInscritas: CursoMateria[] = [];
    listarNotaEstudianteMateria: Nota[] = [];
    listarNotaEstudianteCurso: Nota[] = [];
    notaEstudiante = new Inscripcion();
    nota = new Nota();
    notaEstudianteMateria = new Nota();
    verNotasClicked: boolean = false;
    errors: any;
    usuario: Usuario;
    verMateriaClicked: boolean = false;
    notaRegistroDialog: boolean = false;
    optionNota: boolean = false;
    nota1: any;
    nota2: any;
    nota3: any;
    notafinal: any;
    curmatid: any;
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
                        // this.messageService.add({severity: 'info', summary: 'Correcto', detail: 'Información obtenida'});
                    },
                    error => {
                        this.errors = error;
                        console.log("error", error);
                        this.messageService.add({ severity: 'warn', summary: 'Error', detail: 'Algo salió mal!' });
                    }
                );
            }
        }));
    }

    listarNotaMateria(data: CursoMateria) {
        this.loading2 = true;
        this.verNotasClicked = true;
        this.curmatid = data.curmatid;
        const criterio = {
            curmatid: data.curmatid,
        }
        this.listarNotas(criterio);
    }
    listarNotas(criterio: any) {
        this.notaService.listarNotaEstudianteCurso(criterio).subscribe((result: any) => {
            this.listarNotaEstudianteCurso = result as Nota[];
            this.loading2 = false;
        },
        error => {
            this.errors = error;
            console.log("error", error);
            this.messageService.add({ severity: 'warn', summary: 'Error', detail: 'Algo salio mal!' });
        });
    }
    addNota(data: any) {
        this.nota = { ...data }
        this.optionNota = true;
        this.notaRegistroDialog = true;
        this.notaRegistroDialog = true;
        this.notafinal = this.nota1 + this.nota2 + this.nota3;
    }
    updateNota(data: Nota) {
        this.optionNota = false;
        this.nota = { ...data }
        this.notaRegistroDialog = true;
    }
    hideDialog() {
        this.notaRegistroDialog = false;
        this.nota1 = 0;
        this.nota2 = 0;
        this.nota3 = 0;
        this.notafinal = 0;
    }
    registrarNota() {
        if (this.optionNota) {
            this.nota.tipo = 1;
            this.nota.notid = null
            this.nota.notfinal = (this.nota.not1 + this.nota.not3 + this.nota.not3) / 3;
            this.nota.notusureg = 'ijquenta';
            this.nota.notusumod = 'ijquenta';
            this.nota.notestado = 1;
            this.notaService.gestionarNota(this.nota).subscribe((result: any) => {
                this.notaRegistroDialog = false;
                this.nota = new Nota();
                const criterio = {
                    curmatid: this.curmatid
                }
                this.loading2 = true
                this.listarNotas(criterio);
                this.messageService.add({ severity: 'info', summary: 'Correcto', detail: 'Nota registrada.' });
            },
                error => {
                    this.errors = error;
                    console.log("error", error);
                    this.messageService.add({ severity: 'warn', summary: 'Error', detail: 'Algo salio mal!' });
                });
        }
        else {
            this.nota.tipo = 2;
            this.nota.notfinal = (this.nota.not1 + this.nota.not3 + this.nota.not3) / 3;
            this.nota.notusureg = 'ijquenta';
            this.nota.notusumod = 'ijquenta';
            this.nota.notestado = 1;
            this.notaService.gestionarNota(this.nota).subscribe((result: any) => {
                this.messageService.add({ severity: 'success', summary: 'Correcto', detail: 'Nota modificada.' });
                this.notaRegistroDialog = false;
                this.nota = new Nota();
                const criterio = {
                    curmatid: this.curmatid
                }
                this.loading2 = true
                this.listarNotas(criterio);
            },
                error => {
                    this.errors = error;
                    console.log("error", error);
                    this.messageService.add({ severity: 'warn', summary: 'Error', detail: 'Algo salio mal!' });
                });
        }
    }
    // Método de busqueda en la tabla
    onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal(
          (event.target as HTMLInputElement).value,
          'contains'
      );
    }
}

