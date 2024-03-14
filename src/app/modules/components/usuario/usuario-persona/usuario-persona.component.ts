import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

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
import { AbstractControl, AsyncValidatorFn, ValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { FileUpload } from 'primeng/fileupload';
// @ViewChild('fileUpload') fileUpload: any;

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
    

    constructor(
        public usuarioService: UsuarioService,
        private messageService: MessageService,
        public personaService: PersonaService,
        private uploadService: UploadService,
        private sanitizer: DomSanitizer,
        private authService: AuthService,
        private formBuilder: FormBuilder // 
    ) {}

    ngOnInit() {
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
      
            // Comprueba si el año de nacimiento es menor a 2009
            if (fechaNacimiento.getFullYear() > 2009) {
              resolve({ edadMinima: true }); // Devuelve un objeto de error indicando que la edad es menor que 15 años
            }
      
            resolve(null); // Si la fecha cumple con los requisitos, devuelve null (sin errores)
          });
        };
    }
    
    // Método para crear un validador asíncrono para verificar si un número de documento ya existe
    validarDocumentoExistente(): AsyncValidatorFn {
        // Se llama al método para obtener la lista de personas
        this.fListarPersonas();
        
        // Se retorna una función que actúa como validador asíncrono
        return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
            // Se obtiene el valor del control de formulario, que representa el número de documento ingresado por el usuario
            const numeroDocumento = control.value;
            // console.log('Número de documento:', numeroDocumento);

            // Si el número de documento está vacío, no se realiza ninguna validación
            if (!numeroDocumento) {
                return of(null); // Se devuelve un observable que emite null
            }
            
            // Se verifica si algún elemento en la lista de personas tiene el mismo número de documento
            const existe = this.personasDuplicated.some(persona => persona.pernrodoc === numeroDocumento);
            
            // Se devuelve un observable que emite un objeto de errores si existe un duplicado, de lo contrario, emite null
            return of(existe ? { documentoExistente: true } : null);
    };
}

    fListarPersonas() {
        this.personaService.ListarPersona().subscribe(
            (result: any) => {
                this.elements = result;
                this.personas = this.elements.map(item => this.fOrganizarDatosPersona(item));
                this.personasDuplicated = this.personas;
                // console.log("All persons: ",this.personasDuplicated)
                this.loading = false;
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
        persona.perfecnac = this.convertirAFecha(data.perfecnac);
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

    convertirAFecha(fechaStr: string): Date {
        const partesFecha = fechaStr.split('/');
        const fecha = new Date(Number(partesFecha[2]), Number(partesFecha[1]) - 1, Number(partesFecha[0]));
        return fecha;
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
        // console.log("mod data: ", this.persona)
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
        // console.log("personForm mod: ", this.personaForm)
    }

    cargarArchivos(currentFiles: File[]): void {
        if (currentFiles) {
            const formData = new FormData();
            for (let i = 0; i < currentFiles.length; i++) {
                const file: File = currentFiles[i];
                formData.append('files[]', file, file.name);
            }
            this.uploadService.uploadFiles(formData).subscribe(
                (data: any) => {
                    // Limpiar el componente FileUpload después de cargar los archivos
                    this.fileUpload.clear();
    
                    this.messageService.add({ severity: 'success', summary: 'Registro de Imagen!', detail: 'La imagen se registró existosamente en el sistema.', life: 2000 });
                },
                (error: any) => {
                    console.error('Error en la carga:', error);
                }
            );
        } else {
            console.warn('No se seleccionaron archivos.');
        }
    }
  
    enviarFormulario() {
        
        if (this.optionDialog) {
            // console.log("True: ", this.optionDialog)
            // this.messageService.add({ severity: 'info', summary: 'Verdad', detail: 'True', life: 2000 });
            if(this.personaForm.invalid){
                // console.log("personaForm.value: ", this.personaForm.value);
                this.messageService.add({ severity: 'error', summary: 'Error en el Registro', detail: 'Por favor, verifica la información ingresada e intenta nuevamente.', life: 3000 });
                return Object.values(this.personaForm.controls).forEach(control=>{
                    control.markAllAsTouched();
                    control.markAsDirty();
                })   
            }
            if (this.archivos?.currentFiles && this.personaForm.valid) {
                this.cargarArchivos(this.archivos.currentFiles);
                // console.log("personaForm.value: ", this.personaForm.value, this.archivos.currentFiles.file);
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
                this.personaRegistroNuevo.perfoto = this.archivos.currentFiles[0]?.name;
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
                // console.log("Add Person: ", this. personaRegistroNuevo)
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
                // console.log("personaForm.value: ", this.personaForm.value);
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
                this.imagenName = this.archivos.currentFiles[0]?.name;
            }

            this.personaRegistroModificar = new Persona();
            this.personaRegistroModificar.tipo = this.tipoUpdate;
            this.personaRegistroModificar.perid = this.personaForm.value.pf_id;
            this.personaRegistroModificar.perusumod = this.usuario.usuname;
            this.personaRegistroModificar.perapepat = this.personaForm.value.pf_apePat;
            this.personaRegistroModificar.perapemat = this.personaForm.value.pf_apeMat;
            this.personaRegistroModificar.pernombres = this.personaForm.value.pf_nombres;
            this.personaRegistroModificar.pernrodoc = this.personaForm.value.pf_nroDoc;
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

    NuevoPersona() {
        // this.TipoCiudad = this.TipoCiudad.filter(ciudad => ciudad.paisid === 1);
        this.person = new Persona();
        // this.TipoPaisSeleccionado = new TipoPais(1, "Ninguno");
        // this.TipoCiudadSeleccionado = new TipoCiudad(1, "Ninguno", 1);
        // this.TipoEstadoCivilSeleccionado = new TipoEstadoCivil(1, "Ninguno");
        // this.TipoGeneroSeleccionado = new TipoGenero(0, "Ninguno");
        // this.TipoDocumentoSeleccionado = new TipoDocumento(1, "Ninguno");
        this.personaForm.reset();
        this.personaForm.get('pf_nroDoc')?.enable();
        this.personaNuevoDialog = true;
        this.optionDialog = true;
    }

    eliminarPersona() {
        this.person = new Persona();
        this.person.tipo = 1;
        this.person.perid = this.persona.perid;
        this.loading = true;
        this.personaService.eliminarPersona(this.person).subscribe(
            (data: any) => {
                this.eliminarPersonaDialog = false;
                this.optionDialog = false;
                this.messageService.add({ key: 'bc', severity: 'success', summary: 'Registro Correcto!', detail: 'La persona se elimino correctamente en el sistema.', life: 3000 });
                // this.ListarPersonas();
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

    confirmarEliminar(data: any) {
        this.persona = { ...data };
        this.eliminarPersonaDialog = true;
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

    getImageUrl(persona: any): SafeUrl {
        const encodedUrl = 'http://127.0.0.1:5001/static/uploads/' + encodeURIComponent(persona.perfoto);
        const decodedUrl = decodeURIComponent(encodedUrl);
        return this.sanitizer.bypassSecurityTrustUrl(decodedUrl);
    }
}
