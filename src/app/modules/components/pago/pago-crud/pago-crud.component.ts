import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { AutoComplete } from 'primeng/autocomplete';
import { Table } from 'primeng/table';
import { NgxSpinnerService } from 'ngx-spinner';

import { UploadService } from 'src/app/modules/service/data/upload.service';
import { ReporteService } from 'src/app/modules/service/data/reporte.service';
import { PagoService } from 'src/app/modules/service/data/pago.service';
import { AuthService } from 'src/app/modules/service/core/auth.service';
import { Pago, TipoPago } from 'src/app/modules/models/pago';
import { CursoMateria } from 'src/app/modules/models/curso';
import { Usuario } from 'src/app/modules/models/usuario';
import { environment } from 'src/environments/environment';
import { UsuarioService } from 'src/app/modules/service/data/usuario.service';
import { TipoPersona2 } from 'src/app/modules/models/diccionario';
import { Router } from '@angular/router';
import { DataService } from 'src/app/modules/service/data/data.service';

interface ColumsTable {
    field: string;
    header: string;
}

@Component({
    selector: 'app-pago-crud',
    templateUrl: './pago-crud.component.html',
    styleUrls: ['../../../../app.component.css']
})

export class PagoCrudComponent implements OnInit {

    @ViewChild('dtexc') dtexc: Table | undefined;
    @ViewChild('autocomplete') autocomplete: AutoComplete | undefined;

    criterio: string = '';
    loading: boolean = false;
    loading2: boolean = false;
    listarMateriasInscritas: CursoMateria[] = [];
    listarPagoEstudianteMateria: Pago[] = [];
    verPagosEstudianteClicked: boolean = false;
    pago: Pago = new Pago();
    pagoAux: Pago = new Pago();
    optionPago: boolean = false;
    pagoRegistroDialog: boolean = false;
    curid: number | undefined;
    matid: number | undefined;
    matnombre: string | undefined;
    curnombre: string | undefined;
    tipoPago: TipoPago[] = [];
    tipoPagoSeleccionado: TipoPago | undefined;
    pagidlast: number | undefined;
    nombreArchivo: string | undefined;
    pagoForm: FormGroup;
    usuario: Usuario | undefined;
    archivos: any = {};
    uploadedFiles: any[] = [];
    userProfilePhoto: string = environment.API_URL_PROFILE_PHOTO;
    private rowIndexCounters: { [key: string]: number } = {};
    private currentCourse: number | undefined;
    errors: any;
    items: MenuItem[];
    home: MenuItem | undefined;
    userProfilePhotoEmpty = "../../../../../assets/images/login/sin_foto_perfil.png";
    selectedColumns: { field: string; header: string; }[];
    colsColumsTable!: ColumsTable[];
    personOptions: TipoPersona2[] = [];

    statusOptions = [
        { label: 'Activo', value: 1 },
        { label: 'Inactivo', value: 0 }
    ];
    // verClickPagosCursos: boolean = true;

    constructor(
        private messageService: MessageService,
        private reporteService: ReporteService,
        private pagoService: PagoService,
        private authService: AuthService,
        private formBuilder: FormBuilder,
        private uploadService: UploadService,
        private spinner: NgxSpinnerService,
        private usuarioService: UsuarioService,
        private router: Router,
        private dataService: DataService,
    ) {
        this.pagoForm = this.formBuilder.group({
        pagid: [null],
        pagfecha: [null, Validators.required],
        pagvalor: [null, Validators.required],
        pagcomentario: [null],
        pagtipo: [null, Validators.required]
        });

        this.items = [
            { label: 'Pago'},
            { label: 'Gestionar Pagos', routerLink:''},
        ];

        this.home = { icon: 'pi pi-home', routerLink: '/' };


        this.colsColumsTable = [
            { field: 'curnombre', header: 'Curso'},
            { field: 'matnombre', header: 'Materia'},
            { field: 'curmatfecfin', header: 'Fecha Fin'},
            { field: 'curmatfecini', header: 'Fecha Inicio'},
            { field: 'pernomcompleto', header: 'Docente'},
            { field: 'pernrodoc', header: 'N° Documento'},
            { field: 'curmatdescripcion', header: 'Descripción'},
            { field: 'num_pagos', header: 'N° Pagos'},
            { field: 'num_estudiantes', header: 'N° Estudiantes'},
            { field: 'curmatusureg', header: 'Usuario Registrado'},
            { field: 'curmatusumod', header: 'Usuario Modificado'},
            { field: 'curmatestado', header: 'Estado'}
        ];

        this.selectedColumns = [
            { field: 'matnombre', header: 'Materia'},
            { field: 'curmatfecini', header: 'Fecha Inicio'},
            { field: 'curmatfecfin', header: 'Fecha Fin'},
            { field: 'pernomcompleto', header: 'Docente'},
            { field: 'num_pagos', header: 'N° Pagos'},
            { field: 'num_estudiantes', header: 'N° Estudiantes'},
            { field: 'curmatestado', header: 'Estado'}
        ];
    }

    ngOnInit(): void {
        this.initializeComponent();
        // this.verClickPagosCursos = true;
    }

    /**
     * Inicializa el componente.
     */
    private initializeComponent(): void {
        this.listarTipoPagoCombo();
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
        }
        });
    }

    /**
     * Lista los cursos y materias inscritas, mostrando un spinner mientras carga.
     */
    private listarCursosMaterias(): void {
        this.spinner.show();
        this.loading = true;
        this.pagoService.listarPagoCurso().subscribe({
        next: (result: CursoMateria[]) => {
            this.listarMateriasInscritas = result;
            this.loading = false;
            this.spinner.hide();
        },
        error: (error: any) => {
            this.handleError(error, 'No se pudieron obtener los cursos y materias.');
            this.loading = false;
            this.spinner.hide();
        }
        });
    }

    /**
     * Lista los pagos de un estudiante por materia y curso.
     * @param data Datos de curso y materia.
     */
    listarPagoMateria(data: { curid: number, matid: number, curnombre: string, matnombre: string }): void {
        console.log("click: ", this.verPagosEstudianteClicked);

        this.curid = data.curid;
        this.curnombre = data.curnombre;
        this.matid = data.matid;
        this.matnombre = data.matnombre;
        const criterio = { curid: data.curid, matid: data.matid };

        this.obtenerEstudiantesPorCursoMateria(criterio);

         // Asegúrate de restablecer el valor si es necesario
        this.verPagosEstudianteClicked = false;


    }

    /**
     * Lista los pagos de estudiantes por curso y materia.
     * @param data Datos del curso y materia.
     */
    private obtenerEstudiantesPorCursoMateria(data: { curid: number, matid: number }): void {
        this.loading2 = true;
        this.pagoService.listarPagoEstudiantesMateria(data).subscribe({
        next: (result: Pago[]) => {
            console.log("lsitarMateriaPorCurso", result)
            this.listarPagoEstudianteMateria = result;
            this.loading2 = false;
            this.irAEstudianteMateria();

            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Información obtenida.', life: 1000 });
        },
        error: (error: any) => {
            this.handleError(error, 'Ha ocurrido un error al obtener los pagos.');
            this.loading2 = false;
        },
        complete: () => {
            this.loading2 = false;
            // this.verClickPagosCursos = false;
            this.verPagosEstudianteClicked = true;
        },
    });
    }

    /**
     * Maneja los errores de las peticiones HTTP.
     * @param error Error ocurrido.
     * @param mensaje Mensaje de error a mostrar.
     */
    private handleError(error: any, mensaje: string): void {
        console.error(mensaje, error);
        this.messageService.add({ severity: 'warn', summary: 'Error', detail: mensaje });
    }

    /**
     * Calcula el total de estudiantes para un curso.
     * @param curid ID del curso.
     * @returns Total de estudiantes.
     */
    calculateStudentTotal(curid: number): number {
        return this.listarMateriasInscritas
        .filter(materiaInscrita => materiaInscrita.curid === curid)
        .reduce((total, materiaInscrita) => total + materiaInscrita.num_estudiantes, 0);
    }

    /**
     * Calcula el total de pagos para un curso.
     * @param curid ID del curso.
     * @returns Total de pagos.
     */
    calculatePaymentTotal(curid: number): number {
        return this.listarMateriasInscritas
        .filter(materiaInscrita => materiaInscrita.curid === curid)
        .reduce((total, materiaInscrita) => total + materiaInscrita.num_pagos, 0);
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
     * Obtiene los tipos de pago desde el servicio de pago.
     */
    private listarTipoPagoCombo(): void {
        this.pagoService.getTipoPago().subscribe({
        next: (result: TipoPago[]) => {
            this.tipoPago = result;
        },
        error: (error: any) => {
            this.handleError(error, 'No se pudieron obtener los tipos de pago.');
        }
        });
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
     * Obtiene el color de severidad basado en el tipo de pago.
     * @param pagtipo Tipo de pago.
     * @returns Color de severidad.
     */
    getSeverityColor(pagtipo: number): string {
        switch (pagtipo) {
        case 1: return 'info'; // Ninguno
        case 2: return 'success'; // Efectivo
        case 3: return 'warning'; // Deposito bancario
        case 4: return 'primary'; // Adelanto
        case 5: return 'danger'; // Otro
        default: return 'info';
        }
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
        case 1: return 'Ninguno';
        case 2: return 'Efectivo';
        case 3: return 'Deposito Bancario';
        case 4: return 'Adelanto';
        case 5: return 'Otro';
        default: return 'Otro';
        }
    }

    // lista las personas para el combo de opciones
    getAllPersonCombo(){
        this.usuarioService.getTipoPersonaDocente().subscribe(
            (result: any) => {
                this.personOptions = result.map((persona: any) => ({
                    label: persona.pernomcompleto,
                    value: persona.pernomcompleto,
                    pernrodoc: persona.pernrodoc,
                    perfoto: persona.perfoto
                }))
            }
        )
    }


    irAEstudianteMateria() {
        const data = {
          listarPagoEstudianteMateria: this.listarPagoEstudianteMateria,
          usuario: this.usuario,
          verPagosEstudianteClicked: this.verPagosEstudianteClicked,
          loading2: this.loading2,
          userProfilePhoto: this.userProfilePhoto,
          curnombre: this.curnombre,
          matnombre: this.matnombre
        };

        this.dataService.changeData(data);
        this.router.navigate(['/principal/pago/estudiante-materia']);
      }
}
