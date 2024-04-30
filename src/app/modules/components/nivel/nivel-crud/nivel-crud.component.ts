import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ReporteService } from 'src/app/modules/service/data/reporte.service';
import { Nivel } from 'src/app/modules/models/nivel';
import { NivelService } from 'src/app/modules/service/data/nivel.service';
import { TipoModulo } from 'src/app/modules/models/diccionario';
import { TipoNivelEstado } from 'src/app/modules/models/diccionario';
import { DatePipe } from '@angular/common';
// --------------- Importación de Autenticación
import { AuthService } from 'src/app/services/auth.service';

// --------------- Importación para validaciones
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// --------------- Modelo de Usuario
import { Usuario } from 'src/app/modules/models/usuario';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import * as FileSaver from 'file-saver';

interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}

@Component({
    templateUrl: './nivel-crud.component.html',
    providers: [MessageService],
    styleUrls: ['../../../../app.component.css']
})
export class NivelCrudComponent implements OnInit {


    //-----------------Variables-Nivel-------------------//

    listaNiveles: Nivel[] = [];
    listaNivelesInactivos: Nivel[] = [];
    listaNivelesDuplicated: Nivel[] = [];
    nivel: Nivel = {};
    submitted: boolean = false;
    nivelDialog: boolean = false;
    eliminarNivelDialog: boolean = false;
    activarNivelDialog: boolean = false;
    desactivarNivelDialog: boolean = false;
    tipoModulo: TipoModulo[] = [];
    tipoModuloSeleccionado: TipoModulo;
    tipoNivelEstado: TipoNivelEstado[] = [];
    tipoNivelEstadoSeleccionado: TipoNivelEstado;
    registroNivel: Nivel = {};
    pip = new DatePipe('es-BO');
    opcionNivel: boolean = false;
    loading: boolean = false;
    //-----------------Variables-Nivel-------------------//
    es: any;

    //----------------Variables para validación----------------//
    nivelForm: FormGroup;
    //----------------Variables para validación----------------//
    usuario: Usuario;

    colsTable!: Column[];
    exportColumns!: ExportColumn[];

    originalNivelNombre: any;
    constructor(
                private messageService: MessageService,
                public reporte: ReporteService,
                public nivelService: NivelService,
                private authService: AuthService,
                private spinner: NgxSpinnerService,
                private formBuilder: FormBuilder,)
                {
                    this.tipoModuloSeleccionado = new TipoModulo(0,"");
                    this.tipoNivelEstadoSeleccionado = new TipoNivelEstado(0,"");
                }

    ngOnInit() {
        this.getPerfilUsuario();

        this.listarNivel();

        this.asignacionValidaciones();

        this.tipoModulo = [
            new TipoModulo(1, 'PRIMERO'),
            new TipoModulo(2, 'SEGUNDO'),
            new TipoModulo(3, 'TERCERO'),
            new TipoModulo(4, 'OTRO'),
        ];

        this.tipoNivelEstado = [
            new TipoNivelEstado(0, 'FINALIZADO'),
            new TipoNivelEstado(1, 'VIGENTE'),
            new TipoNivelEstado(2, 'OTRO')
        ]

        this.es = {
            firsDayOfWeek: 1,
            monthNames: ["Enero","Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
            monthNamesShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
            dayNames: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
            dayNamesShort: ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
            dayNamesMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
            today: 'Hoy',
            clear: 'Borrar'
        };

        this.colsTable = [
            { field: 'curid', header: 'ID nivel' },
            { field: 'curnombre', header: 'Nombre de nivel' },
            { field: 'curdescripcion', header: 'Descripción del nivel' },
            { field: 'curnivel', header: 'Id nivel' },
            { field: 'curdesnivel', header: 'nivel' },
            { field: 'curfchini', header: 'Fecha inicio' },
            { field: 'curfchfin', header: 'Fecha fin' },
            { field: 'curestadodescripcion', header: 'Descripcion' },
            { field: 'curusureg', header: 'Usuario Registro' },
            { field: 'curfecreg', header: 'Fecha Registro' },
            { field: 'curusumod', header: 'Usuario Modificación' },
            { field: 'curfecmod', header: 'Fecha Modificación' }
        ];

        this.exportColumns = this.colsTable.map((col) => ({ title: col.header, dataKey: col.field }));

    }

   //---------------Funciones-Nivel---------------//

    // Método para asignar las variables de React Form Valid
    asignacionValidaciones() {
        //----- Asignación de la validaciones
        this.nivelForm = this.formBuilder.group({
            nf_id: [''],
            nf_curnombre: [
                '',
                [Validators.required,
                 Validators.minLength(5),
                ],
                [this.validarNombreNivelExistente()] // Asynchronous validators
            ],
            nf_curdescripcion: ['', [Validators.required]],
            nf_tipoModulo: ['', [Validators.required]],
            nf_curfchini: ['', [Validators.required]],
            nf_curfchfin: ['', [Validators.required]]
        });
    }
    // Obtener datos del perfil del usuario logeado
    getPerfilUsuario() {
        this.authService.getPerfil().subscribe(usuario => {
            this.usuario = usuario[0];
        });
    }
    validarNombreNivelExistente(): AsyncValidatorFn { // Método para crear un validador asíncrono para verificar si un nombre de usuario ya existe
        return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {         // Se retorna una función que actúa como validador asíncrono
            const nombreNivel = control.value;
            if (!nombreNivel) {
                return of(null);
            }
            const existe = this.listaNivelesDuplicated.some(nivel => nivel.curnombre === nombreNivel);
            return of(existe ? { nombreNivelExiste: true } : null);
        }
    }
    // Método de listar los niveles
    listarNivel(){
        this.loading = true;
        this.spinner.show();
        this.nivelService.listarNivel().subscribe(
            (result: any) => {
                this.listaNiveles = result;
                this.listaNivelesDuplicated = result;
                this.listaNivelesInactivos = this.listaNiveles.filter(nivel => nivel.curestado === 0);
                this.listaNiveles = this.listaNiveles.filter(nivel => nivel.curestado === 1);
                this.loading = false;
                this.spinner.hide();
            },
            (error: any) => {
                console.error(error);
                this.loading = false;
                this.spinner.hide();
            }

        )
    }

    abrirNuevo() {
        this.nivelForm.reset();
        // this.nivel = {};
        // this.tipoModuloSeleccionado = new TipoModulo(0,"");
        // this.tipoNivelEstadoSeleccionado = new TipoNivelEstado(0,"");
        this.nivelDialog = true;
        this.opcionNivel = true;
    }
    ocultarDialog() {
        this.nivelDialog = false;
        this.opcionNivel = false;
        this.activarNivelDialog = false;
        this.desactivarNivelDialog = false;
    }
    editarNivel(data: any) {
        this.nivel = { ...data };
        this.setData();
        this.nivelDialog = true;
        this.opcionNivel = false;
    }
    eliminarNivel(nivel: Nivel) {
        this.eliminarNivelDialog = true;
        this.nivel = { ...nivel };
    }

    activarNivel(nivel: Nivel) {
        this.activarNivelDialog = true;
        this.nivel = { ...nivel };
        this.nivel.tipo = 3;
    }

    desactivarNivel(nivel: Nivel) {
        this.desactivarNivelDialog = true;
        this.nivel = { ...nivel };
        this.nivel.tipo = 2;
    }

    confirmarEliminar() {
        // console.log("confirmarEliminar: ", this.nivel)
        const criterio = {
            curid: this.nivel.curid
        }
        // console.log("criterio: ", criterio)
        this.nivelService.eliminarNivel(criterio).subscribe(
            (result: any) => {
                this.messageService.add({ severity: 'success', summary: 'Exitosa!', detail: 'Nivel Eliminado', life: 3000 });
                this.listarNivel();
                this.eliminarNivelDialog = false;
                this.nivel = {};
            },
            error => {
            console.log("error",error);
                this.messageService.add({ severity: 'warn', summary: 'Ups! error.', detail: 'Algo salio mal.', life: 3000 });
            }
        );
    }
    confirmarActivarDesactivar() {
        // console.log("confirmarActivarDesactivar: ", this.nivel)
        this.nivel.curusumod = this.usuario.usuname;
        this.nivelService.gestionarNivelEstado(this.nivel).subscribe(
            (result: any) => {
                this.messageService.add({ severity: 'success', summary: 'Exitosa!', detail: 'Estado de nivel modificado correctamente.', life: 3000 });
                this.listarNivel();
                this.eliminarNivelDialog = false;
                this.activarNivelDialog = false;
                this.desactivarNivelDialog = false;
                this.nivel = {};
            },
            error => {
            console.log("error",error);
            this.messageService.add({ severity: 'warn', summary: 'Ups! error.', detail: 'Algo salio mal.', life: 3000 });
            }
        );
    }

    curfechaini: any
    curfechafin: any
    setData(){
        this.originalNivelNombre = this.nivel.curnombre;

        this.nivelForm.reset();
        this.nivelForm.patchValue({
            nf_id: this.nivel.curid,
            nf_curnombre: this.nivel.curnombre,
            nf_curdescripcion: this.nivel.curdescripcion,
            nf_tipoModulo: new TipoModulo(this.nivel.curnivel, this.nivel.curdesnivel),
            nf_curfchini: this.nivel.curfchini,
            nf_curfchfin: this.nivel.curfchfin
        })
        const nivelnombreControl = this.nivelForm.get('nf_curnombre');
        nivelnombreControl.clearAsyncValidators();
        if (this.originalNivelNombre) {
            nivelnombreControl.setAsyncValidators([this.validateNivelNombreIfChanged.bind(this)]);
        }
        nivelnombreControl.updateValueAndValidity();
    }
    validateNivelNombreIfChanged(control: AbstractControl) {
        if (control.value === this.originalNivelNombre) {
            return of(null);
        } else {
            return this.validarNombreNivelExistente()(control);
        }
    }
    obtenerBody(){

        this.nivel = new Nivel();
        this.nivel.curid = this.nivelForm.value.nf_id;
        this.nivel.curnombre = this.nivelForm.value.nf_curnombre;
        this.nivel.curdescripcion = this.nivelForm.value.nf_curdescripcion;
        this.nivel.curnivel = this.nivelForm.value.nf_tipoModulo.codTipoModulo;
        this.nivel.curdesnivel = this.nivelForm.value.nf_tipoModulo.desTipoModulo;
        this.nivel.curfchini = this.nivelForm.value.nf_curfchini;
        this.nivel.curfchfin = this.nivelForm.value.nf_curfchfin;
        this.nivel.curestado = 1;
        this.nivel.curestadodescripcion = "";
        this.nivel.curusureg = this.usuario.usuname;
        this.nivel.curusumod = this.usuario.usuname;
        // console.log("Obtener Body: ", this.nivel);
        const body = {...this.nivel}
        return body;
    }
    obtenerEstadoSeverity(estado: number): string {
        switch (estado) {
            case 0:
                return 'danger';
            case 1:
                return 'success';
            default:
                return 'info';
        }
    }
    obtenerNivelSeverity(estado: number): string {
        switch (estado) {
            case 1:
                return 'warning';
            case 2:
                return 'info';
            case 3:
                return 'danger';
            default:
                return 'info';
        }
    }
    guardarNivel(){
        if(this.nivelForm.invalid){
            this.messageService.add({ severity: 'error', summary: 'Error en el Registro', detail: 'Por favor, verifica la información ingresada e intenta nuevamente.', life: 3000 });
            return Object.values(this.nivelForm.controls).forEach(control=>{
                control.markAllAsTouched();
                control.markAsDirty();
            })
        }
        this.obtenerBody();
        if (this.opcionNivel) {
            // console.log("Add nivel: ", this.nivel);
            this.nivelService.insertarNivel(this.nivel).subscribe(
                (result: any) => {
                    this.messageService.add({ severity: 'success', summary: 'Exitosamente', detail: 'Nivel Agregado', life: 3000 });
                    this.listarNivel();
                    this.nivelDialog = false;
                    this.opcionNivel = false;
                },
                error => {
                console.log("error",error);
                    this.messageService.add({severity:'warn', summary:'Error', detail:'Algo salio mal, al insertar el Nivel'});
                }
            );
        }
        else{
            this.nivel.curid = this.nivelForm.value.nf_id;
            // console.log("Mod nivel: ", this.nivel);
            this.nivelService.modificarNivel(this.nivel).subscribe(
                (result: any) => {
                    this.messageService.add({ severity: 'success', summary: 'Exitosamente', detail: 'Nivel Modificado', life: 3000 });
                    this.listarNivel();
                    this.nivelDialog = false;
                    this.opcionNivel = false;
                },
                error => {
                console.log("error",error);
                    this.messageService.add({severity:'warn', summary:'Error', detail:'Algo salio mal, al modificar el Nivel'});
                }
            );
        }
    }
    // Función para retornar los colores para el tipo de módulo o nivel
    getSeverity(nivdesnivel: string): string {
        switch (nivdesnivel) {
        case 'PRIMERO':
            return 'danger';
        case 'SEGUNDO':
            return 'info';
        case 'TERCERO':
            return 'warning';
        default:
            return 'success';
        }
    }
    obtenerSeverityEstado(estado: number): string {
        switch (estado) {
            case 1:
                return 'success';
            case 0:
                return 'danger';
            default:
                return 'info';
        }
    }

    obtenerDescripcionEstado(estado: number): string {
        switch (estado) {
            case 1:
                return 'Activo';
            case 0:
                return 'Inactivo';
            default:
                return 'Ninguno';
        }
    }
    //---------------Funciones-Nivel---------------//
    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }

    exportPdf() {
        import('jspdf').then(jsPDF => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default('l', 'pt', 'a4');
                doc.setFontSize(16); // Tamaño de la fuente
                doc.text('Lista de Niveles', 14, 30); // Agrega texto en la posición x = 14, y = 30
                (doc as any).autoTable({
                    columns: this.exportColumns,
                    body: this.listaNivelesDuplicated,
                    theme: 'striped',  // Puedes elegir otros temas como 'plain', 'striped' o 'grid'
                    styles: { fontSize: 8, cellPadding: 3 },  // Ajusta el tamaño de fuente y el padding para acomodar más datos
                });
                doc.save('lista_nivel.pdf');
            });
        });
    }

    exportExcel() {
        import('xlsx').then((xlsx) => {
            const fieldsToExport = [
                'curid',
                'curnombre',
                'curdescripcion',
                'curnivel',
                'curdesnivel',
                'curfchini',
                'curfchfin',
                'curestadodescripcion',
                'curusureg',
                'curfecreg',
                'curusumod',
                'curfecmod'
            ];
            const dataToExport = this.listaNivelesDuplicated.map(nivel => {
                const filteredData = {};
                fieldsToExport.forEach(field => {
                    filteredData[field] = nivel[field] || ''; // Asegura que todos los campos existan, incluso si están vacíos
                });
                return filteredData;
            });
            const worksheet = xlsx.utils.json_to_sheet(dataToExport);
            const workbook = { Sheets: { 'Data': worksheet }, SheetNames: ['Data'] };
            const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
            this.saveAsExcelFile(excelBuffer, 'lista_nivel');
        });
    }

    saveAsExcelFile(buffer: any, fileName: string): void {
        let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        let EXCEL_EXTENSION = '.xlsx';
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE
        });
        FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    }
}
