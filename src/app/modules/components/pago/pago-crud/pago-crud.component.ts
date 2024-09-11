import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

import { NgxSpinnerService } from 'ngx-spinner';

import { PagoService } from 'src/app/modules/service/data/pago.service';
import { AuthService } from 'src/app/modules/service/core/auth.service';
import { UsuarioService } from 'src/app/modules/service/data/usuario.service';

import { CursoMateria } from 'src/app/modules/models/curso';
import { Usuario } from 'src/app/modules/models/usuario';
import { TipoPersona2 } from 'src/app/modules/models/diccionario';

import { environment } from 'src/environments/environment';

interface ColumsTable {
    field: string;
    header: string;
}

@Component({
    selector: 'app-pago-crud',
    templateUrl: './pago-crud.component.html',
    styleUrls: ['../../../../app.component.css'],
})
export class PagoCrudComponent implements OnInit {
    @ViewChild('dtexc') dtexc: Table | undefined;

    loading: boolean = false;
    listarMateriasInscritas: CursoMateria[] = [];
    curid: number | undefined;
    matid: number | undefined;
    usuario: Usuario | undefined;
    userProfilePhoto: string = environment.API_URL_PROFILE_PHOTO;
    userProfilePhotoEmpty = '../../../../../assets/images/login/sin_foto_perfil.png';

    private rowIndexCounters: { [key: string]: number } = {};
    private currentCourse: number | undefined;

    errors: any;
    items: MenuItem[];
    home: MenuItem | undefined;

    selectedColumns: { field: string; header: string }[];
    colsColumsTable!: ColumsTable[];
    personOptions: TipoPersona2[] = [];

    statusOptions = [
        { label: 'Activo', value: 1 },
        { label: 'Inactivo', value: 0 },
    ];

    constructor(
        private messageService: MessageService,
        private pagoService: PagoService,
        private authService: AuthService,
        private spinner: NgxSpinnerService,
        private usuarioService: UsuarioService,
        private router: Router
    ) {
        this.items = [
            { label: 'Pago' },
            { label: 'Gestionar Pagos', routerLink: '' },
        ];

        this.home = { icon: 'pi pi-home', routerLink: '/' };

        this.colsColumsTable = [
            { field: 'curnombre', header: 'Curso' },
            { field: 'matnombre', header: 'Materia' },
            { field: 'curmatfecfin', header: 'Fecha Fin' },
            { field: 'curmatfecini', header: 'Fecha Inicio' },
            { field: 'pernomcompleto', header: 'Docente' },
            { field: 'pernrodoc', header: 'N° Documento' },
            { field: 'curmatdescripcion', header: 'Descripción' },
            { field: 'num_pagos', header: 'N° Pagos' },
            { field: 'num_estudiantes', header: 'N° Estudiantes' },
            { field: 'curmatusureg', header: 'Usuario Registrado' },
            { field: 'curmatusumod', header: 'Usuario Modificado' },
            { field: 'curmatestado', header: 'Estado' },
        ];

        this.selectedColumns = [
            { field: 'matnombre', header: 'Materia' },
            { field: 'curmatfecini', header: 'Fecha Inicio' },
            { field: 'curmatfecfin', header: 'Fecha Fin' },
            { field: 'pernomcompleto', header: 'Docente' },
            { field: 'num_pagos', header: 'N° Pagos' },
            { field: 'num_estudiantes', header: 'N° Estudiantes' },
            { field: 'curmatestado', header: 'Estado' },
        ];
    }

    ngOnInit(): void {
        this.listarCursosMaterias();
        this.getProfileUsuario();
        this.getAllPersonCombo();
    }

    /**
     * Obtiene el perfil del usuario desde el servicio de autenticación.
     */
    private getProfileUsuario(): void {
        this.authService.getProfile().subscribe({
            next: (usuario: Usuario[]) => {
                this.usuario = usuario[0];
            },
            error: (error: any) => {
                console.error('Error al obtener el perfil del usuario', error);
            },
        });
    }

    /**
     * Lista los cursos y materias inscritas, mostrando un spinner mientras carga.
     */
    private listarCursosMaterias(): void {
        this.spinner.show();
        this.pagoService.listarPagoCurso().subscribe({
            next: (result: CursoMateria[]) => {
                this.listarMateriasInscritas = result;
                this.spinner.hide();
            },
            error: (error: any) => {
                this.handleError(
                    error,
                    'No se pudieron obtener los cursos y materias.'
                );
                this.spinner.hide();
            },
        });
    }

    /**
     * Lista los pagos de un estudiante por materia y curso.
     * @param data Datos de curso y materia.
     */
    listarPagoMateria(data: any): void {
        this.curid = data.curid;
        this.matid = data.matid;
        this.router.navigate(['/principal/pago/estudiante-materia'], {
            queryParams: { curid: this.curid, matid: this.matid },
        });
    }

    /**
     * Maneja los errores de las peticiones HTTP.
     * @param error Error ocurrido.
     * @param mensaje Mensaje de error a mostrar.
     */
    private handleError(error: any, mensaje: string): void {
        console.error(mensaje, error);
        this.messageService.add({
            severity: 'warn',
            summary: 'Error',
            detail: mensaje,
        });
    }

    /**
     * Calcula el total de estudiantes para un curso.
     * @param curid ID del curso.
     * @returns Total de estudiantes.
     */
    calculateStudentTotal(curid: number): number {
        return this.listarMateriasInscritas
            .filter((materiaInscrita) => materiaInscrita.curid === curid)
            .reduce(
                (total, materiaInscrita) =>
                    total + materiaInscrita.num_estudiantes,
                0
            );
    }

    /**
     * Calcula el total de pagos para un curso.
     * @param curid ID del curso.
     * @returns Total de pagos.
     */
    calculatePaymentTotal(curid: number): number {
        return this.listarMateriasInscritas
            .filter((materiaInscrita) => materiaInscrita.curid === curid)
            .reduce(
                (total, materiaInscrita) => total + materiaInscrita.num_pagos,
                0
            );
    }

    /**
     * Resetea el índice de fila para el grupo de curso.
     * @param rowGroupIndex Índice del grupo de filas.
     * @returns Siempre true.
     */
    resetRowIndex(rowGroupIndex: number): boolean {
        this.currentCourse = this.listarMateriasInscritas[rowGroupIndex]?.curid;
        this.rowIndexCounters[this.currentCourse] = 0;
        return true;
    }

    /**
     * Obtiene el índice de fila para el grupo actual.
     * @param rowIndex Índice de fila.
     * @returns Índice de fila incrementado.
     */
    getRowIndex(rowIndex: number): number {
        if (!this.rowIndexCounters[this.currentCourse]) {
            this.rowIndexCounters[this.currentCourse] = 0;
        }
        return ++this.rowIndexCounters[this.currentCourse];
    }

    /**
     * Filtra globalmente los datos en la tabla.
     * @param table Instancia de la tabla.
     * @param event Evento del filtro.
     */
    onGlobalFilter(table: Table, event: Event): void {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }

    /**
     * Obtiene la descripción del estado
     * @param estado
     * @returns texto del estado
     */
    getDescriptionStatus(estado: number): string {
        switch (estado) {
            case 1:
                return 'Activo';
            case 0:
                return 'Inactivo';
            default:
                return 'Ninguno';
        }
    }

    /**
     * Obtene el color del estado
     * @param estado
     * @returns el color
     */
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

    /**
     * Obtiene el texto correspondiente al tipo de pago.
     * @param pagtipo Tipo de pago.
     * @returns Texto del tipo de pago.
     */
    getText(pagtipo: number): string {
        switch (pagtipo) {
            case 1:
                return 'Ninguno';
            case 2:
                return 'Efectivo';
            case 3:
                return 'Deposito Bancario';
            case 4:
                return 'Adelanto';
            case 5:
                return 'Otro';
            default:
                return 'Otro';
        }
    }

    /**
     * Obtener la lista de las personas para el combo de opciones.
     */
    getAllPersonCombo() {
        this.usuarioService.getTipoPersonaDocente().subscribe((result: any) => {
            this.personOptions = result.map((persona: any) => ({
                label: persona.pernomcompleto,
                value: persona.pernomcompleto,
                pernrodoc: persona.pernrodoc,
                perfoto: persona.perfoto,
            }));
        });
    }


}
