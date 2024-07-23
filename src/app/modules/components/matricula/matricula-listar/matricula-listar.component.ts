// --------- Importación principal
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { NgxSpinnerService } from 'ngx-spinner'; // spinner
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // validaciones
import { AbstractControl, AsyncValidatorFn, ValidatorFn } from '@angular/forms'; // validaciones asincronas
import { Observable, of } from 'rxjs';
// --------- Importación servicios
import { AuthService } from 'src/app/modules/service/core/auth.service';
import { MatriculaService } from 'src/app/modules/service/data/matricula.service';
// --------- Importación modelos
import { TipoMatricula } from 'src/app/modules/models/matricula';
import { Usuario } from 'src/app/modules/models/usuario';
import { ExportColumn, Column } from 'src/app/modules/models/exportFile';

@Component({
    templateUrl: './matricula-listar.component.html',
    providers: [MessageService],
    styleUrls: ['../../../../app.component.css']
})
export class MatriculaListarComponent implements OnInit {

        // Variables Tipo Matricula
        listaTipoMatricula: TipoMatricula[] = [];
        listaTipoMatriculaInactivo: TipoMatricula[] = [];
        listaTipoMatriuclaDuplicado: TipoMatricula[] = [];
        tipoMatriculaDialog: boolean = false;
        opcionTipoMatricula: boolean = false;
        activarMatriculaDialog: boolean = false;
        desactivarMatriculaDialog: boolean = false;
        opcionMatricula: boolean = false;
        tipoMatricula = new TipoMatricula();
        // Variables para validación
        tipoMatriculaForm: FormGroup;
        originalNombreMatricula: any;
        // Usuario
        usuario: Usuario;
        // Variables para exportar PDF
        colsTable!: Column[];
        exportColumns!: ExportColumn[];


      //-----------------Variables-------------------//s

    constructor(
                private messageService: MessageService,
                private matriculaService: MatriculaService,
                private spinner: NgxSpinnerService,
                private authService: AuthService,
                private formBuilder: FormBuilder,
                ) { }

    ngOnInit() {

        this.listarTipoMatricula(); // listar tipo de matriculas

        this.getProfileUsuario(); // obtener los valores del usuario logueado

        this.asignacionValidacion(); // se asigna los parametros para la variable de validación

        this.obtenerColumnas(); // obtener Columnas para exportar en excel y pdf la listaTipoMatricula

    }
    obtenerColumnas() {
        this.colsTable = [
            { field: 'tipmatrid', header: 'Cod. Tipo Matricula' },
            { field: 'tipmatrgestion', header: 'Gestión de la matricula' },
            { field: 'tipmatrfecini', header: 'Fecha de inicio' },
            { field: 'tipmatrfecfin', header: 'Fecha de fin' },
            { field: 'tipmatrcosto', header: 'Costo' },
            { field: 'tipmatrestado', header: 'Estado' },
            { field: 'tipmatrdescripcion', header: 'Descripción' }
        ];

        this.exportColumns = this.colsTable.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    asignacionValidacion() {
        // Método para asignar las variables de React Form Valid
        this.tipoMatriculaForm = this.formBuilder.group({
            tipmatrid: [''],
            tipmatrgestion: [
                '',
                [Validators.required,
                 Validators.minLength(5),
                ],
                [this.validarNombreTipoMatriculaExistente()] // validación asincrona
            ],
            tipmatrfecini: ['', [Validators.required]],
            tipmatrfecfin: ['', [Validators.required]],
            tipmatrcosto: ['', [Validators.required, this.noNegativoValidator()]],
            tipmatrdescripcion: ['', [Validators.required]]
        });
    }

    validarNombreTipoMatriculaExistente(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
            const nombreTipoMatricula = control.value;
            if (!nombreTipoMatricula) {
                return of(null);
            }
            // Se verifica si algún elemento en la lista de respaldo tiene el mismo nombre
            const existe = this.listaTipoMatriuclaDuplicado.some(tipo_matricula => tipo_matricula.tipmatrgestion === nombreTipoMatricula);
            // Se devuelve un observable que emite un objeto de errores si existe un duplicado, de lo contrario, emite null
            return of(existe ? { nombreTipoMatriculaExiste: true } : null);
        }
    }

    noNegativoValidator(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
          const esNumero = !isNaN(control.value);
          if (esNumero && control.value < 0) {
            return { 'numeroNegativo': { value: control.value } };
          }
          return null;
        };
    }

    getProfileUsuario() {
        this.authService.getProfile().subscribe(usuario => {
            this.usuario = usuario[0];
        });
    }

    listarTipoMatricula(){
        this.spinner.show();
        this.matriculaService.listarTipoMatricula().subscribe(
            (result: any) => {
                this.listaTipoMatricula = result;
                this.listaTipoMatriuclaDuplicado = this.listaTipoMatricula;
                this.listaTipoMatriculaInactivo = this.listaTipoMatricula.filter(tipoMatricula => tipoMatricula.tipmatrestado === 0);
                this.listaTipoMatricula = this.listaTipoMatricula.filter(tipoMatricula => tipoMatricula.tipmatrestado === 1);
                this.spinner.hide();
            },
            (error: any) => {
                console.error(error);
                this.spinner.hide();
            }
        )
    }

    abrirNuevoTipoMatricula() {
        this.tipoMatriculaDialog = true;
        this.opcionTipoMatricula = true;
    }

    setData(){
        this.tipoMatriculaForm.reset();

        // Al cargar los datos para la edición, también guarda el nombre de usuario original
        this.originalNombreMatricula = this.tipoMatricula.tipmatrgestion;

        this.tipoMatriculaForm.patchValue({
            tipmatrid: this.tipoMatricula.tipmatrid,
            tipmatrgestion: this.tipoMatricula.tipmatrgestion,
            tipmatrfecini: this.tipoMatricula.tipmatrfecini,
            tipmatrfecfin: this.tipoMatricula.tipmatrfecfin,
            tipmatrcosto: this.tipoMatricula.tipmatrcosto,
            tipmatrdescripcion: this.tipoMatricula.tipmatrdescripcion,
        })

        const matrnombreControl = this.tipoMatriculaForm.get('tipmatrgestion');
         matrnombreControl.clearAsyncValidators();
         if (this.originalNombreMatricula) {
            matrnombreControl.setAsyncValidators([this.validateMatriculaNombreIfChanged.bind(this)]);
         }
         matrnombreControl.updateValueAndValidity(); // Asegúrate de actualizar la validez del control
    }

    validateMatriculaNombreIfChanged(control: AbstractControl) {
        if (control.value === this.originalNombreMatricula) {
            return of(null);
        } else {
            return this.validarNombreTipoMatriculaExistente()(control);
        }
    }

    editarTipoMatricula(data: any) {
        this.tipoMatricula = { ...data };
        this.setData();
        this.tipoMatriculaDialog = true;
        this.opcionTipoMatricula = false;
    }

    guardarTipoMatricula() {
        if(this.tipoMatriculaForm.invalid){
            this.messageService.add({ severity: 'error', summary: 'Ups! error de registro', detail: 'Por favor, verifica la información ingresada e intenta nuevamente.', life: 5000 });
            return Object.values(this.tipoMatriculaForm.controls).forEach(control=>{
                control.markAllAsTouched();
                control.markAsDirty();
            })
        }
        if(this.tipoMatriculaForm.valid){

            // window.alert("Hola mira mis datos: " + JSON.stringify(this.tipoMatriculaForm.value));

            this.obtenerBody();

            if(this.opcionTipoMatricula){
                this.matriculaService.insertarTipoMatricula(this.tipoMatricula).subscribe(
                    (result: any) => {
                        // console.log("result", result);
                        this.messageService.add({ severity: 'success', summary: 'Registro correcto', detail: 'Matricula agregada correctamente en el sistema', life: 5000 });
                        this.listarTipoMatricula();
                        this.tipoMatriculaDialog = false;
                        this.opcionTipoMatricula = false;
                        this.tipoMatriculaForm.reset();
                    },
                    (error: any) => {
                    console.log("error",error);
                        this.messageService.add({severity:'warn', summary:'Ups! error de registro', detail:'Algo salio mal al agregar la matricula', life: 5000});
                    }
                );
            } else{
                this.matriculaService.modificarTipoMatricula(this.tipoMatricula).subscribe(
                    (result: any) => {
                        this.messageService.add({ severity: 'success', summary: 'Registro correcto', detail: 'Matricula modificado correctamente en el sistema', life: 5000 });
                        this.listarTipoMatricula();
                        this.tipoMatriculaDialog = false;
                        this.opcionMatricula = false;
                        this.tipoMatriculaForm.reset();
                    },
                    (error: any) => {
                    console.log("error",error);
                        this.messageService.add({severity:'warn', summary:'Error', detail:'Algo salio mal, al modificar la matricula'});
                    }
                );
            }
        }

    }

    ocultarDialog() {
        this.tipoMatriculaDialog = false;
        this.opcionMatricula = false;
        this.messageService.add({ severity: 'info', summary: 'Cancelar', detail: 'Operación cancelada', life: 3000 });
        this.tipoMatriculaForm.reset();
    }

    obtenerBody(){
        this.tipoMatricula.tipmatrgestion = this.tipoMatriculaForm.value.tipmatrgestion;
        this.tipoMatricula.tipmatrfecini = this.tipoMatriculaForm.value.tipmatrfecini;
        this.tipoMatricula.tipmatrfecfin = this.tipoMatriculaForm.value.tipmatrfecfin;
        this.tipoMatricula.tipmatrcosto = this.tipoMatriculaForm.value.tipmatrcosto;
        this.tipoMatricula.tipmatrusureg = this.usuario.usuname;
        this.tipoMatricula.tipmatrusumod = this.usuario.usuname;
        this.tipoMatricula.tipmatrdescripcion = this.tipoMatriculaForm.value.tipmatrdescripcion;
        const body = {...this.tipoMatricula}
        return body;
    }

    desactivarMatricula(data: TipoMatricula) {
        this.desactivarMatriculaDialog = true;
        this.tipoMatricula = { ...data };
        this.tipoMatricula.tipo = 2;
    }

    activarMatricula(data: TipoMatricula) {
        this.activarMatriculaDialog = true;
        this.tipoMatricula = { ...data };
        this.tipoMatricula.tipo = 3;
    }

    confirmarActivarDesactivar() {
        this.tipoMatricula.tipmatrusumod = this.usuario.usuname;
        this.matriculaService.gestionarTipoMatriculaEstado(this.tipoMatricula).subscribe(
            (result: any) => {
                this.messageService.add({ severity: 'success', summary: 'Registro correcto', detail: 'Estado del tipo matricula modificada correctamente en el sistema', life: 5000 });
                this.listarTipoMatricula();
                this.activarMatriculaDialog = false;
                this.desactivarMatriculaDialog = false;
                this.tipoMatricula = new TipoMatricula();
            },
            error => {
            console.log("error",error);
                this.messageService.add({severity:'warn', summary:'Error', detail: 'Algo salio mal.', life: 5000});
            }
        );
    }

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















}
