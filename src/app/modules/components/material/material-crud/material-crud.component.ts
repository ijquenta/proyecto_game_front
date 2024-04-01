import { Component, OnInit, ViewChild} from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

import { FileUpload } from 'primeng/fileupload';
// Service
import { UsuarioService } from 'src/app/modules/service/data/usuario.service';
// Modelos
import { Persona } from 'src/app/modules/models/persona';
import { TipoPais, TipoCiudad, TipoEstadoCivil, TipoGenero, TipoDocumento } from 'src/app/modules/models/diccionario';
import { PersonaService } from 'src/app/modules/service/data/persona.service';
import { Nota } from 'src/app/modules/models/nota';
import { NotaService } from 'src/app/modules/service/data/nota.service';
import { PagoService } from 'src/app/modules/service/data/pago.service';
import { Pago } from 'src/app/modules/models/pago';
import { Material } from 'src/app/modules/models/material';
import { MaterialService } from 'src/app/modules/service/data/material.service';
import { Texto } from 'src/app/modules/models/texto';

import { Usuario } from 'src/app/modules/models/usuario';
// --------------- Importación de Autenticación
import { AuthService } from 'src/app/services/auth.service';
// --------------- Importación para validaciones
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { NgxSpinnerService } from 'ngx-spinner';
import { UploadService } from 'src/app/modules/service/data/upload.service';

interface UploadEvent {
    originalEvent: Event;
    files: File[];
}

@Component({
    templateUrl: './material-crud.component.html',
    providers: [MessageService],
    styleUrls: ['../../../../app.component.css']
})
export class MaterialCrudComponent implements OnInit {
    @ViewChild('fileUpload') fileUpload: FileUpload;
    uploadedFiles: any[] = [];

    Personas: Persona[] = [];
    Notas: Nota[] = [];
    Pagos: Pago[] = [];
    Materiales: Material[] = [];
    persona: Persona;
    personaRegistro: Persona;

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

    eliminarPersonaDialog: boolean = false;
    errors: any;
    personaDialog: boolean = false;
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
    loading: boolean = false;
    nombreArchivo: any;

    textos: Texto[] = [];
    texto = new Texto();

    //----------------Variables para validación----------------//
    textoForm: FormGroup;
    //----------------Variables para validación----------------//
    usuario: Usuario;
    // Variable para archivos
    archivos: any = {};

    constructor(
        public usuarioService: UsuarioService,
        private messageService: MessageService,
        public personaService: PersonaService,
        public notaService: NotaService,
        public pagoService: PagoService,
        public materialService: MaterialService,
        private formBuilder: FormBuilder, // formBuilder para utilzar las validaciones del react form valid
        private uploadService: UploadService,
        private spinner: NgxSpinnerService,
        private authService: AuthService
    ) {

    }

    ngOnInit() {
        // this.ListarPersonas();
        this.listarTextos();
        // this.LlenarTipoCombo();
        this.asignacionValidacionesTexto();
        // Obtener usuario
        this.getPerfilUsuario();

        this.statuses = [
            { label: 'Activo', value: 0 },
            { label: 'Inactivo', value: 1 },
        ];
    }
    // Obtener datos del perfil del usuario logeado
    getPerfilUsuario() {
        this.authService.getPerfil().subscribe(usuario => {
            this.usuario = usuario[0];
        });
    }
    asignacionValidacionesTexto() {
        this.textoForm = this.formBuilder.group({
            texid:[''],
            texnombre:['', [Validators.required]],
            textipo:['', [Validators.required]],
        });
    }
    vaciarFormulario(){
        this.textoForm.reset();
        this.fileUpload.clear();
    }
    insertarTexto(){
        if(this.textoForm.invalid){
            this.messageService.add({ severity: 'error', summary: '¡Oh no! error en el registro', detail: 'Por favor, asegúrate de completar todos los campos obligatorios y luego intenta nuevamente.', life: 5000 });
            return Object.values(this.textoForm.controls).forEach(control=>{
                control.markAllAsTouched();
                control.markAsDirty();
            })
        }
        if (this.archivos?.currentFiles && this.textoForm.valid) {
            this.cargarArchivos(this.archivos.currentFiles);
            this.texto = new Texto();
            this.texto.texnombre = this.textoForm.value.texnombre;
            this.texto.texdocumento = this.nombreArchivo;
            this.texto.textipo = this.textoForm.value.textipo;
            this.texto.texusureg = this.usuario.usuname;
            console.log("this.texto: ", this.texto)
            this.materialService.insertarTexto(this.texto).subscribe(
                (result: any) => {
                    console.log("result", result);
                    this.messageService.add({ severity: 'success', summary: '!Exito¡', detail: result['valor'] });
                    this.listarTextos();
                    this.textoForm.reset();
                    this.vaciarFormulario();
                },
                (error: any) => {
                    this.errors = error;
                    console.log("error", error);
                    this.messageService.add({severity: 'warn', summary: 'Error', detail: 'Algo salió mal!'});
                }
            );
        }
        else{
            this.messageService.add({ severity: 'info', summary: '¡Ups! no selecciono ningún documento', detail: 'Por favor, asegúrate seleccionar un documento y luego intenta nuevamente.', life: 5000 });
        }

    }

    onUpload(event: UploadEvent) {
        this.archivos = event;
        for(let file of event.files) {
            this.uploadedFiles.push(file);
        }
        this.messageService.add({severity: 'info', summary: 'Archivo', detail: 'Archivo seleccionado correctamente.'});
    }
    cargarArchivos(currentFiles: File[]): void {
        if (currentFiles) {
          const formData = new FormData();
          for (let i = 0; i < currentFiles.length; i++) {
            const file: File = currentFiles[i];
            // const nombrePersonaSinEspacios = pago.pernomcompleto.replace(/\s+/g, '');
            const complemento = "texto"
            const nombreArchivoSinEspacios = file.name.replace(/\s+/g, '');
            const cleanedFilename = nombreArchivoSinEspacios.replace(/[^\w.-]/g, '');
            this.nombreArchivo = complemento + '_' + cleanedFilename;
            formData.append('files[]', file, this.nombreArchivo);
          }
          this.uploadService.uploadFilesTexto(formData).subscribe(
            (data: any) => {
              this.fileUpload.clear();
              this.messageService.add({ severity: 'info', summary: '!Exito¡', detail: 'El documento se registró existosamente en el sistema.', life: 5000 });
            },
            (error: any) => {
              console.error('Error en la carga:', error);
            }
          );
        } else {
          console.warn('No se seleccionaron archivos.');
        }
    }
    verDocumentoTexto(pagarchivo: any){
        this.materialService.getFileTexto(pagarchivo);
    }
    getIconForFileType(fileType: string): string {
        if (fileType.startsWith('application/pdf')) {
          return 'assets/icons/pdf-icon.png'; // Ruta del ícono para PDF
        } else if (fileType.startsWith('application/msword') || fileType.startsWith('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
          return 'assets/icons/word-icon.png'; // Ruta del ícono para Word
        } else if (fileType.startsWith('application/vnd.ms-excel') || fileType.startsWith('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
          return 'assets/icons/excel-icon.png'; // Ruta del ícono para Excel
        } else {
          return 'assets/icons/default-icon.png'; // Ruta del ícono predeterminado para otros tipos de archivo
        }
      }
    LlenarTipoCombo() {
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
        this.materialService.listarMaterial().subscribe((data: any) => {
            this.Materiales = data;
            console.log("Listar Materiales:", this.Materiales)
        });
    }

    listarTextos(){
        this.loading = true;
        this.materialService.listarTexto().subscribe((data: any) => {
            this.textos = data;
            this.loading = false;
            console.log("Listar Textos:", this.textos)
        })
    }

    onChangeTipoPais(data: any) {
        this.TipoCiudad = this.TipoCiudadRespaldo;
        this.id = data.value.paisid;
        this.TipoCiudad = this.TipoCiudad.filter(ciudad => ciudad.paisid === this.id);
    }

    modificarPersona(data: Persona) {
        this.persona = { ...data };
        console.log("modificar Persona: ", this.persona);
        this.personaDialog = true;
        this.TipoEstadoCivilSeleccionado = new TipoEstadoCivil(this.persona.perestcivil, this.persona.estadocivilnombre);
        this.TipoGeneroSeleccionado = new TipoGenero(this.persona.pergenero, this.persona.generonombre);
        this.TipoDocumentoSeleccionado = new TipoDocumento(this.persona.pertipodoc, this.persona.tipodocnombre);
        this.TipoPaisSeleccionado = new TipoPais(this.persona.perpais, this.persona.paisnombre);
        this.TipoCiudadSeleccionado = new TipoCiudad(this.persona.perciudad, this.persona.ciudadnombre, this.persona.perpais);
        // console.log("tciudad: ", this.TipoCiudadSeleccionado)
        this.persona.perfecnac = new Date(this.persona.perfecnac);
        this.optionDialog = false;
    }

    enviarFormulario() {
        if (this.optionDialog) {
            this.personaRegistro = { ...this.persona };
            this.personaRegistro.tipo = 1;
            this.personaRegistro.perid = null;
            this.personaRegistro.perfoto = null;
            this.personaRegistro.perusureg = 'ijquenta';
            this.personaRegistro.perestcivil = this.TipoEstadoCivilSeleccionado.estadocivilid;
            this.personaRegistro.pertipodoc = this.TipoDocumentoSeleccionado.tipodocid;
            this.personaRegistro.pergenero = this.TipoGeneroSeleccionado.generoid;
            this.personaRegistro.perpais = this.TipoPaisSeleccionado.paisid;
            this.personaRegistro.perciudad = this.TipoCiudadSeleccionado.ciudadid;
            console.log("personaRegistro: ", this.personaRegistro);
            this.personaService.gestionarPersona(this.personaRegistro).subscribe(
                (data: any) => {
                    console.log("Gestionar Persona: ", data);
                    this.personaDialog = false;
                    this.optionDialog = false;
                    this.messageService.add({ severity: 'success', summary: 'Registro Correcto!', detail: 'La persona se registró correctamente en el sistema.', life: 3000 });
                    this.ListarPersonas();
                },
                (error: any) => {
                    console.error("Error: ", error['message']);
                    this.messageService.add({ severity: 'error', summary: 'Problema', detail: 'Ocurrío un error en el registro de persona, verifique los campos ingresados.', life: 3000 });
                }
            );
        }
        else {
            this.personaRegistro = { ...this.persona };
            this.personaRegistro.tipo = 2;
            this.personaRegistro.perfoto = null;
            this.personaRegistro.perusureg = 'ijquenta';
            this.personaRegistro.perestcivil = this.TipoEstadoCivilSeleccionado.estadocivilid;
            this.personaRegistro.pertipodoc = this.TipoDocumentoSeleccionado.tipodocid;
            this.personaRegistro.pergenero = this.TipoGeneroSeleccionado.generoid;
            this.personaRegistro.perpais = this.TipoPaisSeleccionado.paisid;
            this.personaRegistro.perciudad = this.TipoCiudadSeleccionado.ciudadid;
            console.log("personaRegistro: ", this.personaRegistro);
            this.personaService.gestionarPersona(this.personaRegistro).subscribe(
                (data: any) => {
                    console.log("Gestionar Persona: ", data);
                    this.personaDialog = false;
                    this.optionDialog = false;
                    this.messageService.add({ severity: 'success', summary: 'Registro Correcto!', detail: 'La persona se modificó correctamente en el sistema.', life: 3000 });
                    this.ListarPersonas();
                },
                (error: any) => {
                    console.log("Error: ", error);
                    this.messageService.add({ severity: 'error', summary: 'Problema', detail: 'Ocurrió un error en la modificación de la persona, por favor comuníquese con soporte.', life: 3000 });
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
        this.persona = new Persona();
        this.TipoPaisSeleccionado = new TipoPais(1, "Ninguno");
        this.TipoCiudadSeleccionado = new TipoCiudad(1, "Ninguno", 1);
        this.TipoEstadoCivilSeleccionado = new TipoEstadoCivil(1, "Ninguno");
        this.TipoGeneroSeleccionado = new TipoGenero(1, "Femenino");
        this.TipoDocumentoSeleccionado = new TipoDocumento(1, "Ninguno");
        this.personaDialog = true;
        this.optionDialog = true;
    }
    eliminarPersona() {
        console.log("eliminarPersona: ", this.persona);
        this.personaRegistro = { ...this.persona };
        this.personaRegistro.tipo = 3;
        this.personaService.gestionarPersona(this.personaRegistro).subscribe(
            (data: any) => {
                console.log("Gestionar Persona: ", data);
                this.eliminarPersonaDialog = false;
                this.optionDialog = false;
                this.messageService.add({ severity: 'success', summary: 'Registro Correcto!', detail: 'La persona se elimino correctamente en el sistema.', life: 3000 });
                this.ListarPersonas();
            }),
            (error: any) => {
                console.log("Error: ", error);
                this.messageService.add({ severity: 'error', summary: 'Algo salio mal!', detail: 'Ocurrio un error en la eliminación de , porfavor comunicarse con soporte.', life: 3000 });
            }
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


    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }
}
