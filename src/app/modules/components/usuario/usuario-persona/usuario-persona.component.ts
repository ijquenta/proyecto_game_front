import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { FileUpload } from 'primeng/fileupload';
import { NgxSpinnerService } from 'ngx-spinner';
import * as FileSaver from 'file-saver';
import { environment } from 'src/environments/environment';
import logoIbciBase64 from '../../../../../assets/base64/logo_ibci_base64.js';
// Servicios
import { UsuarioService } from 'src/app/modules/service/data/usuario.service';
import { AuthService } from 'src/app/services/auth.service';
import { PersonaService } from 'src/app/modules/service/data/persona.service';
import { UploadService } from 'src/app/modules/service/data/upload.service';
// Modelos
import { Persona, PersonaExpanded } from 'src/app/modules/models/persona';
import { TipoPais, TipoCiudad, TipoEstadoCivil, TipoGenero, TipoDocumento } from 'src/app/modules/models/diccionario';
import { Usuario } from 'src/app/modules/models/usuario';
import { MenuItem } from 'primeng/api';

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

    @ViewChild('fileUpload') fileUpload: FileUpload;
    personaForm: FormGroup;

    // Variables
    persona: PersonaExpanded;
    personas: PersonaExpanded[] = [];
    personasDuplicated: PersonaExpanded[] = [];
    personasInactivas: PersonaExpanded[] = [];
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
    originalPerNroDoc: any;

    apiUrl = environment.API_URL_FOTO_PERFIL;

    // Other variables
    items: MenuItem[] | undefined;
    home: MenuItem | undefined;

    stateOptionsEstado: any[] = [
        { label: 'Activo', value: 1 },
        { label: 'Inactivo', value: 0 }
    ];

    stateOptionsActivo: any[] = [
        { label: 'Activo', value: 1 },
        { label: 'Inactivo', value: 0 }
    ]

    showDialogPersona: boolean = false;

    constructor( public usuarioService: UsuarioService,
                 private messageService: MessageService,
                 public personaService: PersonaService,
                 private uploadService: UploadService,
                 private authService: AuthService,
                 private formBuilder: FormBuilder,
                 private spinner: NgxSpinnerService,
                ) {}
    ngOnInit() {

        this.items = [{ label: 'Usuarios'}, { label: 'Gestionar Personas', routerLink:''},];
        this.home = { icon: 'pi pi-home', routerLink: '/' };

        this.colsTable = [
            { field: 'perid', header: 'ID' },
            { field: 'tipodocnombre', header: 'Tipo de Documento' },
            { field: 'pernrodoc', header: 'Número de Documento' },
            { field: 'pernomcompleto', header: 'Nombre Completo' },
            { field: 'pernombres', header: 'Nombres' },
            { field: 'perapepat', header: 'Apellido Paterno' },
            { field: 'perapemat', header: 'Apellido Materno' },
            { field: 'perfecnac', header: 'Fecha de Nacimiento' },
            { field: 'generonombre', header: 'Género' },
            { field: 'perusureg', header: 'Usuario Registro' },
            { field: 'perfecreg', header: 'Fecha Registro' },
            { field: 'perusumod', header: 'Usuario Modificación' },
            { field: 'perfecmod', header: 'Fecha Modificación' },
            { field: 'perestado', header: 'Estado' },
        ];

        this.exportColumns = this.colsTable.map((col) => ({ title: col.header, dataKey: col.field }));

        this.fListarPersonas();

        this.fLlenarTipoCombo();

        this.statuses = [ { label: 'Activo', value: 0 }, { label: 'Inactivo', value: 1 }, ];

        this.obtenerPerfil()

        this.personaForm = this.formBuilder.group({
            perid: [''],
            pernombres: ['', [Validators.required]],
            perapepat: ['', [Validators.required]],
            perapemat: [''],
            pernrodoc: [{ value: '' }, [Validators.required], [this.validarDocumentoExistente()]],
            perfecnac: ['', [Validators.required], [this.validarEdadMinima()]],
            perdirec: ['', [Validators.required]],
            peremail: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
            percelular: ['', [Validators.required]],
            pertelefono: [''],
            perfoto: [''],
            tipoGenero: ['', [Validators.required]],
            tipoEstadoCivil: ['', [Validators.required]],
            tipoPais: ['', [Validators.required]],
            tipoCiudad: ['', [Validators.required]],
            tipoDocumento: ['',[Validators.required]],
            perobservacion: [''],
            perestado: ['', [Validators.required]]
        });
    }

    // Usuario
    // obtener perfil
    obtenerPerfil(){
        this.authService.getPerfil().subscribe(user => { this.usuario = user[0]; });
    }

    // Validaciones
    // Validar Edad Minima > 15 años | Mejorar
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
    // Validar si el número de documento ya existe
    validarDocumentoExistente(): AsyncValidatorFn { // Método para crear un validador asíncrono para verificar si un número de documento ya existe
        return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {         // Se retorna una función que actúa como validador asíncrono
            const numeroDocumento = control.value; // Se obtiene el valor del control de formulario, que representa el número de documento ingresado por el usuario
            if (!numeroDocumento) {// Si el número de documento está vacío, no se realiza ninguna validación
                return of(null); // Se devuelve un observable que emite null
            }
            const existe = this.personasDuplicated.some(persona => persona.pernrodoc === numeroDocumento);// Se verifica si algún elemento en la lista de personas tiene el mismo número de documento
            return of(existe ? { documentoExistente: true } : null); // Se devuelve un observable que emite un objeto de errores si existe un duplicado, de lo contrario, emite null
    };
    }
    // Validar cuando el número de documento cambia, validar si ya existe
    validateNroDocIfChanged(control: AbstractControl) {
        if (control.value === this.originalPerNroDoc) {
            return of(null);
        } else {
            return this.validarDocumentoExistente()(control);
        }
    }



    // Persona
    // Nuevo Persona
    NuevoPersona() {
        this.person = new Persona();
        this.personaForm.reset();
        this.personaForm.get('pernrodoc')?.enable();
        // this.fileUpload.clear();
        this.personaNuevoDialog = true;
        this.optionDialog = true;
    }
    // f Listar Personas
    fListarPersonas() {
        this.spinner.show();
        this.loading = true;
        this.personaService.ListarPersona().subscribe(
            (result: any) => {
                this.elements = result;
                this.personas = this.elements.map(item => this.fOrganizarDatosPersona(item));
                this.personasDuplicated = this.personas;

                // this.personasInactivas = this.personas.filter(persona => persona.perestado === 0);
                // console.log("listade no activas: ", this.personasInactivas);
                // this.personas = this.personas.filter(persona => persona.perestado === 1);
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
    // Organizar datos de persona
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
        persona.perfecnac = data.perfecnac;
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
        persona.datos.push({ percod: data.perid, perdirec: data.perdirec, peremail: data.peremail, percelular: data.percelular, pertelefono: data.pertelefono, perestcivil: data.perestcivil, estadocivilnombre: data.estadocivilnombre, perpais: data.perpais, paisnombre: data.paisnombre, perciudad: data.perciudad, ciudadnombre: data.ciudadnombre, });
        return persona;
    }
    // Lista Personas
    ListarPersonas() {
        this.personaService.ListarPersona().subscribe((data: any) => { this.Personas = data; });
    }
    // Modificar persona
    modificarPersona(data: PersonaExpanded) {
        this.fLlenarTipoCombo();
        this.persona = { ...data };
        console.log("mod:", this.persona)
        this.optionDialog = false;
        this.personaNuevoDialog = true;
        this.originalPerNroDoc = this.persona.pernrodoc;

        this.personaForm.reset();
        this.personaForm.patchValue({
            perid: this.persona.perid,
            pernombres: this.persona.pernombres,
            perapepat: this.persona.perapepat,
            perapemat: this.persona.perapemat,
            tipoDocumento: new TipoDocumento(this.persona.pertipodoc, this.persona.tipodocnombre),
            pernrodoc: this.persona.pernrodoc,
            perfecnac: this.persona.perfecnac,
            tipoGenero: new TipoGenero(this.persona.pergenero, this.persona.generonombre),
            perdirec: this.persona.datos[0].perdirec,
            peremail: this.persona.datos[0].peremail,
            percelular: this.persona.datos[0].percelular,
            pertelefono: this.persona.datos[0].pertelefono,
            tipoEstadoCivil: new TipoEstadoCivil(this.persona.datos[0].perestcivil, this.persona.datos[0].estadocivilnombre),
            tipoPais: new TipoPais(this.persona.datos[0].perpais, this.persona.datos[0].paisnombre),
            tipoCiudad: new TipoCiudad(this.persona.datos[0].perciudad, this.persona.datos[0].ciudadnombre, this.persona.datos[0].perpais),
            perfoto: this.persona.perfoto,
            perobservacion: this.persona.perobservacion,
            perestado: this.persona.perestado
        });
        const nroDocControl = this.personaForm.get('pernrodoc');
        nroDocControl.clearAsyncValidators();
        if (this.originalPerNroDoc) {
            nroDocControl.setAsyncValidators([this.validateNroDocIfChanged.bind(this)]);
        }
        nroDocControl.updateValueAndValidity();
    }
    // Enviar datos formulario para crear o actualzar persona
    enviarFormulario() {
        if (this.optionDialog) {
            if(this.personaForm.invalid){
                this.messageService.add({ severity: 'error', summary: 'Error en el Registro', detail: 'Por favor, verifica la información ingresada e intenta nuevamente.', life: 3000 });
                return Object.values(this.personaForm.controls).forEach(control=>{ control.markAllAsTouched(); control.markAsDirty(); })
            }
            if (this.personaForm.valid) {

                this.personaRegistroNuevo = new Persona();
                this.personaRegistroNuevo.tipo = 1;
                this.personaRegistroNuevo.perid = null;
                this.personaRegistroNuevo.perusureg = this.usuario.usuname;
                this.personaRegistroNuevo.perapepat = this.personaForm.value.perapepat;
                this.personaRegistroNuevo.perapemat = this.personaForm.value.perapemat;
                this.personaRegistroNuevo.pernombres = this.personaForm.value.pernombres;
                this.personaRegistroNuevo.pernrodoc = this.personaForm.value.pernrodoc;
                this.personaRegistroNuevo.perfecnac = this.personaForm.value.perfecnac;
                this.personaRegistroNuevo.percelular = this.personaForm.value.percelular;
                this.personaRegistroNuevo.pertelefono = this.personaForm.value.pertelefono;
                this.personaRegistroNuevo.peremail = this.personaForm.value.peremail;
                this.personaRegistroNuevo.perdirec = this.personaForm.value.perdirec;
                this.personaRegistroNuevo.perestcivil = this.personaForm.value.tipoEstadoCivil.estadocivilid;
                this.personaRegistroNuevo.estadocivilnombre = this.personaForm.value.tipoEstadoCivil.estadocivilnombre;
                this.personaRegistroNuevo.pertipodoc = this.personaForm.value.tipoDocumento.tipodocid;
                this.personaRegistroNuevo.tipodocnombre = this.personaForm.value.tipoDocumento.tipodocid;
                this.personaRegistroNuevo.pergenero = this.personaForm.value.tipoGenero.generoid;
                this.personaRegistroNuevo.generonombre = this.personaForm.value.tipoGenero.generonombre;
                this.personaRegistroNuevo.perpais = this.personaForm.value.tipoPais.paisid;
                this.personaRegistroNuevo.paisnombre = this.personaForm.value.tipoPais.paisnombre;
                this.personaRegistroNuevo.perciudad = this.personaForm.value.tipoCiudad.ciudadid;
                this.personaRegistroNuevo.ciudadnombre = this.personaForm.value.tipoCiudad.ciudadnombre;
                this.personaRegistroNuevo.perobservacion = this.personaForm.value.perobservacion;
                this.personaRegistroNuevo.perfoto = this.nombreArchivo;
                this.personaRegistroNuevo.perestado = this.personaForm.value.perestado;
                if(!this.nombreArchivo){
                    this.personaRegistroNuevo.perfoto = null;
                }
                this.loading = true;
                console.log("persona nuevo: ", this.personaRegistroNuevo)
                this.personaService.gestionarPersona(this.personaRegistroNuevo).subscribe(
                    (data: any) => {
                        this.personaNuevoDialog = false;
                        this.optionDialog = false;
                        this.messageService.add({ severity: 'success', summary: 'Persona', detail: 'Se registró correctamente en el sistema.', life: 3000 });
                        this.fListarPersonas();
                        this.loading = false;
                    },
                    (error: any) => {
                        console.error("Error: ", error['message']);
                        this.messageService.add({ severity: 'error', summary: 'Problema', detail: 'Ocurrío un error en el registro de persona, verifique los campos ingresados.', life: 3000 });
                        this.loading = false;
                    }
                );
            }
            // else{
            //     this.messageService.add({ severity: 'info', summary: 'No selecciono ninguna imagen', detail: 'Por favor, debe seleccionar una imagen de perfil.', life: 3000 });
            // }
        }
        else {
            if(this.personaForm.invalid){
                this.messageService.add({ severity: 'error', summary: 'Error en el Registro', detail: 'Por favor, verifica la información ingresada e intenta nuevamente.', life: 3000 });
                return Object.values(this.personaForm.controls).forEach(control=>{
                    control.markAllAsTouched();
                    control.markAsDirty();
                })
            }
            if (!this.archivos?.currentFiles && this.personaForm.valid) {
                this.messageService.add({ severity: 'info', summary: 'No selecciono ninguna imagen', detail: 'Registro sin imagen.', life: 3000 });
                this.tipoUpdate = 4;
                this.imagenName = '';
            }
            if (this.archivos?.currentFiles && this.personaForm.valid) {
                this.cargarArchivos(this.archivos.currentFiles);
                this.tipoUpdate = 2;
                this.imagenName = this.nombreArchivo;
            }
            console.log("datos modificar: ", this.personaForm.value)
            this.personaRegistroModificar = new Persona();
            this.personaRegistroModificar.tipo = this.tipoUpdate;
            this.personaRegistroModificar.perid = this.personaForm.value.perid;
            this.personaRegistroModificar.perusumod = this.usuario.usuname;
            this.personaRegistroModificar.perapepat = this.personaForm.value.perapepat;
            this.personaRegistroModificar.perapemat = this.personaForm.value.perapemat;
            this.personaRegistroModificar.pernombres = this.personaForm.value.pernombres;
            this.personaRegistroModificar.pernrodoc = this.personaForm.value.pernrodoc;
            this.personaRegistroModificar.perfecnac = this.personaForm.value.perfecnac;
            this.personaRegistroModificar.percelular = this.personaForm.value.percelular;
            this.personaRegistroModificar.pertelefono = this.personaForm.value.pertelefono;
            this.personaRegistroModificar.peremail = this.personaForm.value.peremail;
            this.personaRegistroModificar.perdirec = this.personaForm.value.perdirec;
            this.personaRegistroModificar.perfoto = this.nombreArchivo;
            this.personaRegistroModificar.perestcivil = this.personaForm.value.tipoEstadoCivil.estadocivilid;
            this.personaRegistroModificar.estadocivilnombre = this.personaForm.value.tipoEstadoCivil.estadocivilnombre;
            this.personaRegistroModificar.pertipodoc = this.personaForm.value.tipoDocumento.tipodocid;
            this.personaRegistroModificar.tipodocnombre = this.personaForm.value.tipoDocumento.tipodocid;
            this.personaRegistroModificar.pergenero = this.personaForm.value.tipoGenero.generoid;
            this.personaRegistroModificar.generonombre = this.personaForm.value.tipoGenero.generonombre;
            this.personaRegistroModificar.perpais = this.personaForm.value.tipoPais.paisid;
            this.personaRegistroModificar.paisnombre = this.personaForm.value.tipoPais.paisnombre;
            this.personaRegistroModificar.perciudad = this.personaForm.value.tipoCiudad.ciudadid;
            this.personaRegistroModificar.ciudadnombre = this.personaForm.value.tipoCiudad.ciudadnombre;
            this.personaRegistroModificar.perobservacion = this.personaForm.value.perobservacion;
            this.personaRegistroModificar.perestado = this.personaForm.value.perestado;
            this.loading = true;

            if(!this.nombreArchivo){
                this.personaRegistroModificar.perfoto = null;
            }

            console.log("Persona a modificar:", this.personaRegistroModificar)
            this.personaService.gestionarPersona(this.personaRegistroModificar).subscribe(
                (data: any) => {
                    this.personaNuevoDialog = false;
                    this.optionDialog = false;
                    this.personaRegistroModificar = new Persona();
                    this.messageService.add({ severity: 'success', summary: 'Persona', detail: 'Se modificó correctamente en el sistema.', life: 3000 });
                    this.fListarPersonas();
                    this.loading = false;
                },
                (error: any) => {
                    console.log("Error: ", error);
                    this.messageService.add({severity: 'error', summary: 'Problema', detail: 'Ocurrió un error en la modificación de la persona, por favor comuníquese con soporte.', life: 3000 });
                    this.loading = false;
                }
            );
        }
    }
    // Eliminar Persona
    async eliminarPersona() {
        this.person = new Persona();
        this.person.tipo = 1;
        this.person.perid = this.persona.perid;
        this.person.perusumod = this.usuario.usuname;
        this.loading = true;

        this.personaService.eliminarPersona(this.person).subscribe(
            (data: any) => {
                const currentPhoto = this.persona.perfoto;
                console.log("Nombre de la imagen actual: ", currentPhoto); // ok

                if (currentPhoto) {
                    const deleteSuccess = this.uploadService.deleteProfilePhoto(currentPhoto);
                    console.log("¿Se eliminó la imagen?", deleteSuccess);
                    if (!deleteSuccess) {
                        this.messageService.add({ severity: 'warn', summary: 'Imagen', detail: 'No se pudo eliminar la imagen actual.', life: 3000 });
                    }
                    if(deleteSuccess) {
                        this.messageService.add({ severity: 'info', summary: 'Imagen', detail: 'Se eliminó correctamente.', life: 3000 });
                    }
                }

                this.eliminarPersonaDialog = false;
                this.optionDialog = false;
                this.messageService.add({ severity: 'success', summary: 'Persona', detail: 'Se elimino correctamente en el sistema.', life: 3000 });
                this.fListarPersonas();
                this.loading = false;

            },
            (error: any) => {
                console.log("Error: ", error);
                this.messageService.add({ severity: 'error', summary: 'Persona', detail: 'Ocurrio un error, porfavor comunicarse con soporte.', life: 3000 });
                this.loading = false;
            }
        )
    }
    // Activar persona
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
    // Confirmar eliminar
    confirmarEliminar(data: any) {
        this.persona = { ...data };
        this.eliminarPersonaDialog = true;
    }
    // Confirmar Activar
    confirmarActivar(data: any) {
        this.persona = { ...data };
        this.activarPersonaDialog = true;
    }
    // Ocultar dialog
    hideDialog() {
        this.personaDialog = false;
        this.submitted = false;
        this.deleteProductDialog = false;
    }
    // Ocultar dialog y llenar tipo combo
    ocultarDialog() {
        this.personaDialog = false;
        this.personaNuevoDialog = false;
        this.fLlenarTipoCombo()
    }
    // Mostrara Persona
    showPerson(persona: PersonaExpanded){
        this.persona = {...persona};
        console.log("showPerson: ", this.persona)
        this.showDialogPersona = true;
    }

    // Tipo Combo
    // Llenar tipo combo
    fLlenarTipoCombo() {
        this.personaService.getTipoCiudad().subscribe((data: any) => { this.TipoCiudad = data; this.TipoCiudadRespaldo = data; });
        this.personaService.getTipoPais().subscribe((data: any) => { this.TipoPais = data; });
        this.personaService.getTipoDocumento().subscribe((data: any) => { this.TipoDocumento = data; });
        this.personaService.getTipoGenero().subscribe((data: any) => { this.TipoGenero = data; });
        this.personaService.getTipoEstadoCivil().subscribe((data: any) => { this.TipoEstadoCivil = data; });
    }
    // Cuando cambia el tipo pais
    onChangeTipoPais(data: any) {
        this.TipoCiudad = this.TipoCiudadRespaldo;
        this.id = data.value.paisid;
        this.TipoCiudad = this.TipoCiudad.filter(ciudad => ciudad.paisid === this.id);
    }

    // Archivo
    // Cargar archivos

    // Generate Unique File name
    generateUniqueFilename(originalName: string): string {
        const timestamp = new Date().getTime();
        const extension = originalName.split('.').pop(); // Obtiene la extensión del archivo
        return `${timestamp}.${extension}`;
    }
    // Asyncrone onUpload
    async onUpload(event: any) {
        const currentPhoto = this.personaForm.value.perfoto;
        console.log("Nombre de la imagen actual: ", currentPhoto); // ok

        if (!currentPhoto) {
          this.archivos = event;
          const success = await this.cargarArchivos(this.archivos.files);
          if (!success) {
            this.messageService.add({ severity: 'error', summary: 'Subir Imagen', detail: 'No se registró en el sistema.', life: 3000 });
          } else {
            this.messageService.add({ severity: 'success', summary: 'Subir Imagen', detail: 'Se registró existosamente en el sistema.', life: 3000 });
            this.ListarPersonas();
            this.personaForm.patchValue({ perfoto: this.nombreArchivo });
          }
          return;
        }
        this.archivos = event;
        const deleteSuccess = await this.uploadService.deleteProfilePhoto(currentPhoto);
        console.log("¿Se eliminó la imagen?", deleteSuccess);
        if (!deleteSuccess) {
          this.messageService.add({ severity: 'warn', summary: 'Subir Imagen', detail: 'No se pudo eliminar la imagen actual.', life: 3000 });
          const newuploadSuccess = await this.cargarArchivos(this.archivos.currentFiles);
          if (!newuploadSuccess) {
            this.messageService.add({ severity: 'error', summary: 'Subir Imagen', detail: 'no se registró en el sistema.', life: 3000 });
          } else {
            this.messageService.add({ severity: 'info', summary: 'Subir Imagen', detail: 'Se registró existosamente', life: 3000 });
            this.ListarPersonas();
            this.personaForm.patchValue({ perfoto: this.nombreArchivo });
          }
          return;
        }

        console.log("Imagen para subir: ", this.archivos);
        const uploadSuccess = await this.cargarArchivos(this.archivos.currentFiles);
        if (!uploadSuccess) {
          this.messageService.add({ severity: 'error', summary: 'Imagen', detail: 'no se registró en el sistema.', life: 3000 });
        } else {
          this.messageService.add({ severity: 'info', summary: 'Imagen', detail: 'Se registró existosamente', life: 3000 });
          this.ListarPersonas();
          this.personaForm.patchValue({ perfoto: this.nombreArchivo });
        }
    }
    // Cargar Archivos
    cargarArchivos(currentFiles: File[]): Promise<boolean> {
      return new Promise((resolve, reject) => {
        if (!currentFiles || currentFiles.length === 0) {
          this.messageService.add({ severity: 'info', summary: 'Subir Imagen', detail: 'No se seleccionó ninguna imagen.', life: 3000 });
          resolve(false);
        }
        const formData = new FormData();
        for (let i = 0; i < currentFiles.length; i++) {
          const file: File = currentFiles[i];
          this.nombreArchivo = this.generateUniqueFilename(file.name);
          formData.append('files[]', file, this.nombreArchivo);
        }
        this.spinner.show();
        this.uploadService.uploadProfilePhoto(formData).subscribe({
          next: (data: any) => {
            this.spinner.hide();
            resolve(true);
          },
          error: (error) => {
            console.error('Error en la carga:', error);
            this.spinner.hide();
            resolve(false);
          },
          complete: () => {
            // Lógica adicional después de la carga completada
          }
        });
      });
    }

    // Otros
    // Obtener Severity
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
    // Obtener Descripción
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
    // Obtener Severity Estado
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
    // Obtener Descripción de estado
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
    // Buscador en la tabla
    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }

    // Archivo PDF
    // Export PDF
    exportPdf() {
        import('jspdf').then(jsPDF => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default('l', 'pt', 'a4');

                // Título centrado
                const title = 'Lista de Personas';
                const titleFontSize = 16;
                const titleWidth = doc.getStringUnitWidth(title) * titleFontSize / doc.internal.scaleFactor;
                const titleX = (doc.internal.pageSize.getWidth() - titleWidth) / 2;
                const titleY = 60;
                doc.setFontSize(titleFontSize);
                doc.text(title, titleX, titleY);

                // Subtítulo
                const subtitle = 'Esta lista muestra todas las personas registradas en el sistema.';
                const subtitleFontSize = 9;
                const subtitleX = 20;
                const subtitleY = 80;
                doc.setFontSize(subtitleFontSize);
                doc.text(subtitle, subtitleX, subtitleY);

                // Descripción
                const description = 'Sistema de Seguimiento y Gestión Académico';
                const descriptionFontSize = 10;
                const descriptionX = 100;
                const descriptionY = 40;
                doc.setFontSize(descriptionFontSize);
                doc.text(description, descriptionX, descriptionY);

                const description2 = 'Instituto Biblico de Capacitación Internacional';
                const descriptionFontSize2 = 10;
                const descriptionX2 = 100;
                const descriptionY2 = 30;
                doc.setFontSize(descriptionFontSize2);
                doc.text(description2, descriptionX2, descriptionY2);

                // Imagen en base64
                const base64Image = logoIbciBase64;
                const imageX = 20;
                const imageY = 10;
                const imageWidth = 80; // Ancho de la imagen en puntos
                const imageHeight = 50; // Alto de la imagen en puntos
                doc.addImage(base64Image, 'PNG', imageX, imageY, imageWidth, imageHeight);

                // Tabla de datos
                (doc as any).autoTable({ columns: this.exportColumns, body: this.personas, theme: 'striped', styles: { fontSize: 8, cellPadding: 3 }, startY: 100, }); // Posición inicial de la tabla
                let PDF_EXTENSION = '.pdf';
                const nombreArchivo = 'rptPdf_persona'+'_'+new Date().getTime()+PDF_EXTENSION;
                doc.save(nombreArchivo); // Guardar el archivo PDF con el nuevo nombre
            });
        });
    }
    // Export Excel
    exportExcel() {
        import('xlsx').then((xlsx) => {
            const fieldsToExport = [
                { field: 'perid', header: 'ID' },
                { field: 'pernomcompleto', header: 'Nombre Completo' },
                { field: 'pernombres', header: 'Nombres' },
                { field: 'perapepat', header: 'Apellido Paterno' },
                { field: 'perapemat', header: 'Apellido Materno' },
                { field: 'tipodocnombre', header: 'Tipo de Documento' },
                { field: 'pernrodoc', header: 'Número de Documento' },
                { field: 'perfecnac', header: 'Fecha Nacimiento' },
                { field: 'generonombre', header: 'Género' },
                { field: 'perusureg', header: 'Usuario Registro' },
                { field: 'perfecreg', header: 'Fecha Registro' },
                { field: 'perusumod', header: 'Usuario Modificado' },
                { field: 'perfecmod', header: 'Fecha Modificado' },
                { field: 'perobservacion', header: 'Observación'},
                { field: 'perestado', header: 'Estado' },
            ];

            const dataToExport = this.personas.map(persona => {
                const filteredData = {};
                fieldsToExport.forEach(field => {
                    if (field.field === 'perfecnac') {
                        filteredData[field.header] = persona[field.field] ? new Date(persona[field.field]).toLocaleDateString() : '';
                    } else if (field.field === 'perfecreg' || field.field === 'perfecmod') {
                        filteredData[field.header] = persona[field.field] ? new Date(persona[field.field]).toLocaleString() : '';
                    } else {
                        filteredData[field.header] = persona[field.field] || '';
                    }
                });
                return filteredData;
            });

            const worksheet = xlsx.utils.json_to_sheet(dataToExport);

            // Calcular el ancho de las columnas basado en el contenido más largo
            const columnWidths = fieldsToExport.map(field => {
                const columnData = dataToExport.map(row => row[field.header]);
                const maxLength = columnData.reduce((acc, val) => Math.max(acc, val.toString().length), 0);
                return { wch: maxLength + 2 }; // Ajuste según necesidades
            });

            worksheet['!cols'] = columnWidths;

            const workbook = { Sheets: { 'Data': worksheet }, SheetNames: ['Data'] };
            const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
            this.saveAsExcelFile(excelBuffer, 'rptExcel_persona');
        });
    }


    // Save as Excel File
    saveAsExcelFile(buffer: any, fileName: string): void {
        let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        let EXCEL_EXTENSION = '.xlsx';
        const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
        FileSaver.saveAs(data, fileName + '_' + new Date().getTime() + EXCEL_EXTENSION);
    }
}
