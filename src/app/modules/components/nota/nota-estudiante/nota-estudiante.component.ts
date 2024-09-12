import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { AutoComplete } from 'primeng/autocomplete';
import { Table } from 'primeng/table';
import { DialogService } from 'primeng/dynamicdialog';
import { ReporteService } from 'src/app/modules/service/data/reporte.service';

import { NotaService } from 'src/app/modules/service/data/nota.service';
import { AuthService } from 'src/app/modules/service/core/auth.service';
import { Nota } from 'src/app/modules/models/nota';
import { Inscripcion } from 'src/app/modules/models/inscripcion';
import { Usuario } from 'src/app/modules/models/usuario';

import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';

@Component({
    templateUrl: './nota-estudiante.component.html',
    styleUrls: ['./nota-estudiante.component.scss'],
})
export class NotaEstudianteComponent implements OnInit {
    @ViewChild('dtexc') dtexc: Table | undefined;
    @ViewChild('autocomplete') autocomplete: AutoComplete | undefined;

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
    // Variables para Dataview
    sortOrder: number = 0;
    sortField: string = '';
    searchText: string = '';
    items: MenuItem[];
    home: MenuItem | undefined;
    userProfilePhoto = environment.API_URL_PROFILE_PHOTO;
    filteredNotaEstudiante: any[] = [];
    constructor(
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private dialogService: DialogService,
        private reporteService: ReporteService,
        private notaService: NotaService,
        private authService: AuthService,
        private spinner: NgxSpinnerService
    ) {
        this.items = [
            { label: 'Estudiante | Nota'},
            { label: 'Mi Notas', routerLink:''},
        ];

        this.home = { icon: 'pi pi-home', routerLink: '/principal' };
    }
    ngOnInit(): void {
        this.verMateriaClicked = true;
        this.authService.usuario$.subscribe((user) => {
            if (user && Array.isArray(user) && user.length > 0) {
                this.usuario = user[0];
                const criterio = {
                    perid: this.usuario.perid,
                };
                this.spinner.show();
                this.notaService.listarNotaEstudiante(criterio).subscribe({
                    next: (result: any) => {
                        this.spinner.hide();
                        this.listarMateriasInscritas = result as Inscripcion[];
                        this.filteredNotaEstudiante = this.listarMateriasInscritas;
                        this.messageService.add({severity: 'info', summary: 'Correcto', detail: 'Información obtenida'});
                    },
                    error: (error) => {
                        this.spinner.hide();
                        this.errors = error;
                        console.error('error', error);
                        this.messageService.add({
                            severity: 'warn',
                            summary: 'Error',
                            detail: 'Algo salió mal!',
                        });
                    }
                });
            }
        });
    }

    listarNotaMateria(data: Nota) {
        this.loading2 = true;
        this.verNotasClicked = true;
        const criterio = {
            perid: data.peridestudiante,
            curid: data.curid,
            matid: data.matid,
        };
        this.notaService.listarNotaEstudianteMateria(criterio).subscribe(
            (result: any) => {
                this.listarNotaEstudianteMateria = result as Nota[];
                this.loading2 = false;
            },
            (error) => {
                this.errors = error;
                console.error('error', error);
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Error',
                    detail: 'Algo salio mal!',
                });
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

    getInitials(name: string): string {
        if (!name) return '';
        return name.charAt(0).toUpperCase();
    }

    // Funciones para obtener el color de la barra de estado
    getSeverityStatus(estado: number): string {
        switch (estado) {
            case 1:
                return 'success';
            case 0:
                return 'danger';
            default:
                return 'info';
        }
    }

    getDescriptionStatus(estado: number): string {
        switch (estado) {
            case 1:
                return 'En curso';
            case 0:
                return 'Terminada';
            case 3:
                return 'Suspendida';
            default:
                return 'Ninguno';
        }
    }

    // Ver notas por materia
    verNotas(){
        this.verNotasClicked = true;
    }

    rptNota(){
        const criterio = {
            perid: this.usuario.perid,
            usuname: this.usuario.usuname
        }
        this.notaService.rptNotaEstudianteMateria(criterio);
    }

     // filtra los usuarios por su nombre completo
     filtarUsuarios(){
        this.filteredNotaEstudiante = this.listarMateriasInscritas.filter(materiaInscrita =>
            materiaInscrita.curnombre.toLowerCase().includes(this.searchText.toLowerCase()) ||
            materiaInscrita.matnombre.toLowerCase().includes(this.searchText.toLowerCase())
        );
    }
}
