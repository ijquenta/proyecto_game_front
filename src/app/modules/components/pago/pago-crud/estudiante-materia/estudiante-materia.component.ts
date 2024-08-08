import { ActivatedRoute } from '@angular/router';
import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';

import { MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

import { Pago, TipoPago } from 'src/app/modules/models/pago';
import { Curso } from 'src/app/modules/models/curso';
import { Materia } from 'src/app/modules/models/materia';

import { PagoService } from 'src/app/modules/service/data/pago.service';
import { MateriaService } from 'src/app/modules/service/data/materia.service';
import { CursoService } from 'src/app/modules/service/data/curso.service';

import { environment } from 'src/environments/environment';


interface ColumsTable {
    field: string;
    header: string;
}

interface TipoPagoOption {
    label: any;
    value: any;
}

@Component({
    selector: 'app-estudiante-materia',
    templateUrl: './estudiante-materia.component.html',
    styleUrls: ['./estudiante-materia.component.css']
})

export class EstudianteMateriaComponent implements OnInit {

    pago: Pago = new Pago();
    listarPagoEstudianteMateria: Pago[] = [];
    tipoPago: TipoPago[] = [];
    curso: Curso = new Curso();
    materia: Materia = new Materia();
    curnombre: string;
    matnombre: string;
    curid: Number | 0;
    matid: Number | 0;

    items: MenuItem[];
    home: MenuItem | undefined;

    errors: any;
    loading: boolean;

    userProfilePhoto: string = environment.API_URL_PROFILE_PHOTO;
    userProfilePhotoEmpty = "../../../../../assets/images/login/sin_foto_perfil.png";
    apiUrlPagoArchivo: string = environment.API_URL_PAGO_ARCHIVO;

    selectedColumns: { field: string; header: string; }[];
    colsColumsTable!: ColumsTable[];

    tipoPagoOptions: TipoPagoOption[] = [];

    statusOptions = [
        { label: 'Activo', value: 1 },
        { label: 'Inactivo', value: 0 },
        { label: 'Ninguno', value: null}
    ];

    private tipoPagoMap: { [key: number]: { color: string, text: string } } = {
        1: { color: 'info', text: 'Ninguno' },
        2: { color: 'success', text: 'Efectivo' },
        3: { color: 'warning', text: 'Deposito Bancario' },
        4: { color: 'primary', text: 'Adelanto' },
        5: { color: 'danger', text: 'Otro' },
    };

    showArchivoImagen: boolean;
    pagarchivo: any;

    constructor(
        private messageService: MessageService,
        private pagoService: PagoService,
        private route: ActivatedRoute,
        private router: Router,
        private cursoService: CursoService,
        private materiaService: MateriaService
    ) {

        this.items = [
            { label: 'Pago'},
            { label: 'Gestionar Pagos', routerLink:'/principal/pago/todos' },
            { label: 'Materia', routerLink:''},
        ];
        this.home = { icon: 'pi pi-home', routerLink: '/' };

        this.colsColumsTable = [
            { field: 'pernomcompleto', header: 'Estudiante'},
            { field: 'pagfecha', header: 'Fecha'},
            { field: 'pagmonto', header: 'Monto'},
            { field: 'pagtipo', header: 'Tipo'},
            { field: 'pagdescripcion', header: 'Descripción'},
            { field: 'pagusureg', header: 'Usuario Registrado'},
            { field: 'pagusumod', header: 'Usuario Modificado'},
            { field: 'pagestado', header: 'Estado'}
        ];

        this.selectedColumns = [
            { field: 'pernomcompleto', header: 'Estudiante'},
            { field: 'pagfecha', header: 'Fecha'},
            { field: 'pagmonto', header: 'Monto'},
            { field: 'pagtipo', header: 'Tipo'},
            { field: 'pagdescripcion', header: 'Descripción'},
            { field: 'pagestado', header: 'Estado'}
        ];
    }

    /**
     * Método de inicialización del componente.
     * Configura el formulario y obtiene los tipos de pago.
     */
    ngOnInit(): void {
        this.initData();
        this.listarTipoPagoCombo();
    }

    /**
     * Recuperar datos necesarios para el componente
     */
    initData(){
        // Recuperar curid y matid desde los parametros de la ruta
        this.route.queryParams.subscribe(params => {
            this.curid = Number(params['curid']) || 0;
            this.matid = Number(params['matid']) || 0;
        });
        // Obtener los datos de curid
        this.cursoService.getCursoById(this.curid).subscribe({
            next: (result: Curso) => {
                this.curso = result['data'];
                this.curnombre = this.curso.curnombre;
            },
            error: (error: any) => {
                console.error("error al obtener los datos del pago:", error);
                this.messageService.add({ severity: 'warn', summary: '¡Error!', detail: 'No se pudieron cargar los datos del pago' });
            }
        });
        // Obtener los datos de matid
        this.materiaService.getMateriaById(this.matid).subscribe({
            next: (result: Materia) => {
                this.materia = result['data'];
                this.matnombre = this.materia.matnombre;
            },
            error: (error: any) => {
                console.error("error al obtener los datos del pago:", error);
                this.messageService.add({ severity: 'warn', summary: '¡Error!', detail: 'No se pudieron cargar los datos del pago' });
            }
        });
        // Obtener los estudiantes de la materia y curso seleccionados.
        this.listarMateriasPorCurso({ curid: this.curid, matid: this.matid });
    }

    /**
     * Obtiene los tipos de pago disponibles desde el servicio.
     */
    listarTipoPagoCombo(): void {
        this.pagoService.getTipoPago().subscribe({
            next: (result: TipoPago[]) => {
                this.tipoPago = result;
                this.tipoPagoOptions = result.map((tp: any) => ({
                    label: tp.tpagnombre,
                    value: tp.tpagid,
                }));
            },
            error: (error: any) => {
                console.error("error al obtener los tipos de pago:", error);
                this.messageService.add({ severity: 'warn', summary: '¡Error!', detail: 'No se pudieron obtener los tipos de pago' });
            }
        });
    }

    /**
     * Obtiene la lista de pagos y estudiantes por curso.
     * @param data Datos del curso.
     */
    listarMateriasPorCurso(data: any): void {
        this.loading = true;
        this.pagoService.listarPagoEstudiantesMateria(data).subscribe({
            next: (result: Pago[]) => {
                this.listarPagoEstudianteMateria = result;
                this.loading = false;
                this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Información obtenida.', life: 1000 });
            },
            error: (error: any) => {
                this.errors = error;
                this.loading = false;
                console.error("error al listar pagos y estudiantes:", error);
                this.messageService.add({ severity: 'warn', summary: '¡Error!', detail: 'Ha ocurrido un error' });
            }
        });
    }

    /**
     * Abre el diálogo para crear un nuevo pago.
     * @param data Datos del pago.
     */
    crearPago(data: any): void {
        // Asignar en datos a la variable pago.
        this.pago = { ...data };
        // Convertir a número los valores de curid y matid
        const curid = Number(this.pago.curid);
        const matid = Number(this.pago.matid);
        const pagid = Number(this.pago.pagid);
        const insid = Number(this.pago.insid);
        // Redirigir a la ruta del formulario de pago.
        this.router.navigate(['/principal/pago/form'], {
            queryParams: { insid, curid, matid, pagid }
        });
    }

    /**
     * Abre el diálogo para actualizar un pago existente.
     * @param data Datos del pago a actualizar.
     */
    actualizarPago(data: Pago): void {
        // Asignar en datos a la variable pago
        this.pago = { ...data };
        // Convertir a número de valores de curid, matid y pagid
        const curid = Number(this.pago.curid);
        const matid = Number(this.pago.matid);
        const pagid = Number(this.pago.pagid);
        const insid = Number(this.pago.insid);
        // Redirigir a la ruta del formulario de pago
        this.router.navigate(['/principal/pago/form'], {
            queryParams: { insid, curid, matid, pagid }
        });
    }

    /**
     * Obtiene el color de severidad basado en el tipo de pago.
     * @param pagtipo Tipo de pago.
     * @returns Color asociado al tipo de pago.
     */
    getSeverityColor(pagtipo: number): string {
        return this.tipoPagoMap[pagtipo]?.color || 'info';
    }

    /**
     * Obtiene el texto descriptivo basado en el tipo de pago.
     * @param pagtipo Tipo de pago.
     * @returns Texto descriptivo del tipo de pago.
     */
    getText(pagtipo: number): string {
        return this.tipoPagoMap[pagtipo]?.text || 'Otro';
    }

    /**
     * Filtra globalmente los datos en la tabla.
     * @param table Instancia de la tabla.
     * @param event Evento del filtro.
     */
    onGlobalFilter(table: Table, event: Event): void {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    /**
     *
     * @param filename nombre del archivo
     * @returns retorna si el archivo es una imagen o no.
     */
    isImagen(filename: string): boolean {
        const ext = filename.split('.').pop().toLowerCase();
        return ['jpg', 'jpeg', 'png', 'gif'].includes(ext);
    }

    /**
     *
     * @param filename nombre del archivo
     * @returns retorna si el archivo es un pdf o no.
     */
    isPdf(filename: string): boolean {
        const ext = filename.split('.').pop().toLowerCase();
        return ext === 'pdf';
    }

    /** Mostrar el archivo de pago */
    mostrarPagoArchivo(filename: string){
        if(this.isImagen(filename)){

        }
        if(this.isPdf(filename)){
            this.pagoService.getPagoArchivo(filename);
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

    getDescriptionTipoPago(tipoPagoid: number): string {
        const tipoPago = this.tipoPago.find(tp => tp.tpagid === tipoPagoid);
        return tipoPago ? tipoPago.tpagnombre : 'Ninguno';
    }

    /**
     *
     * @param pagarchivo Mostrar el archivo imagen de pago
     */
    mostrarPagoArchivoImagen(pagarchivo: any){
        this.showArchivoImagen = true;
        this.pagarchivo = pagarchivo;
    }

    /**
     * Calcula el monto total de estudiantes por materia.
     * @param matid ID de la materia.
     * @returns Total de estudiantes.
     */
    calcularMontoTotal(matid: number): number {
        if (!this.listarPagoEstudianteMateria || !Array.isArray(this.listarPagoEstudianteMateria)) {
            return 0;
        }

        return this.listarPagoEstudianteMateria
            .filter(estudianteInscrito => estudianteInscrito.matid === matid)
            .reduce(
                (total, estudianteInscrito) =>
                    total + parseFloat(estudianteInscrito.pagmonto || '0'),
                0
            );
    }

}

