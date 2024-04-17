import { Component, OnInit } from '@angular/core';
import { Materia } from 'src/app/modules/models/materia';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { MateriaService } from 'src/app/modules/service/data/materia.service';
import { ReporteService } from 'src/app/modules/service/data/reporte.service';
import { DatePipe } from '@angular/common';
import { TipoModulo, TipoEstado } from 'src/app/modules/models/diccionario';
// --------------- Importación de Autenticación
import { AuthService } from 'src/app/services/auth.service';

// --------------- Importación para validaciones
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// --------------- Modelo de Usuario
import { Usuario } from 'src/app/modules/models/usuario';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
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
    templateUrl: './materia-crud.component.html',
    providers: [MessageService],
    styleUrls: ['./materia-crud.component.css']
})
export class MateriaCrudComponent implements OnInit {


    //-----------------Variables para componente materia-------------------//
    listaMaterias: Materia[] = [];
    listaMateriasDesactivos: Materia[] = [];
    listaMateriasDuplicated: Materia[] = [];
    materia: Materia = {};
    submitted: boolean = false;
    materiaDialog: boolean = false;
    eliminarMateriaDialog: boolean = false;
    activarMateriaDialog: boolean = false;
    desactivarMateriaDialog: boolean = false;
    tipoModulo: TipoModulo[] = [];
    tipoModuloSeleccionado: TipoModulo;
    tipoEstado: TipoEstado[] = [];
    tipoEstadoSeleccionado: TipoEstado;
    registroMateria: Materia = {};
    pip = new DatePipe('es-BO');
    opcionMateria: boolean = false;
    loading: boolean = false;
    //-----------------Variables para compoente materia-------------------//

    //----------------Variables para validación----------------//
    materiaForm: FormGroup;
    originalMateriaNombre: any;
    //----------------Variables para validación----------------//

    usuario: Usuario;

    colsTable!: Column[];
    exportColumns!: ExportColumn[];

    constructor(private messageService: MessageService,
                private materiaService: MateriaService,
                private formBuilder: FormBuilder,
                public reporte: ReporteService,
                private spinner: NgxSpinnerService,
                private authService: AuthService,)
                {
                    this.tipoModuloSeleccionado = new TipoModulo(0,"");
                    this.tipoEstadoSeleccionado = new TipoEstado(0,"");
                }

    ngOnInit() {
        this.getPerfilUsuario();
        this.listarMaterias();
        this.tipoModulo = [ new TipoModulo(1, 'PRIMERO'), new TipoModulo(2, 'SEGUNDO'), new TipoModulo(3, 'TERCERO'), new TipoModulo(4, 'OTRO') ];
        this.tipoEstado = [ new TipoEstado(0, 'FINALIZADO'), new TipoEstado(1, 'VIGENTE'), new TipoEstado(2, 'OTRO') ];
        this.asignacionValidaciones();

        this.colsTable = [
            { field: 'matid', header: 'ID materia' },
            { field: 'matnombre', header: 'Nombre de materia' },
            { field: 'matnivel', header: 'Modulo' },
            { field: 'matdesnivel', header: 'Descripción modulo' },
            { field: 'matestado', header: 'Estado del usuario' },
            { field: 'matdescripcion', header: 'Descripción' },
            { field: 'matusureg', header: 'Usuario Registro' },
            { field: 'matfecreg', header: 'Fecha Registro' },
            { field: 'matusumod', header: 'Usuario Modificación' },
            { field: 'matfecmod', header: 'Fecha Modificación' }
        ];

        this.exportColumns = this.colsTable.map((col) => ({ title: col.header, dataKey: col.field }));

    }

    // Método de obtener la lista de materias registradas
    listarMaterias(){
        this.loading = true;
        this.spinner.show();
        this.materiaService.listarMateria().subscribe(
            (result: any) => {
                this.listaMaterias = result;
                this.listaMateriasDuplicated = result;
                this.listaMateriasDesactivos = this.listaMaterias.filter(materia => materia.matestado === 0);
                this.listaMaterias = this.listaMaterias.filter(materia => materia.matestado === 1);
                this.loading = false;
                this.spinner.hide();
            },
            (error: any) => {
                console.error(error);
                this.spinner.hide();
            }
        )
    }


    // Método para asignar las variables de React Form Valid
    asignacionValidaciones() {
        //----- Asignación de la validaciones
        this.materiaForm = this.formBuilder.group({
            mf_id: [''],
            uf_id: [''],
            mf_matnombre: [
                '',
                [Validators.required,
                 Validators.minLength(5),
                ],
                [this.validarNombreMateriaExistente()] // Asynchronous validators
            ],
            mf_matdescripcion: ['', [Validators.required]],
            mf_tipoModulo: ['', [Validators.required]]
        });
    }

    validarNombreMateriaExistente(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
            const nombreMateria = control.value;
            if (!nombreMateria) {
                return of(null);
            }
            const existe = this.listaMateriasDuplicated.some(materia => materia.matnombre === nombreMateria);// Se verifica si algún elemento en la lista de personas tiene el mismo nombre de usuario>
            return of(existe ? { nombreMateriaExiste: true } : null); // Se devuelve un observable que emite un objeto de errores si existe un duplicado, de lo contrario, emite null
        }
    }

    // Obtener datos del perfil del usuario logeado
    getPerfilUsuario() {
        this.authService.getPerfil().subscribe(usuario => {
            this.usuario = usuario[0];
        });
    }

    // Método para abrir p-dialog para el registro de una nueva materia
    abrirNuevo() {
        this.materiaForm.reset();
        this.materia = new Materia();
        this.materiaDialog = true;
        this.opcionMateria = true;
    }
    // Método para ocular el p-dialog
    ocultarDialog() {
        this.materiaDialog = false;
        this.opcionMateria = false;
        // this.messageService.add({ severity: 'warn', summary: 'Cancelado', detail: 'Proceso Cancelado', life: 3000 });
    }
    // Método de obtención de datos y setearlos para modificar materia
    editarMateria(data: any) {
        this.materia = { ...data };
        this.setData();
        this.materiaDialog = true;
        this.opcionMateria = false;
    }
    // Obtener datos para eliminar materia
    eliminarMateria(materia: Materia) {
        this.eliminarMateriaDialog = true;
        this.materia = { ...materia };
    }

    desactivarMateria(materia: Materia) {
        this.desactivarMateriaDialog = true;
        this.materia = { ...materia };
        this.materia.tipo = 2;
    }

    activarMateria(materia: Materia) {
        this.activarMateriaDialog = true;
        this.materia = { ...materia };
        this.materia.tipo = 3;
    }


    // Método de confirmación de eliminación de materia
    confirmarActivarDesactivar() {
        this.materia.matusumod = this.usuario.usuname;
        console.log("materia", this.materia);
        this.materiaService.gestionarMateriaEstado(this.materia).subscribe(
            (result: any) => {
                this.messageService.add({ severity: 'success', summary: 'Exitosa!', detail: 'Estado de la materia modificada exitosamente.', life: 3000 });
                this.listarMaterias();
                this.desactivarMateriaDialog = false;
                this.activarMateriaDialog = false;
                this.materia = {};
            },
            error => {
            console.log("error",error);
            const descripcionError = error.error.message;
                this.messageService.add({severity:'warn', summary:'Error', detail: descripcionError, life: 5000});
            }
        );
    }
    // Obtener datos para el p-dialog
    setData(){
        this.materiaForm.reset();

        // Al cargar los datos para la edición, también guarda el nombre de usuario original
        this.originalMateriaNombre = this.materia.matnombre;

        this.materiaForm.patchValue({
            mf_id: this.materia.matid,
            mf_matnombre: this.materia.matnombre,
            mf_matdescripcion: this.materia.matdescripcion,
            mf_tipoModulo: new TipoModulo(this.materia.matnivel, this.materia.matdesnivel)
        })
         // Ajustar el validador asincrónico para el nombre de usuario solo si es necesario
         const matnombreControl = this.materiaForm.get('mf_matnombre');
         matnombreControl.clearAsyncValidators();
         if (this.originalMateriaNombre) {
             matnombreControl.setAsyncValidators([this.validateMateriaNombreIfChanged.bind(this)]);
         }
         matnombreControl.updateValueAndValidity(); // Asegúrate de actualizar la validez del control
    }
    validateMateriaNombreIfChanged(control: AbstractControl) {
        // La validación se ignora si el valor no ha cambiado
        if (control.value === this.originalMateriaNombre) {
            return of(null);
        } else {
            return this.validarNombreMateriaExistente()(control);
        }
    }
    // Obtener datos para insertar ó modificar materia
    obtenerBody(){
        this.materia = new Materia();
        this.materia.matnombre = this.materiaForm.value.mf_matnombre;
        this.materia.matdescripcion = this.materiaForm.value.mf_matdescripcion;
        this.materia.matnivel = this.materiaForm.value.mf_tipoModulo.codTipoModulo;
        this.materia.matdesnivel = this.materiaForm.value.mf_tipoModulo.desTipoModulo;
        this.materia.matestado = 1;
        this.materia.matestadodescripcion = "";
        this.materia.matusureg = this.usuario.usuname;
        this.materia.matusumod = this.usuario.usuname;
        const body = {...this.materia}
        return body;
    }
    // Función para mandar datos de inserción y modificación
    guardarMateria(){
        if(this.materiaForm.invalid){
            this.messageService.add({ severity: 'error', summary: 'Error en el Registro', detail: 'Por favor, verifica la información ingresada e intenta nuevamente.', life: 3000 });
            return Object.values(this.materiaForm.controls).forEach(control=>{
                control.markAllAsTouched();
                control.markAsDirty();
            })
        }
        this.obtenerBody();
        if (this.opcionMateria) {
            this.materiaService.insertarMateria(this.materia).subscribe(
                (result: any) => {
                    this.messageService.add({ severity: 'success', summary: 'Exitosamente', detail: 'Materia Agregado', life: 3000 });
                    this.listarMaterias();
                    this.materiaDialog = false;
                    this.opcionMateria = false;
                },
                error => { console.log("error",error); this.messageService.add({severity:'warn', summary:'Error', detail:'Algo salio mal, al insertar el Nivel'}); }
            );
        }
        else {
            this.materia.matid = this.materiaForm.value.mf_id;
            this.materiaService.modificarMateria(this.materia).subscribe(
                (result: any) => {
                    this.messageService.add({ severity: 'success', summary: 'Exitosamente', detail: 'Materia Modificado', life: 3000 });
                    this.listarMaterias();
                    this.materiaDialog = false;
                    this.opcionMateria = false;
                },
                error => { console.log("error",error); this.messageService.add({severity:'warn', summary:'Error', detail:'Algo salio mal, al modificar la materia'}); }
            );
        }
    }
    // Función para retornar los colores para el tipo de módulo o nivel
    getSeverity(matdesnivel: string): string {
        switch (matdesnivel) {
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
                doc.setFontSize(16);
                doc.text('Lista de Materias', 14, 30);
                (doc as any).autoTable({
                    columns: this.exportColumns,
                    body: this.listaMateriasDuplicated,
                    theme: 'striped',
                    styles: { fontSize: 8, cellPadding: 3 },
                });
                doc.save('lista_materias.pdf');
            });
        });
    }

    exportExcel() {
        import('xlsx').then((xlsx) => {
            // Define los campos que deseas incluir en la exportación
            const fieldsToExport = [
                'matid',
                'matnombre',
                'matnivel',
                'matdesnivel',
                'matestado',
                'matdescripcion',
                'matusureg',
                'matfecreg',
                'matusumod',
                'matfecmod'
            ];
            const dataToExport = this.listaMateriasDuplicated.map(persona => {
                const filteredData = {};
                fieldsToExport.forEach(field => {
                    filteredData[field] = persona[field] || ''; // Asegura que todos los campos existan, incluso si están vacíos
                });
                return filteredData;
            });
            const worksheet = xlsx.utils.json_to_sheet(dataToExport);
            const workbook = { Sheets: { 'Data': worksheet }, SheetNames: ['Data'] };
            const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
            this.saveAsExcelFile(excelBuffer, 'lista_materias');
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
