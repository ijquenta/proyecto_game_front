import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
// Service
import { UsuarioService } from 'src/app/modules/service/data/usuario.service';
import { AuthService } from 'src/app/services/auth.service';
import { PersonaService } from 'src/app/modules/service/data/persona.service';
import { UploadService } from 'src/app/modules/service/data/upload.service';
// Modelos
import { Persona, PersonaExpanded } from 'src/app/modules/models/persona';
import { TipoPais, TipoCiudad, TipoEstadoCivil, TipoGenero, TipoDocumento } from 'src/app/modules/models/diccionario';
import { Usuario } from 'src/app/modules/models/usuario';
// For validations
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { FileUpload } from 'primeng/fileupload';
import { NgxSpinnerService } from 'ngx-spinner';
import * as FileSaver from 'file-saver';
import { environment } from 'src/environments/environment';


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
    templateUrl: './usuario-persona.component.html',
    providers: [MessageService],
    styleUrls: ['./usuario-persona.component.css']
})
export class UsuarioPersonaComponent implements OnInit {
    // Variable from Validations
    @ViewChild('fileUpload') fileUpload: FileUpload;
    personaForm: FormGroup;
    // Variables
    persona: PersonaExpanded;
    personas: PersonaExpanded[] = [];
    personasDuplicated: PersonaExpanded[] = [];
    elements: PersonaExpanded[];
    listaPersona: PersonaExpanded[] = [];
    personaRegistro: PersonaExpanded;
    Personas: Persona[] = [];
    personaRegistroNuevo: Persona;
    personaRegistroModificar: Persona;
    person: Persona;
    // Variables tipo
    TipoPais: TipoPais[] = [];
    TipoPaisSeleccionado: TipoPais;
    TipoPaisSeleccionado2: TipoPais;
    TipoCiudad: TipoCiudad[] = [];
    TipoCiudadRespaldo: TipoCiudad[] = [];
    TipoCiudadSeleccionado: TipoCiudad;
    TipoEstadoCivil: TipoEstadoCivil[] = [];
    TipoEstadoCivilSeleccionado: TipoEstadoCivil;
    TipoGenero: TipoGenero[] = [];
    TipoGeneroSeleccionado: TipoGenero;
    TipoDocumento: TipoDocumento[] = [];
    TipoDocumentoSeleccionado: TipoDocumento;
    // Otras variables
    imagenName: any;
    eliminarPersonaDialog: boolean = false;
    activarPersonaDialog: boolean = false;
    errors: any;
    personaDialog: boolean = false;
    personaNuevoDialog: boolean = false;
    optionDialog: boolean = false;
    id: any;
    deleteProductDialog: boolean = false;
    deleteProductsDialog: boolean = false;
    submitted: boolean = false;
    submittedMod: boolean = false;
    cols: any[] = [];
    statuses: any[] = [];
    rowsPerPageOptions = [5, 10, 20];
    camposVacios: boolean = false;
    value!: string;
    tipoUpdate: number;
    usuario: Usuario;
    loading: boolean = false;
    originalEvent: Event;
    archivos: any = {};
    nombreArchivo: any;

    colsTable!: Column[];
    exportColumns!: ExportColumn[];
    totalRecords!: number;
    selectAll: boolean = false;
    selectedCustomers!: any[];

    apiUrl = environment.API_URL_FOTO_PERFIL;

    constructor(
        public usuarioService: UsuarioService,
        private messageService: MessageService,
        public personaService: PersonaService,
        private uploadService: UploadService,
        private authService: AuthService,
        private formBuilder: FormBuilder,
        private spinner: NgxSpinnerService
    ) {}
    ngOnInit() {

        this.colsTable = [
            { field: 'pernomcompleto', header: 'Nombre Completo' },
            { field: 'pernombres', header: 'Nombres' },
            { field: 'perapepat', header: 'Apellido Paterno' },
            { field: 'perapemat', header: 'Apellido Materno' },
            { field: 'perid', header: 'ID' },
            { field: 'tipodocnombre', header: 'Tipo de Documento' },
            { field: 'pernrodoc', header: 'Número de Documento' },
            { field: 'generonombre', header: 'Género' },
            { field: 'perestado', header: 'Estado' },
            { field: 'perusureg', header: 'Usuario Registro' },
            { field: 'perfecreg', header: 'Fecha Registro' },
            { field: 'perusumod', header: 'Usuario Modificación' },
            { field: 'perfecmod', header: 'Fecha Modificación' }
        ];

        this.exportColumns = this.colsTable.map((col) => ({ title: col.header, dataKey: col.field }));

        this.fListarPersonas();
        this.fLlenarTipoCombo();
        this.statuses = [
            { label: 'Activo', value: 0 },
            { label: 'Inactivo', value: 1 },
        ];
        this.authService.getPerfil().subscribe(user => {
            this.usuario = user[0];
        });
        this.personaForm = this.formBuilder.group({
            pf_id: [''],
            pf_nombres: ['', [Validators.required]],
            pf_apePat: ['', [Validators.required]],
            pf_apeMat: [''],
            pf_tipDoc: ['',[Validators.required]],
            pf_nroDoc: [{ value: '', disabled: false }, [Validators.required], [this.validarDocumentoExistente()]],
            pf_fecNac: ['', [Validators.required], [this.validarEdadMinima()]],
            pf_tipGen: ['', [Validators.required]],
            pf_direc: ['', [Validators.required]],
            pf_email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
            pf_celular: ['', [Validators.required]],
            pf_telefono: [''],
            pf_tipoEstCivil: ['', [Validators.required]],
            pf_tipPais: ['', [Validators.required]],
            pf_tipCiudad: ['', [Validators.required]],
        });

        this.loading = true;
    }

    validarEdadMinima(): AsyncValidatorFn {
        return (control: AbstractControl): Promise<ValidationErrors | null> => {
          return new Promise((resolve) => {
            const fechaNacimientoStr: string = control.value; // Obtiene la fecha de nacimiento como una cadena de texto
            const fechaNacimiento: Date = new Date(fechaNacimientoStr); // Parsea la fecha de nacimiento a un objeto de fecha
            if (!fechaNacimiento || isNaN(fechaNacimiento.getTime())) {
              resolve({ formatoFechaInvalido: true }); // Devuelve un objeto de error indicando que el formato de fecha es inválido
            }
            if (fechaNacimiento.getFullYear() > 2009) { // Comprueba si el año de nacimiento es menor a 2009
              resolve({ edadMinima: true }); // Devuelve un objeto de error indicando que la edad es menor que 15 años
            }
            resolve(null); // Si la fecha cumple con los requisitos, devuelve null (sin errores)
          });
        };
    }

    validarDocumentoExistente(): AsyncValidatorFn { // Método para crear un validador asíncrono para verificar si un número de documento ya existe
        this.fListarPersonas();// Se llama al método para obtener la lista de personas
        return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {         // Se retorna una función que actúa como validador asíncrono
            const numeroDocumento = control.value; // Se obtiene el valor del control de formulario, que representa el número de documento ingresado por el usuario
            if (!numeroDocumento) {// Si el número de documento está vacío, no se realiza ninguna validación
                return of(null); // Se devuelve un observable que emite null
            }
            const existe = this.personasDuplicated.some(persona => persona.pernrodoc === numeroDocumento);// Se verifica si algún elemento en la lista de personas tiene el mismo número de documento
            return of(existe ? { documentoExistente: true } : null); // Se devuelve un observable que emite un objeto de errores si existe un duplicado, de lo contrario, emite null
    };
}

    fListarPersonas() {
        this.spinner.show();
        this.loading = true;
        this.personaService.ListarPersona().subscribe(
            (result: any) => {
                this.elements = result;
                this.personas = this.elements.map(item => this.fOrganizarDatosPersona(item));
                this.personasDuplicated = this.personas;
                this.loading = false;
                this.spinner.hide();
            },
            (error: any) => {
                this.messageService.add({ severity: 'error', summary: 'Problema', detail: 'Ocurrío un error en el recuperar información del sistema.', life: 3000 });
                this.loading = false;
                this.spinner.hide();
            }
        );
    }

    fOrganizarDatosPersona(data: any): PersonaExpanded {
        const persona = new PersonaExpanded();
        persona.tipo = data.tipo;
        persona.perid = data.perid;
        persona.pernomcompleto = data.pernomcompleto;
        persona.pernombres = data.pernombres;
        persona.perapepat = data.perapepat;
        persona.perapemat = data.perapemat;
        persona.pertipodoc = data.pertipodoc;
        persona.tipodocnombre = data.tipodocnombre;
        persona.pernrodoc = data.pernrodoc;
        if(data.perfecnac == null) {
            persona.perfecnac = data.perfecnac;
        }
        if(data.perfecnac != null ){
            persona.perfecnac = this.convertirAFecha(data.perfecnac);
        }
        persona.pergenero = data.pergenero;
        persona.generonombre = data.generonombre;
        persona.perfoto = data.perfoto;
        persona.perusureg = data.perusureg;
        persona.perobservacion = data.perobservacion;
        persona.perfecreg = data.perfecreg;
        persona.perusumod = data.perusumod;
        persona.perfecmod = data.perfecmod;
        persona.perestado = data.perestado;
        persona.usuid = data.usuid;
        persona.usuname = data.usuname;
        persona.usuemail = data.usuemail;
        persona.datos.push({
            percod: data.perid,
            perdirec: data.perdirec,
            peremail: data.peremail,
            percelular: data.percelular,
            pertelefono: data.pertelefono,
            perestcivil: data.perestcivil,
            estadocivilnombre: data.estadocivilnombre,
            perpais: data.perpais,
            paisnombre: data.paisnombre,
            perciudad: data.perciudad,
            ciudadnombre: data.ciudadnombre,
        });
        return persona;
    }

    fLlenarTipoCombo() {
        this.personaService.getTipoCiudad().subscribe((data: any) => {
            this.TipoCiudad = data;
            this.TipoCiudadRespaldo = data;
        });
        this.personaService.getTipoPais().subscribe((data: any) => {
            this.TipoPais = data;
        });
        this.personaService.getTipoDocumento().subscribe((data: any) => {
            this.TipoDocumento = data;
        });
        this.personaService.getTipoGenero().subscribe((data: any) => {
            this.TipoGenero = data;
        });
        this.personaService.getTipoEstadoCivil().subscribe((data: any) => {
            this.TipoEstadoCivil = data;
        });
    }

    ListarPersonas() {
        this.personaService.ListarPersona().subscribe((data: any) => {
            this.Personas = data;
        });
    }

    onChangeTipoPais(data: any) {
        this.TipoCiudad = this.TipoCiudadRespaldo;
        this.id = data.value.paisid;
        this.TipoCiudad = this.TipoCiudad.filter(ciudad => ciudad.paisid === this.id);
    }

    modificarPersona(data: PersonaExpanded) {
        this.fLlenarTipoCombo();
        this.persona = { ...data };
        this.optionDialog = false;
        this.personaNuevoDialog = true;
        this.personaForm.get('pf_nroDoc')?.disable();
        this.personaForm.reset();
        this.personaForm.patchValue({
            pf_id: this.persona.perid,
            pf_nombres: this.persona.pernombres,
            pf_apePat: this.persona.perapepat,
            pf_apeMat: this.persona.perapemat,
            pf_tipDoc: new TipoDocumento(this.persona.pertipodoc, this.persona.tipodocnombre),
            pf_nroDoc: this.persona.pernrodoc,
            pf_fecNac: new Date(this.persona.perfecnac),
            pf_tipGen: new TipoGenero(this.persona.pergenero, this.persona.generonombre),
            pf_direc: this.persona.datos[0].perdirec,
            pf_email: this.persona.datos[0].peremail,
            pf_celular: this.persona.datos[0].percelular,
            pf_telefono: this.persona.datos[0].pertelefono,
            pf_tipoEstCivil: new TipoEstadoCivil(this.persona.datos[0].perestcivil, this.persona.datos[0].estadocivilnombre),
            pf_tipPais: new TipoPais(this.persona.datos[0].perpais, this.persona.datos[0].paisnombre),
            pf_tipCiudad: new TipoCiudad(this.persona.datos[0].perciudad, this.persona.datos[0].ciudadnombre, this.persona.datos[0].perpais)
        });
    }

    cargarArchivos(currentFiles: File[]): void {
        if (currentFiles) {
            const formData = new FormData();
            for (let i = 0; i < currentFiles.length; i++) {
                const file: File = currentFiles[i];
                const nombreArchivoSinEspacios = file.name.replace(/\s+/g, '');
                const cleanedFilename = nombreArchivoSinEspacios.replace(/[^\w.-]/g, '');
                this.nombreArchivo = 'fperfil' + '_' + cleanedFilename;
                formData.append('files[]', file, this.nombreArchivo);
            }
            this.spinner.show();
            this.uploadService.uploadFilesFotoPerfil(formData).subscribe(
                (data: any) => {
                    this.fileUpload.clear();
                    this.messageService.add({ severity: 'success', summary: 'Registro de Imagen!', detail: 'La imagen se registró existosamente en el sistema.', life: 3000 });
                    this.spinner.hide();
                },
                (error: any) => {
                    console.error('Error en la carga:', error);
                    this.fileUpload.clear();
                    this.messageService.add({ severity: 'error', summary: '¡Error!', detail: 'La imagen no se registró en el sistema.', life: 3000 });
                    this.spinner.hide();
                }
            );
        } else {
            console.warn('No se seleccionaron archivos.');
        }
    }

    enviarFormulario() {

        if (this.optionDialog) {
            if(this.personaForm.invalid){
                this.messageService.add({ severity: 'error', summary: 'Error en el Registro', detail: 'Por favor, verifica la información ingresada e intenta nuevamente.', life: 3000 });
                return Object.values(this.personaForm.controls).forEach(control=>{
                    control.markAllAsTouched();
                    control.markAsDirty();
                })
            }
            if (this.archivos?.currentFiles && this.personaForm.valid) {
                this.cargarArchivos(this.archivos.currentFiles);
                this.personaRegistroNuevo = new Persona();
                this.personaRegistroNuevo.tipo = 1;
                this.personaRegistroNuevo.perid = null;
                this.personaRegistroNuevo.perusureg = this.usuario.usuname;
                this.personaRegistroNuevo.perapepat = this.personaForm.value.pf_apePat;
                this.personaRegistroNuevo.perapemat = this.personaForm.value.pf_apeMat;
                this.personaRegistroNuevo.pernombres = this.personaForm.value.pf_nombres;
                this.personaRegistroNuevo.pernrodoc = this.personaForm.value.pf_nroDoc;
                this.personaRegistroNuevo.perfecnac = this.personaForm.value.pf_fecNac;
                this.personaRegistroNuevo.percelular = this.personaForm.value.pf_celular;
                this.personaRegistroNuevo.pertelefono = this.personaForm.value.pf_telefono;
                this.personaRegistroNuevo.peremail = this.personaForm.value.pf_email;
                this.personaRegistroNuevo.perdirec = this.personaForm.value.pf_direc;
                this.personaRegistroNuevo.perfoto = this.nombreArchivo;
                this.personaRegistroNuevo.perestcivil = this.personaForm.value.pf_tipoEstCivil.estadocivilid;
                this.personaRegistroNuevo.estadocivilnombre = this.personaForm.value.pf_tipoEstCivil.estadocivilnombre;
                this.personaRegistroNuevo.pertipodoc = this.personaForm.value.pf_tipDoc.tipodocid;
                this.personaRegistroNuevo.tipodocnombre = this.personaForm.value.pf_tipDoc.tipodocid;
                this.personaRegistroNuevo.pergenero = this.personaForm.value.pf_tipGen.generoid;
                this.personaRegistroNuevo.generonombre = this.personaForm.value.pf_tipGen.generonombre;
                this.personaRegistroNuevo.perpais = this.personaForm.value.pf_tipPais.paisid;
                this.personaRegistroNuevo.paisnombre = this.personaForm.value.pf_tipPais.paisnombre;
                this.personaRegistroNuevo.perciudad = this.personaForm.value.pf_tipCiudad.ciudadid;
                this.personaRegistroNuevo.ciudadnombre = this.personaForm.value.pf_tipCiudad.ciudadnombre;
                this.loading = true;
                this.personaService.gestionarPersona(this.personaRegistroNuevo).subscribe(
                    (data: any) => {
                        this.personaNuevoDialog = false;
                        this.optionDialog = false;
                        this.messageService.add({ severity: 'success', summary: 'Registro Correcto!', detail: 'La persona se registró correctamente en el sistema.', life: 3000 });
                        this.fListarPersonas();
                        this.archivos.currentFiles.length = 0;
                        this.loading = false;
                    },
                    (error: any) => {
                        console.error("Error: ", error['message']);
                        this.messageService.add({ severity: 'error', summary: 'Problema', detail: 'Ocurrío un error en el registro de persona, verifique los campos ingresados.', life: 3000 });
                        this.loading = false;
                    }
                );
            }
            else{
                this.messageService.add({ severity: 'info', summary: 'No selecciono ninguna imagen', detail: 'Por favor, debe seleccionar una imagen de perfil.', life: 3000 });
            }
        }
        else {
            if(this.personaForm.invalid){
                this.messageService.add({ severity: 'error', summary: 'Error en el Registro', detail: 'Por favor, verifica la información ingresada e intenta nuevamente.', life: 3000 });
                return Object.values(this.personaForm.controls).forEach(control=>{
                    control.markAllAsTouched();
                    control.markAsDirty();
                })
            }
            console.log("Archivos: ", this.archivos);
            if (!this.archivos?.currentFiles && this.personaForm.valid) {
                this.messageService.add({ severity: 'info', summary: 'No selecciono ninguna imagen', detail: 'Registro sin imagen.', life: 3000 });
                this.tipoUpdate = 4;
                this.imagenName = '';
            }
            if (this.archivos?.currentFiles && this.personaForm.valid) {
                // this.messageService.add({ severity: 'info', summary: 'Si selecciono una imagen', detail: 'Registro con imagen.', life: 3000 });
                this.cargarArchivos(this.archivos.currentFiles);
                this.tipoUpdate = 2;
                // this.imagenName = this.archivos.currentFiles[0]?.name;
                this.imagenName = this.nombreArchivo;
            }

            this.personaRegistroModificar = new Persona();
            this.personaRegistroModificar.tipo = this.tipoUpdate;
            this.personaRegistroModificar.perid = this.personaForm.value.pf_id;
            this.personaRegistroModificar.perusumod = this.usuario.usuname;
            this.personaRegistroModificar.perapepat = this.personaForm.value.pf_apePat;
            this.personaRegistroModificar.perapemat = this.personaForm.value.pf_apeMat;
            this.personaRegistroModificar.pernombres = this.personaForm.value.pf_nombres;
            // this.personaRegistroModificar.pernrodoc = this.personaForm.value.pf_nroDoc;
            this.personaRegistroModificar.perfecnac = this.personaForm.value.pf_fecNac;
            this.personaRegistroModificar.percelular = this.personaForm.value.pf_celular;
            this.personaRegistroModificar.pertelefono = this.personaForm.value.pf_telefono;
            this.personaRegistroModificar.peremail = this.personaForm.value.pf_email;
            this.personaRegistroModificar.perdirec = this.personaForm.value.pf_direc;
            this.personaRegistroModificar.perfoto = this.imagenName;
            this.personaRegistroModificar.perestcivil = this.personaForm.value.pf_tipoEstCivil.estadocivilid;
            this.personaRegistroModificar.estadocivilnombre = this.personaForm.value.pf_tipoEstCivil.estadocivilnombre;
            this.personaRegistroModificar.pertipodoc = this.personaForm.value.pf_tipDoc.tipodocid;
            this.personaRegistroModificar.tipodocnombre = this.personaForm.value.pf_tipDoc.tipodocid;
            this.personaRegistroModificar.pergenero = this.personaForm.value.pf_tipGen.generoid;
            this.personaRegistroModificar.generonombre = this.personaForm.value.pf_tipGen.generonombre;
            this.personaRegistroModificar.perpais = this.personaForm.value.pf_tipPais.paisid;
            this.personaRegistroModificar.paisnombre = this.personaForm.value.pf_tipPais.paisnombre;
            this.personaRegistroModificar.perciudad = this.personaForm.value.pf_tipCiudad.ciudadid;
            this.personaRegistroModificar.ciudadnombre = this.personaForm.value.pf_tipCiudad.ciudadnombre;

            this.loading = true;
            // console.log("Datos antes de modificar: ", this.personaRegistroModificar);
            this.personaService.gestionarPersona(this.personaRegistroModificar).subscribe(
                (data: any) => {
                    this.personaNuevoDialog = false;
                    this.optionDialog = false;
                    this.personaRegistroModificar = new Persona();
                    this.messageService.add({ severity: 'success', summary: 'Registro Correcto!', detail: 'La persona se modificó correctamente en el sistema.', life: 3000 });
                    this.fListarPersonas();
                    this.loading = false;
                },
                (error: any) => {
                    // console.log("Error: ", error);
                    this.messageService.add({severity: 'error', summary: 'Problema', detail: 'Ocurrió un error en la modificación de la persona, por favor comuníquese con soporte.', life: 3000 });
                    this.loading = false;
                }
            );
        }
    }

    obtenerSeverity(estado: number): string {
        switch (estado) {
            case 1:
                return 'danger';
            case 2:
                return 'success';
            case 3:
                return 'warning';
            default:
                return 'info';
        }
    }

    obtenerDescripcion(estado: number): string {
        switch (estado) {
            case 1:
                return 'Activo';
            case 0:
                return 'Desactivo';
            default:
                return 'Ninguno';
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

    NuevoPersona() {
        this.person = new Persona();
        this.personaForm.reset();
        this.personaForm.get('pf_nroDoc')?.enable();
        this.fileUpload.clear();
        this.personaNuevoDialog = true;
        this.optionDialog = true;
    }

    eliminarPersona() {
        this.person = new Persona();
        this.person.tipo = 2;
        this.person.perid = this.persona.perid;
        this.person.perusumod = this.usuario.usuname;
        this.loading = true;
        this.personaService.eliminarPersona(this.person).subscribe(
            (data: any) => {
                this.eliminarPersonaDialog = false;
                this.optionDialog = false;
                this.messageService.add({ key: 'bc', severity: 'success', summary: 'Registro Correcto!', detail: 'La persona se elimino correctamente en el sistema.', life: 3000 });
                this.fListarPersonas();
                this.loading = false;
            },
            (error: any) => {
                console.log("Error: ", error);
                this.messageService.add({ key: 'bc', severity: 'error', summary: 'Algo salio mal!', detail: 'Ocurrio un error en la eliminación de , porfavor comunicarse con soporte.', life: 3000 });
                this.loading = false;
            }
            )
    }

    activarPersona() {
        this.person = new Persona();
        this.person.tipo = 3;
        this.person.perid = this.persona.perid;
        this.person.perusumod = this.usuario.usuname;
        this.loading = true;
        this.personaService.eliminarPersona(this.person).subscribe(
            (data: any) => {
                this.activarPersonaDialog = false;
                this.optionDialog = false;
                this.messageService.add({ key: 'bc', severity: 'success', summary: 'Registro Correcto!', detail: 'La persona se activo correctamente en el sistema.', life: 5000 });
                this.fListarPersonas();
                this.loading = false;
            },
            (error: any) => {
                console.log("Error: ", error);
                this.messageService.add({ key: 'bc', severity: 'error', summary: 'Ups!, algo salio mal!', detail: 'Ocurrio un error en la activación, porfavor comunicarse con soporte.', life: 5000 });
                this.loading = false;
            }
            )
    }

    confirmarEliminar(data: any) {
        this.persona = { ...data };
        this.eliminarPersonaDialog = true;
    }

    confirmarActivar(data: any) {
        this.persona = { ...data };
        this.activarPersonaDialog = true;
    }

    hideDialog() {
        this.personaDialog = false;
        this.submitted = false;
        this.deleteProductDialog = false;
    }

    ocultarDialog() {
        this.personaDialog = false;
        this.personaNuevoDialog = false;
        this.fLlenarTipoCombo()
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }

    onUpload(event: any) {
        this.archivos = event;
    }

    convertirAFecha(fechaStr: string): Date {
        const partesFecha = fechaStr.split('/');
        const fecha = new Date(Number(partesFecha[2]), Number(partesFecha[1]) - 1, Number(partesFecha[0]));
        return fecha;
    }

    // Métodos para exportar PDF y EXCEL

    exportPdf() {
        import('jspdf').then(jsPDF => {
            import('jspdf-autotable').then(() => {
                // Cambia 'p' por 'l' para la orientación horizontal
                // Considera ajustar las unidades a 'pt' para mejor manejo del tamaño
                const doc = new jsPDF.default('l', 'pt', 'a4');
                // Agregar un título
                doc.setFontSize(16); // Tamaño de la fuente
                doc.text('Lista de Personas', 14, 30); // Agrega texto en la posición x = 14, y = 30
                // Configura las columnas y el cuerpo del PDF
                (doc as any).autoTable({
                    columns: this.exportColumns,
                    body: this.personas,
                    theme: 'striped',  // Puedes elegir otros temas como 'plain', 'striped' o 'grid'
                    styles: { fontSize: 8, cellPadding: 3 },  // Ajusta el tamaño de fuente y el padding para acomodar más datos
                });
                // Guarda el archivo PDF
                doc.save('ListaPersonas.pdf');
            });
        });
    }

    exportExcel() {
        import('xlsx').then((xlsx) => {
            // Define los campos que deseas incluir en la exportación
            const fieldsToExport = [
                'perid', 'pernomcompleto', 'pernombres', 'perapepat', 'perapemat',
                'tipodocnombre', 'pernrodoc', 'perfecnac','generonombre', 'perestado', 'perusureg',
                'perfecreg', 'perusumod', 'perfecmod'
            ];
            // Filtra y transforma 'this.personas' para incluir solo los campos deseados
            const dataToExport = this.personas.map(persona => {
                const filteredData = {};
                fieldsToExport.forEach(field => {
                    filteredData[field] = persona[field] || ''; // Asegura que todos los campos existan, incluso si están vacíos
                });
                return filteredData;
            });
            const worksheet = xlsx.utils.json_to_sheet(dataToExport);
            const workbook = { Sheets: { 'Data': worksheet }, SheetNames: ['Data'] };
            const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
            this.saveAsExcelFile(excelBuffer, 'persons');
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
