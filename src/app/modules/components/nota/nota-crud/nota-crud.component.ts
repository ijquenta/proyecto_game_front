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

import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
@Component({
    templateUrl: './nota-crud.component.html',
    styleUrls: ['../../../../app.component.css']
})

export class NotaCrudComponent implements OnInit {

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
    apiUrl = environment.API_URL_FOTO_PERFIL;
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
                // const criterio = {
                //     perid: this.usuario.perid
                // };
                // this.notaService.listarNotaDocente(criterio).subscribe(
                //     (result: any) => {
                //         this.listarMateriasInscritas = result as CursoMateria[];
                //         // this.messageService.add({severity: 'info', summary: 'Correcto', detail: 'Información obtenida'});
                //     },
                //     error => {
                //         this.errors = error;
                //         console.log("error", error);
                //         this.messageService.add({ severity: 'warn', summary: 'Error', detail: 'Algo salió mal!' });
                //     }
                // );
            }
        }));
        this.listarCursosMaterias();
    }
// Método para listar los los cursos
    listarCursosMaterias() {
        this.spinner.show();
        this.loading = true;
        this.notaService.listarNotaCurso().subscribe(
            (result: any) => {
                this.listarMateriasInscritas = result as CursoMateria[];
                this.loading = false;
                this.spinner.hide();
            },
            (error: any) => {
                this.errors = error;
                console.log("error", error);
                this.messageService.add({severity: 'warn', summary: 'Error', detail: 'Algo salió mal!'});
            }
        );

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
        this.nota = { ...data };
        this.optionNota = true;
        this.notaRegistroDialog = true;
        this.calcularNotaFinal();
    }

    updateNota(data: Nota) {
        this.optionNota = false;
        this.nota = { ...data };
        this.notaRegistroDialog = true;
        this.calcularNotaFinal();
    }
    calcularNotaFinal() {
        console.log('Notas antes de filtrar:', this.nota.not1, this.nota.not2, this.nota.not3);
        const notas = [this.nota.not1, this.nota.not2, this.nota.not3].filter(nota => nota !== null && nota !== undefined && nota !== 0);
        console.log('Notas después de filtrar:', notas);
        this.nota.notfinal = notas.length > 0 ? notas.reduce((a, b) => a + b, 0) / notas.length : 0;
        console.log('Nota final calculada:', this.nota.notfinal);
    }
    hideDialog() {
        this.notaRegistroDialog = false;
        this.nota1 = 0;
        this.nota2 = 0;
        this.nota3 = 0;
        this.notafinal = 0;
    }
    registrarNota() {

        this.nota.notusureg = this.usuario.usuname;
        this.nota.notusumod = this.usuario.usuname;
        this.nota.notestado = 1;
        this.nota.tipo = this.optionNota ? 1 : 2;
        this.calcularNotaFinal();
        this.notaService.gestionarNota(this.nota).subscribe(
            (result: any) => {
                this.notaRegistroDialog = false;
                this.nota = new Nota();
                const notas = 0;
                const criterio = { curmatid: this.curmatid };
                this.loading2 = true;
                this.listarNotas(criterio);
                this.messageService.add({ severity: this.optionNota ? 'info' : 'success', summary: 'Correcto', detail: this.optionNota ? 'Nota registrada.' : 'Nota modificada.' });
            },
            error => {
                this.errors = error;
                console.log("error", error);
                this.messageService.add({ severity: 'warn', summary: 'Error', detail: 'Algo salió mal!' });
            }
        );
    }
     // Método de busqueda en la tabla
    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }
}

