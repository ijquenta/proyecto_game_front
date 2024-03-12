import { Component, OnInit } from '@angular/core';
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

@Component({
    templateUrl: './usuario-persona.component.html',
    providers: [MessageService],
    styleUrls: ['./usuario-persona.component.css']
})
export class UsuarioPersonaComponent implements OnInit {
    // Variable from Validations
    personaForm: FormGroup;
    // Variables 
    persona: PersonaExpanded;
    personas: PersonaExpanded[] = [];
    elements: PersonaExpanded[];
    listaPersona: PersonaExpanded[] = [];
    personaRegistro: PersonaExpanded;
    Personas: Persona[] = [];
    personaRegistroNuevo: Persona;
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
    archivos: any;
    

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
        // Code to valitations 
        this.personaForm = this.formBuilder.group({
            apellidoPaterno: ['', [Validators.required, Validators.maxLength(5)]],
            // Agrega otros campos aquí con sus respectivas validaciones
        });

        this.loading = true;
    }

    fListarPersonas() {
        this.personaService.ListarPersona().subscribe(
            (result: any) => {
                this.elements = result;
                this.personas = this.elements.map(item => this.fOrganizarDatosPersona(item));
                // console.log("All persons: ",this.personas)
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
        this.personaDialog = true;
        this.TipoCiudadSeleccionado = new TipoCiudad(this.persona.datos[0].perciudad, this.persona.datos[0].ciudadnombre, this.persona.datos[0].perpais);
        this.TipoEstadoCivilSeleccionado = new TipoEstadoCivil(this.persona.datos[0].perestcivil, this.persona.datos[0].estadocivilnombre);
        this.TipoGeneroSeleccionado = new TipoGenero(this.persona.pergenero, this.persona.generonombre);
        this.TipoDocumentoSeleccionado = new TipoDocumento(this.persona.pertipodoc, this.persona.tipodocnombre);
        this.TipoPaisSeleccionado = new TipoPais(this.persona.datos[0].perpais, this.persona.datos[0].paisnombre);
        console.log("mod ciudad: ", this.TipoCiudadSeleccionado)
        this.persona.perfecnac = new Date(this.persona.perfecnac);
        this.optionDialog = false;
    }

    enviarFormulario() {
        if (this.optionDialog) {
            if (this.archivos.currentFiles) {
                this.imagenName = this.archivos.currentFiles[0].name;
                const formData = new FormData();
                for (let i = 0; i < this.archivos.currentFiles.length; i++) {
                    const file: File = this.archivos.currentFiles[i];
                    formData.append('files[]', file, file.name);
                    formData.forEach((value, key) => {
                        console.log(key, value);
                    });
                }
                this.uploadService.uploadFiles(formData).subscribe(
                    (data: any) => {
                        this.personaDialog = false;
                        this.optionDialog = false;
                        this.messageService.add({ severity: 'info', summary: 'Registro de Imagen!', detail: 'La imagen se registró correctamente en el sistema.', life: 2000 });
                        this.ListarPersonas();
                    },
                    (error: any) => {
                        console.error('Error en la carga:', error);
                    }
                );
            } else {
                console.warn('No se seleccionaron archivos.');
            }
            this.personaRegistroNuevo = { ...this.person };
            this.personaRegistroNuevo.tipo = 1;
            this.personaRegistroNuevo.perid = null;
            this.personaRegistroNuevo.perusureg = this.usuario.usuname;
            this.personaRegistroNuevo.perestcivil = this.TipoEstadoCivilSeleccionado.estadocivilid;
            this.personaRegistroNuevo.estadocivilnombre = this.TipoEstadoCivilSeleccionado.estadocivilnombre;
            this.personaRegistroNuevo.pertipodoc = this.TipoDocumentoSeleccionado.tipodocid;
            this.personaRegistroNuevo.pergenero = this.TipoGeneroSeleccionado.generoid;
            this.personaRegistroNuevo.perpais = this.TipoPaisSeleccionado.paisid;
            this.personaRegistroNuevo.paisnombre = this.TipoPaisSeleccionado.paisnombre;
            this.personaRegistroNuevo.perciudad = this.TipoCiudadSeleccionado.ciudadid;
            this.personaRegistroNuevo.ciudadnombre = this.TipoCiudadSeleccionado.ciudadnombre;
            this.personaRegistroNuevo.perfoto = this.imagenName;
            console.log("Add Person: ", this. personaRegistroNuevo)
            this.personaService.gestionarPersona(this.personaRegistroNuevo).subscribe(
                (data: any) => {
                    this.personaNuevoDialog = false;
                    this.optionDialog = false;
                    this.messageService.add({ key: 'bc', severity: 'success', summary: 'Registro Correcto!', detail: 'La persona se registró correctamente en el sistema.', life: 3000 });
                    // this.ListarPersonas();
                    this.fListarPersonas();
                },
                (error: any) => {
                    console.error("Error: ", error['message']);
                    this.messageService.add({ key: 'bc', severity: 'error', summary: 'Problema', detail: 'Ocurrío un error en el registro de persona, verifique los campos ingresados.', life: 3000 });
                }
            );
        }
        else {
            if (this.archivos?.currentFiles) {
                this.imagenName = this.archivos.currentFiles[0].name;
                this.tipoUpdate = 2;
                const formData = new FormData();
                for (let i = 0; i < this.archivos.currentFiles.length; i++) {
                    const file: File = this.archivos.currentFiles[i];
                    formData.append('files[]', file, file.name);
                    formData.forEach((value, key) => {
                        console.log(key, value);
                    });
                }
                this.uploadService.uploadFiles(formData).subscribe(
                    (data: any) => {
                        this.personaDialog = false;
                        this.optionDialog = false;
                        this.messageService.add({ key: 'bc', severity: 'info', summary: 'Registro de Imagen!', detail: 'La imagen se registró correctamente en el sistema.', life: 2000 });
                        // this.ListarPersonas();
                        this.fListarPersonas();
                    },
                    (error: any) => {
                        console.error('Error en la carga:', error);
                    }
                );
            } else {
                this.tipoUpdate = 4;
                this.imagenName = null;
            }

            // this.personaRegistro = { ...this.persona };
            this.person = new Persona();
            this.person.tipo = this.tipoUpdate;
            this.person.perid = this.persona.perid;
            this.person.pernomcompleto = this.persona.pernomcompleto;
            this.person.perapepat = this.persona.perapepat;
            this.person.perapemat = this.persona.perapemat;
            this.person.pernombres = this.persona.pernombres;
            this.person.pernrodoc = this.persona.pernrodoc;
            this.person.perfoto = this.imagenName;
            this.person.perusumod = this.usuario.usuname;
            this.person.perestcivil = this.TipoEstadoCivilSeleccionado.estadocivilid;
            this.person.estadocivilnombre = this.TipoEstadoCivilSeleccionado.estadocivilnombre;
            this.person.pertipodoc = this.TipoDocumentoSeleccionado.tipodocid;
            this.person.pergenero = this.TipoGeneroSeleccionado.generoid;
            this.person.perpais = this.TipoPaisSeleccionado.paisid;
            this.person.paisnombre = this.TipoPaisSeleccionado.paisnombre;
            this.person.perciudad = this.TipoCiudadSeleccionado.ciudadid;
            this.person.ciudadnombre = this.TipoCiudadSeleccionado.ciudadnombre;
            this.person.perfecnac = this.persona.perfecnac;
            this.person.peremail = this.persona.datos[0].peremail;
            this.person.perdirec = this.persona.datos[0].perdirec;
            this.person.percelular = this.persona.datos[0].percelular;
            this.person.pertelefono = this.persona.datos[0].pertelefono;
            console.log("update person: ", this.person)
            this.loading = true;
            this.personaService.gestionarPersona(this.person).subscribe(
                (data: any) => {
                    this.personaDialog = false;
                    this.optionDialog = false;
                    this.person = new Persona();
                    this.messageService.add({ key: 'bc', severity: 'success', summary: 'Registro Correcto!', detail: 'La persona se modificó correctamente en el sistema.', life: 3000 });
                    this.fListarPersonas();
                    // this.ListarPersonas();
                    this.loading = false;
                },
                (error: any) => {
                    console.log("Error: ", error);
                    this.messageService.add({ key: 'bc', severity: 'error', summary: 'Problema', detail: 'Ocurrió un error en la modificación de la persona, por favor comuníquese con soporte.', life: 3000 });
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
        this.TipoCiudad = this.TipoCiudad.filter(ciudad => ciudad.paisid === 1);
        this.person = new Persona();
        this.TipoPaisSeleccionado = new TipoPais(1, "Ninguno");
        this.TipoCiudadSeleccionado = new TipoCiudad(1, "Ninguno", 1);
        this.TipoEstadoCivilSeleccionado = new TipoEstadoCivil(1, "Ninguno");
        this.TipoGeneroSeleccionado = new TipoGenero(0, "Ninguno");
        this.TipoDocumentoSeleccionado = new TipoDocumento(1, "Ninguno");
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
