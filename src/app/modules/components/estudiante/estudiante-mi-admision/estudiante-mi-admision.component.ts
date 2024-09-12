import { Component, OnInit, ChangeDetectorRef, ViewChild, AfterViewInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
// Service
import { UsuarioService } from 'src/app/modules/service/data/usuario.service';
// Modelos
import { Persona, PersonaInfoPersonal, PersonaInfoAcademica, PersonaInfoMinisterial, PersonaDocAdmision, TipoProfesion, TipoEducacion, TipoCargo, TipoGestion } from 'src/app/modules/models/persona';
import { EstudianteService } from 'src/app/modules/service/data/estudiante.service';
import { Usuario } from 'src/app/modules/models/usuario';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';

import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { PersonaService } from 'src/app/modules/service/data/persona.service';
import { AuthService } from 'src/app/modules/service/core/auth.service';
import { FileUpload } from 'primeng/fileupload';

interface UploadEvent {
    originalEvent: Event;
    files: File[];
}

@Component({
    templateUrl: './estudiante-mi-admision.component.html',
    providers: [MessageService],
    styleUrls: ['../../../../app.component.css']
})
export class EstudianteMiAdmisionComponent implements AfterViewInit, OnInit {
    @ViewChild('fileUploadperfoto') fileUploadperfoto: FileUpload;
    @ViewChild('fileUploadperfotoci') fileUploadperfotoci: FileUpload;
    @ViewChild('fileUploadperfototitulo') fileUploadperfototitulo: FileUpload;
    @ViewChild('fileUploadpercartapastor') fileUploadpercartapastor: FileUpload;

    Personas: Persona[] = [];
    persona: Persona;
    usuario: Usuario;

    estudianteForm: FormGroup;

    userProfilePhoto = environment.API_URL_PROFILE_PHOTO;
    userProfilePhotoEmpty = '../../../../../assets/images/login/sin_foto_perfil.png';
    userProfilePhotoDocumentoAdmision = environment.API_URL_DOCUMENTO_ADMISION;

    personasFiltradas: any[] | undefined;

    buscarForm: FormGroup;
    showDialogPersona: boolean = false;
    showDialogPersonaInformacionPersonal: boolean = false;
    showDialogPersonaInformacionAcademica: boolean = false;
    showDialogPersonaInformacionMinisterial: boolean = false;

    showDialogPersonaDocumentoAdmision: boolean = false;

    optionDialogInformacionPersonal: boolean = false;

    informacionPersonalDialog: boolean = false;
    informacionAcademicaDialog: boolean = false;
    informacionMinisterialDialog: boolean = false;

    infoPersonal: PersonaInfoPersonal;
    infoAcademica: PersonaInfoAcademica[];
    infoMinisterial: PersonaInfoMinisterial[];
    documentoAdmision: PersonaDocAdmision;

    infopersonal: PersonaInfoPersonal;
    infoacademica: PersonaInfoAcademica;
    infoministerial: PersonaInfoMinisterial;
    docAdmision: PersonaDocAdmision;

    infoPersonalForm: FormGroup;
    infoAcademicaForm: FormGroup;
    infoMinisterialForm: FormGroup;
    docAdmisionForm: FormGroup;

    loadingIP: boolean = false;
    loadingIA: boolean = false;
    loadingIM: boolean = false;
    loadingDA: boolean = false;

    TipoProfesion: TipoProfesion[] = [];
    TipoEducacion: TipoEducacion[] = [];
    TipoCargo: TipoCargo[] = [];

    TipoGestion: any[] = [];

    percartapastorFile: File | null = null;
    percartapastorFileUrl: string | null = null;

    perfotoFile: File | null = null;
    perfotoFileUrl: string | null = null;

    perfotociFile: File | null = null;
    perfotociFileUrl: string | null = null;

    perfototituloFile: File | null = null;
    perfototituloFileUrl: string | null = null;

    items: MenuItem[] | undefined;
    home: MenuItem | undefined;

    zoom = 1.0;

    documentoAdmisionDialog: boolean = false;

    optionDialogInformacionAcademica: boolean = false;
    optionDialogInformacionMinisterial: boolean = false;
    optionDialogDocumentoAdmision: boolean = false;

    stateOptionsEstado: any[] = [
        { label: 'Activo', value: 1 },
        { label: 'Inactivo', value: 0 }
    ];

    stateOptions: any[] = [
        { label: 'Activo', value: 'activo' },
        { label: 'Inactivo', value: 'inactivo' }
    ];

    archivos: any = {};
    uploadedFiles: any[] = [];

    fileurlpercartapastor: any;
    fileurlperfoto: any;
    fileurlperfototitulo: any;
    fileurlperfotoci: any;


    constructor(
        public usuarioService: UsuarioService,
        private authService: AuthService,
        private messageService: MessageService,
        public personaService: PersonaService,
        public estudianteService: EstudianteService,
        private spinner: NgxSpinnerService,
        private formBuilder: FormBuilder,
        private cdr: ChangeDetectorRef
    ) {

    }

    ngAfterViewInit() {
        this.cdr.detectChanges();
    }

    ngOnInit() {
        this.items = [{ label: 'Estudiantes'}, { label: 'Mi Admisión', routerLink:''},];
        this.home = { icon: 'pi pi-home', routerLink: '/' };
        this.obtenerUsuario()
        this.obtenerPersonas();
        this.asignacionVariablesValidaciones();
        this.generarGestiones(50);
    }

     // Usuario
     obtenerUsuario() {
        this.authService.usuario$.subscribe((user => {
            if (user) {
                if (Array.isArray(user) && user.length > 0) {
                    this.usuario = user[0];
                    this.seleccionarPersona(this.usuario.perid);
                }
            }
        }));
    }

    // Funciones importantes

    asignacionVariablesValidaciones(){
        this.buscarForm = this.formBuilder.group({
            buscar: ['', Validators.required],
        });
        this.estudianteForm = this.formBuilder.group({
            perid: [''],
            pernrohijos: ['', [Validators.required]],
            perprofesion: ['', [Validators.required]],
            perfeclugconversion: ['', [Validators.required]],
            perbautismoaguas: ['',[Validators.required]],
            perbautismoespiritu: ['', [Validators.required]],
            pernomdiriglesia: ['', [Validators.required]],
            pernompastor: ['', [Validators.required]],
        });
        this.infoPersonalForm = this.formBuilder.group({
            perid: [''],
            peredad: ['', [Validators.required]],
            pernrohijos: ['', [Validators.required]],
            tipoProfesion: ['', [Validators.required]],
            perlugconversion: ['', [Validators.required]],
            perfecconversion: ['', [Validators.required]],
            perbautizoagua: ['',[Validators.required]],
            perbautizoespiritu: ['', [Validators.required]],
            pernomiglesia: ['', [Validators.required]],
            perdiriglesia: ['', [Validators.required]],
            pernompastor: ['', [Validators.required]],
            percelpastor: ['', [Validators.required]],
            perobservacion: [''],
            perestado: ['', [Validators.required]],
            perexperiencia: ['', [Validators.required]],
            permotivo: ['', [Validators.required]],
            perplanesmetas: ['', [Validators.required]],
        });
        this.infoAcademicaForm = this.formBuilder.group({
            perinfoaca: [''],
            perid: [''],
            tipoEducacion: ['', [Validators.required]],
            pernominstitucion: ['', [Validators.required]],
            perdirinstitucion: ['', [Validators.required]],
            pergescursadas: ['', [Validators.required]],
            perfechas: ['', [Validators.required]],
            pertitulo: ['', [Validators.required]],
            perobservacion: [''],
            perestado: ['', [Validators.required]]
        });
        this.infoMinisterialForm = this.formBuilder.group({
            perinfomin: [''],
            perid: [''],
            pernomiglesia: ['', [Validators.required]],
            tipoCargo: ['', [Validators.required]],
            pergestion: ['', [Validators.required]],
            perobservacion: [''],
            perestado: ['', [Validators.required]]
        });
        this.docAdmisionForm = this.formBuilder.group({
            perid: [''],
            perfoto: ['', [Validators.required]],
            perfotoci: ['', [Validators.required]],
            perfototitulo: ['', [Validators.required]],
            percartapastor: ['', [Validators.required]],
            perobservacion: [''],
            perestado: ['', [Validators.required]]
        });
    }

    generarGestiones(cantidad: number){
        const gestionActual = new Date().getFullYear();
        for (let i = 0; i < cantidad; i++){
            const gestion = gestionActual - i;
            this.TipoGestion.push({gesid: gestion})
        }
    }


    obtenerPersonas() {
        this.personaService.getPersons().subscribe((data: any) => {
            this.Personas = data;
        });
    }

    // Busqueda
    limpiar(){
        this.showDialogPersona = false;
        this.showDialogPersonaInformacionPersonal = false;
        this.showDialogPersonaInformacionAcademica = false;
        this.showDialogPersonaInformacionMinisterial = false;
        this.showDialogPersonaDocumentoAdmision = false;
        this.buscarForm.reset();
        this.persona = new Persona();
    }

    filtrarPersona(event: AutoCompleteCompleteEvent){
        let filtrado: any[] = [];
        let consulta = event.query;
        for(let i = 0; i < (this.Personas as any[]).length; i++){
            let persona = this.Personas[i];
            if(
                persona.pernrodoc?.toLowerCase().indexOf(consulta.toLowerCase()) == 0 ||
                persona.perapepat?.toLowerCase().indexOf(consulta.toLowerCase()) == 0 ||
                persona.perapemat?.toLowerCase().indexOf(consulta.toLowerCase()) == 0 ||
                persona.pernombres?.toLowerCase().indexOf(consulta.toLowerCase()) == 0 ||
                persona.pernomcompleto?.toLowerCase().indexOf(consulta.toLowerCase()) == 0
            ){
                filtrado.push(persona);
            }
        }
        this.personasFiltradas = filtrado;
    }

    seleccionarPersona(perid: any){
        this.infoPersonal = new PersonaInfoPersonal();

        this.persona = new Persona();
        this.personaService.showPersonData(this.usuario.perid).subscribe({
            next: (result: any) => {
                this.persona = result['data'];
            },
            error: (error: any) => {
                console.error("Error al obtener el perfil: ", error);
            }
        });

        this.showDialogPersona = true;
        this.showDialogPersonaInformacionPersonal = true;
        this.showDialogPersonaInformacionAcademica = true;
        this.showDialogPersonaInformacionMinisterial = true;
        this.showDialogPersonaDocumentoAdmision = true;
        this.listarInformacionPersonal(perid);
        this.listarInformacionAcademica(perid);
        this.listarInformacionMinisterial(perid);
        this.listarDocumentoAdmision(perid);
    }

    // Tipo Profesion
    listarTipoProfesion(){
        this.personaService.listarTipoProfesion().subscribe(
            (data: any) => {
                this.TipoProfesion = Array.isArray(data["data"]) ? data["data"].map((item: any) => {
                    return {
                        proid: item.proid,
                        pronombre: item.pronombre
                    };
                }) : [];
            },
            (error: any) => {
                console.error("Error: ", error['message']);
                this.messageService.add({ severity: 'error', summary: 'Problema', detail: 'Ocurrío un error en el registro de persona, verifique los campos ingresados.', life: 3000 });
            }
        );
    }

    // Tipo Educación
    listarTipoEducacion(){
        this.personaService.listarTipoEducacion().subscribe(
            (data: any) => {
                this.TipoEducacion = Array.isArray(data["data"]) ? data["data"].map((item: any) => {
                    return {
                        eduid: item.eduid,
                        edunombre: item.edunombre
                    };
                }) : [];
            },
            (error: any) => {
                console.error("Error: ", error['message']);
                this.messageService.add({ severity: 'error', summary: 'Problema', detail: 'Ocurrío un error en el registro de persona, verifique los campos ingresados.', life: 3000 });
            }
        );
    }

    // Tipo Cargo
    listarTipoCargo(){
        this.personaService.listarTipoCargo().subscribe(
            (data: any) => {
                this.TipoCargo = Array.isArray(data["data"]) ? data["data"].map((item: any) => {
                    return {
                        carid: item.carid,
                        carnombre: item.carnombre
                    };
                }) : [];
            },
            (error: any) => {
                console.error("Error: ", error['message']);
                this.messageService.add({ severity: 'error', summary: 'Problema', detail: 'Ocurrío un error en el registro de persona, verifique los campos ingresados.', life: 3000 });
            }
        );
    }

    // Información Personal

    listarInformacionPersonal(perid: number){
        this.showDialogPersonaInformacionPersonal = true;
        this.spinner.show();
        this.personaService.listarInformacionPersonal(perid).subscribe({
            next: (data: any) => {
                this.infoPersonal = data["data"][0] ? data["data"][0]: null;
                this.spinner.hide();
            },
            error: (error: any) => {
                console.error("Error: ", error['message']);
                this.messageService.add({ severity: 'error', summary: 'Problema', detail: 'Ocurrío un error en el registro de persona, verifique los campos ingresados.', life: 3000 });
                this.spinner.hide();
            }
        });
    }

    adicionarInformacionPersonal() {
        this.listarTipoProfesion();
        this.informacionPersonalDialog = true;
        this.optionDialogInformacionPersonal = true;
        this.persona = { ...this.persona };

        // Convertir perfecnac a una instancia de Date
        const fechaNacimiento = new Date(this.persona.perfecnac);

        // Verificar si la fecha es válida
        if (!isNaN(fechaNacimiento.getTime())) {
            const hoy = new Date();
            let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
            const diferenteciaMes = hoy.getMonth() - fechaNacimiento.getMonth();

            // Ajustar la edad si el cumpleaños no ha ocurrido todavía este año
            if (diferenteciaMes < 0 || (diferenteciaMes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
                edad--;
            }
            this.infoPersonalForm.patchValue({
                perid: this.persona.perid,
                peredad: edad
            });
        } else {
            console.error("perfecnac no es una fecha válida");
        }
    }

    modificarInformacionPersonal(infoper: any){
        this.infoPersonalForm.reset();
        this.listarTipoProfesion();
        this.informacionPersonalDialog = true;
        this.infopersonal = {...infoper};
        this.infoPersonalForm.patchValue({
            perid: this.infopersonal.perid,
            peredad: this.infopersonal.peredad,
            pernrohijos: this.infopersonal.pernrohijos,
            tipoProfesion: new TipoProfesion(this.infopersonal.perprofesion, this.infopersonal.pronombre),
            perlugconversion: this.infopersonal.perlugconversion,
            perfecconversion: new Date(this.infopersonal.perfecconversion),
            perbautizoagua: this.infopersonal.perbautizoagua,
            perbautizoespiritu: this.infopersonal.perbautizoespiritu,
            pernomiglesia: this.infopersonal.pernomiglesia,
            perdiriglesia: this.infopersonal.perdiriglesia,
            pernompastor: this.infopersonal.pernompastor,
            percelpastor: this.infopersonal.percelpastor,
            perobservacion: this.infopersonal.perobservacion,
            perestado: this.infopersonal.perestado,
            perexperiencia: this.infopersonal.perexperiencia,
            permotivo: this.infopersonal.permotivo,
            perplanesmetas: this.infopersonal.perplanesmetas
        });
    }

    ocultarInformacionPersonal(){
        this.informacionPersonalDialog = false;
        this.infoPersonalForm.reset();
    }

    enviarInformacionPersonal(){
        this.persona = {...this.persona}
        if(this.infoPersonalForm.invalid){
            this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Por favor, verifica la información ingresada e intenta nuevamente.', life: 3000 });
            return Object.values(this.infoPersonalForm.controls).forEach(control=>{
                control.markAllAsTouched();
                control.markAsDirty();
            })
        }
        if (this.optionDialogInformacionPersonal) {
            this.infopersonal = new PersonaInfoPersonal();
            this.infopersonal.perid = this.infoPersonalForm.value.perid;
            this.infopersonal.peredad = this.infoPersonalForm.value.peredad;
            this.infopersonal.pernrohijos = this.infoPersonalForm.value.pernrohijos;
            this.infopersonal.perprofesion = this.infoPersonalForm.value.tipoProfesion.proid;
            this.infopersonal.perlugconversion = this.infoPersonalForm.value.perlugconversion;
            this.infopersonal.perfecconversion = this.infoPersonalForm.value.perfecconversion;
            this.infopersonal.perbautizoagua = this.infoPersonalForm.value.perbautizoagua;
            this.infopersonal.perbautizoespiritu = this.infoPersonalForm.value.perbautizoespiritu;
            this.infopersonal.pernomiglesia = this.infoPersonalForm.value.pernomiglesia;
            this.infopersonal.perdiriglesia = this.infoPersonalForm.value.perdiriglesia;
            this.infopersonal.pernompastor = this.infoPersonalForm.value.pernompastor;
            this.infopersonal.percelpastor = this.infoPersonalForm.value.percelpastor;
            this.infopersonal.perobservacion = this.infoPersonalForm.value.perobservacion;
            this.infopersonal.perestado = this.infoPersonalForm.value.perestado;
            this.infopersonal.perusureg = this.usuario.usuname;
            this.infopersonal.perexperiencia = this.infoPersonalForm.value.perexperiencia;
            this.infopersonal.permotivo = this.infoPersonalForm.value.permotivo;
            this.infopersonal.perplanesmetas = this.infoPersonalForm.value.perplanesmetas;
            this.loadingIP=true;
            this.personaService.adicionarInformacionPersonal(this.infopersonal).subscribe(
                (data: any) => {
                    this.optionDialogInformacionPersonal = false;
                    this.messageService.add(
                        { severity: 'success',
                          summary: 'Información Personal',
                          detail: 'Se registró correctamente en el sistema.',
                          life: 3000
                        }
                    );

                    this.listarInformacionPersonal(data.data.perid);
                    this.informacionPersonalDialog = false;
                    this.loadingIP=false;
                },
                (error: any) => {
                    console.error("Error: ", error['message']);
                    this.messageService.add(
                        { severity: 'error',
                          summary: 'Problema',
                          detail: 'Ocurrío un error en el registro, verifique los campos ingresados.',
                          life: 3000
                        }
                    );
                }
            );
        }
        if(!this.optionDialogInformacionPersonal){
            this.infopersonal = new PersonaInfoPersonal();
            this.infopersonal.perid = this.infoPersonalForm.value.perid;
            this.infopersonal.peredad = this.infoPersonalForm.value.peredad;
            this.infopersonal.pernrohijos = this.infoPersonalForm.value.pernrohijos;
            this.infopersonal.perprofesion = this.infoPersonalForm.value.tipoProfesion.proid;
            this.infopersonal.perlugconversion = this.infoPersonalForm.value.perlugconversion;
            this.infopersonal.perfecconversion = this.infoPersonalForm.value.perfecconversion;
            this.infopersonal.perbautizoagua = this.infoPersonalForm.value.perbautizoagua;
            this.infopersonal.perbautizoespiritu = this.infoPersonalForm.value.perbautizoespiritu;
            this.infopersonal.pernomiglesia = this.infoPersonalForm.value.pernomiglesia;
            this.infopersonal.perdiriglesia = this.infoPersonalForm.value.perdiriglesia;
            this.infopersonal.pernompastor = this.infoPersonalForm.value.pernompastor;
            this.infopersonal.percelpastor = this.infoPersonalForm.value.percelpastor;
            this.infopersonal.perobservacion = this.infoPersonalForm.value.perobservacion;
            this.infopersonal.perestado = this.infoPersonalForm.value.perestado;
            this.infopersonal.perusumod = this.usuario.usuname;
            this.infopersonal.perexperiencia = this.infoPersonalForm.value.perexperiencia;
            this.infopersonal.permotivo = this.infoPersonalForm.value.permotivo;
            this.infopersonal.perplanesmetas = this.infoPersonalForm.value.perplanesmetas;
            this.loadingIP=true;
            this.personaService.modificarInformacionPersonal(this.infopersonal, this.infopersonal.perid).subscribe(
                (data: any) => {
                    this.optionDialogInformacionPersonal = false;
                    this.messageService.add(
                        { severity: 'success',
                          summary: 'Información Personal',
                          detail: 'Se modifidicó correctamente en el sistema.',
                          life: 3000
                        });

                    this.listarInformacionPersonal(data.data.perid);
                    this.informacionPersonalDialog = false;
                    this.loadingIP=false;
                },
                (error: any) => {
                    console.error("Error: ", error['message']);
                    this.messageService.add(
                        { severity: 'error',
                          summary: 'Problema',
                          detail: 'Ocurrío un error en el registro, verifique los campos ingresados.',
                          life: 3000
                        });
                }
            );
        }
    }

    // Información Académica

    listarInformacionAcademica(perid: number){
        this.showDialogPersonaInformacionAcademica = true;
        this.personaService.listarInformacionAcademica(perid).subscribe(
            (data: any) => {
                this.infoAcademica = Array.isArray(data["data"]) ? data["data"] : [];
            },
            (error: any) => {
                console.error("Error: ", error['message']);
                this.messageService.add({ severity: 'error', summary: 'Problema', detail: 'Ocurrío un error en el registro de persona, verifique los campos ingresados.', life: 3000 });
            }
        );
    }

    adicionarInformacionAcademica(){
        this.infoAcademicaForm.reset();
        this.listarTipoEducacion();
        this.informacionAcademicaDialog = true;
        this.optionDialogInformacionAcademica = true;
        this.persona = { ...this.persona};
        this.infoAcademicaForm.patchValue({
            perid: this.persona.perid,
        });
    }

    modificarInformacionAcademica(infoaca: any){

        this.infoAcademicaForm.reset();
        this.listarTipoEducacion();
        this.informacionAcademicaDialog = true;
        this.optionDialogInformacionAcademica = false;
        this.infoacademica = {...infoaca};
        this.infoAcademicaForm.patchValue({
            perinfoaca: this.infoacademica.perinfoaca,
            perid: this.infoacademica.perid,
            tipoEducacion: new TipoEducacion(this.infoacademica.pereducacion, this.infoacademica.edunombre),
            pernominstitucion: this.infoacademica.pernominstitucion,
            perdirinstitucion: this.infoacademica.perdirinstitucion,
            pergescursadas: this.infoacademica.pergescursadas,
            perfechas: this.infoacademica.perfechas,
            pertitulo: this.infoacademica.pertitulo,
            perobservacion: this.infoacademica.perobservacion,
            perestado: this.infoacademica.perestado
        });
    }

    ocultarInformacionAcademica(){
        this.informacionAcademicaDialog = false;
        this.infoAcademicaForm.reset();
    }

    enviarInformacionAcademica(){
        this.persona = {...this.persona}
        if(this.infoAcademicaForm.invalid){
            this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Por favor, verifica la información ingresada e intenta nuevamente.', life: 3000 });
            return Object.values(this.infoAcademicaForm.controls).forEach(control=>{
                control.markAllAsTouched();
                control.markAsDirty();
            })
        }

        this.infoacademica = new PersonaInfoAcademica();

        if (this.optionDialogInformacionAcademica) {
            this.infoacademica.perid = this.infoAcademicaForm.value.perid;
            this.infoacademica.pereducacion = this.infoAcademicaForm.value.tipoEducacion.eduid;
            this.infoacademica.pernominstitucion = this.infoAcademicaForm.value.pernominstitucion;
            this.infoacademica.perdirinstitucion = this.infoAcademicaForm.value.perdirinstitucion;
            this.infoacademica.pergescursadas = this.infoAcademicaForm.value.pergescursadas;
            this.infoacademica.perfechas = this.infoAcademicaForm.value.perfechas;
            this.infoacademica.pertitulo = this.infoAcademicaForm.value.pertitulo;
            this.infoacademica.perobservacion = this.infoAcademicaForm.value.perobservacion;
            this.infoacademica.perestado = this.infoAcademicaForm.value.perestado;
            this.infoacademica.perusureg = this.usuario.usuname;
            this.loadingIA=true;
            this.personaService.adicionarInformacionAcademica(this.infoacademica).subscribe(
                (data: any) => {
                    this.optionDialogInformacionAcademica = false;
                    this.messageService.add(
                        { severity: 'success',
                          summary: 'Información Académica',
                          detail: 'Se registró correctamente en el sistema.',
                          life: 3000
                        }
                    );
                    this.listarInformacionAcademica(data.data.perid);
                    this.informacionAcademicaDialog = false;
                    this.loadingIA=false;
                },
                (error: any) => {
                    console.error("Error: ", error['message']);
                    this.messageService.add(
                        { severity: 'error',
                          summary: 'Problema',
                          detail: 'Ocurrío un error en el registro, verifique los campos ingresados.',
                          life: 3000
                        }
                    );
                }
            );
        }
        if(!this.optionDialogInformacionAcademica){
            this.infoacademica.perinfoaca = this.infoAcademicaForm.value.perinfoaca;
            this.infoacademica.perid = this.infoAcademicaForm.value.perid;
            this.infoacademica.pereducacion = this.infoAcademicaForm.value.tipoEducacion.eduid;
            this.infoacademica.pernominstitucion = this.infoAcademicaForm.value.pernominstitucion;
            this.infoacademica.perdirinstitucion = this.infoAcademicaForm.value.perdirinstitucion;
            this.infoacademica.pergescursadas = this.infoAcademicaForm.value.pergescursadas;
            this.infoacademica.perfechas = this.infoAcademicaForm.value.perfechas;
            this.infoacademica.pertitulo = this.infoAcademicaForm.value.pertitulo;
            this.infoacademica.perobservacion = this.infoAcademicaForm.value.perobservacion;
            this.infoacademica.perestado = this.infoAcademicaForm.value.perestado;
            this.infoacademica.perusumod = this.usuario.usuname;
            this.loadingIA=true;
            this.personaService.modificarInformacionAcademica(this.infoacademica, this.infoacademica.perinfoaca).subscribe(
                (data: any) => {
                    this.optionDialogInformacionAcademica = false;
                    this.messageService.add(
                        { severity: 'success',
                          summary: 'Información Académica',
                          detail: 'Se modifidicó correctamente en el sistema.',
                          life: 3000
                        });
                    this.listarInformacionAcademica(data.data.perid);
                    this.informacionAcademicaDialog = false;
                    this.loadingIA=false;
                },
                (error: any) => {
                    console.error("Error: ", error['message']);
                    this.messageService.add(
                        { severity: 'error',
                          summary: 'Problema',
                          detail: 'Ocurrío un error en el registro, verifique los campos ingresados.',
                          life: 3000
                        });
                }
            );
        }

    }

    // Información Ministerial

    listarInformacionMinisterial(perid: number){
        this.showDialogPersonaInformacionMinisterial = true;
        this.personaService.listarInformacionMinisterial(perid).subscribe(
            (data: any) => {
                this.infoMinisterial = Array.isArray(data["data"]) ? data["data"] : [];
            },
            (error: any) => {
                console.error("Error: ", error['message']);
                this.messageService.add({ severity: 'error', summary: 'Problema', detail: 'Ocurrío un error en el registro de persona, verifique los campos ingresados.', life: 3000 });
            }
        );
    }

    adicionarInformacionMinisterial(){
        this.infoMinisterialForm.reset();
        this.listarTipoCargo();
        this.informacionMinisterialDialog = true;
        this.optionDialogInformacionMinisterial = true;
        this.persona = { ...this.persona};
        this.infoMinisterialForm.patchValue({
            perid: this.persona.perid
        });
    }

    modificarInformacionMinisterial(infomin: any){
        this.listarTipoCargo();
        this.infoMinisterialForm.reset();
        this.informacionMinisterialDialog = true;
        this.optionDialogInformacionMinisterial = false;
        this.infoministerial = {...infomin};
        this.infoMinisterialForm.patchValue({
            perinfomin: this.infoministerial.perinfomin,
            perid: this.infoministerial.perid,
            pernomiglesia: this.infoministerial.pernomiglesia,
            pergestion: new TipoGestion(this.infoministerial.pergestion),
            tipoCargo: new TipoCargo(this.infoministerial.percargo, this.infoministerial.carnombre),
            perobservacion: this.infoministerial.perobservacion,
            perestado: this.infoministerial.perestado
        });
    }

    ocultarInformacionMinisterial(){
        this.informacionMinisterialDialog = false;
        this.infoMinisterialForm.reset();
    }

    enviarInformacionMinisterial(){
        this.persona = {...this.persona}
        if(this.infoMinisterialForm.invalid){
            this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Por favor, verifica la información ingresada e intenta nuevamente.', life: 3000 });
            return Object.values(this.infoMinisterialForm.controls).forEach(control=>{
                control.markAllAsTouched();
                control.markAsDirty();
            })
        }
        this.infoministerial = new PersonaInfoMinisterial();
        if (this.optionDialogInformacionMinisterial) {
            this.infoministerial.perid = this.infoMinisterialForm.value.perid;
            this.infoministerial.percargo = this.infoMinisterialForm.value.tipoCargo.carid;
            this.infoministerial.pernomiglesia = this.infoMinisterialForm.value.pernomiglesia;
            this.infoministerial.pergestion = this.infoMinisterialForm.value.pergestion.gesid;
            this.infoministerial.perobservacion = this.infoMinisterialForm.value.perobservacion;
            this.infoministerial.perusureg = this.usuario.usuname;
            this.infoministerial.perestado = this.infoMinisterialForm.value.perestado;
            this.loadingIM=true;
            this.personaService.adicionarInformacionMinisterial(this.infoministerial).subscribe(
                (data: any) => {
                    this.optionDialogInformacionMinisterial = false;
                    this.messageService.add(
                        { severity: 'success',
                          summary: 'Información Ministerial',
                          detail: 'Se registró correctamente en el sistema.',
                          life: 3000
                        }
                    );
                    this.listarInformacionMinisterial(data.data.perid);
                    this.informacionMinisterialDialog = false;
                    this.loadingIM=false;
                },
                (error: any) => {
                    console.error("Error: ", error['message']);
                    this.messageService.add(
                        { severity: 'error',
                          summary: 'Problema',
                          detail: 'Ocurrío un error en el registro, verifique los campos ingresados.',
                          life: 3000
                        }
                    );
                }
            );
        }
        if(!this.optionDialogInformacionMinisterial){
            this.infoministerial.perinfomin = this.infoMinisterialForm.value.perinfomin;
            this.infoministerial.perid = this.infoMinisterialForm.value.perid;
            this.infoministerial.percargo = this.infoMinisterialForm.value.tipoCargo.carid;
            this.infoministerial.pernomiglesia = this.infoMinisterialForm.value.pernomiglesia;
            this.infoministerial.pergestion = this.infoMinisterialForm.value.pergestion.gesid;
            this.infoministerial.perobservacion = this.infoMinisterialForm.value.perobservacion;
            this.infoministerial.perestado = this.infoMinisterialForm.value.perestado;
            this.infoministerial.perusumod = this.usuario.usuname;
            this.loadingIM=true;
            this.personaService.modificarInformacionMinisterial(this.infoministerial, this.infoministerial.perinfomin).subscribe(
                (data: any) => {
                    this.optionDialogInformacionMinisterial = false;
                    this.messageService.add(
                        { severity: 'success',
                          summary: 'Información Ministerial',
                          detail: 'Se modifidicó correctamente en el sistema.',
                          life: 3000
                        });
                    this.listarInformacionMinisterial(data.data.perid);
                    this.informacionMinisterialDialog = false;
                    this.loadingIM=false;
                },
                (error: any) => {
                    console.error("Error: ", error['message']);
                    this.messageService.add(
                        { severity: 'error',
                          summary: 'Problema',
                          detail: 'Ocurrío un error en el registro, verifique los campos ingresados.',
                          life: 3000
                        }
                    );
                }
            );
        }
    }

    // Documento Admisión

    listarDocumentoAdmision(perid: number){
        this.showDialogPersonaDocumentoAdmision = true;
        this.personaService.listarDocumentoAdmision(perid).subscribe({
            next: (data: any) => {
                this.documentoAdmision = data["data"][0] ? data["data"][0] : null;
            },
            error: (error: any) => {
                console.error("Error: ", error['message']);
                this.messageService.add({ severity: 'error', summary: 'Problema', detail: 'Ocurrío un error en el registro de persona, verifique los campos ingresados.', life: 3000 });
            }
        });
    }

    mostrarDocumentoAdmision(filename: any){
        this.personaService.mostrarDocumentoAdmision(filename);
    }

    esImagen(filename: string): boolean {
      const ext = filename.split('.').pop().toLowerCase();
      return ['jpg', 'jpeg', 'png', 'gif'].includes(ext);
    }

    esPdf(filename: string): boolean {
      const ext = filename.split('.').pop().toLowerCase();
      return ext === 'pdf';
    }

    adicionarDocumentoAdmision(){
        this.fileUploadperfoto.clear();
        this.fileUploadperfotoci.clear();
        this.fileUploadperfototitulo.clear();
        this.fileUploadpercartapastor.clear();
        this.docAdmisionForm.reset();
        this.docAdmisionForm.get('perfoto')?.setValidators(Validators.required);
        this.docAdmisionForm.get('perfotoci')?.setValidators(Validators.required);
        this.docAdmisionForm.get('perfototitulo')?.setValidators(Validators.required);
        this.docAdmisionForm.get('percartapastor')?.setValidators(Validators.required);
        this.percartapastorFile = null;
        this.percartapastorFileUrl = null;
        this.perfotoFile = null;
        this.perfotoFileUrl = null;
        this.perfotociFile = null;
        this.perfotociFileUrl = null;
        this.perfototituloFile = null;
        this.perfototituloFileUrl = null;
        this.documentoAdmisionDialog = true;
        this.optionDialogDocumentoAdmision = true;
        this.persona = { ...this.persona};
        this.docAdmisionForm.patchValue({
            perid: this.persona.perid
        });
    }

    ocultarDocumentoAdmision(){
        this.documentoAdmisionDialog = false;
        this.percartapastorFile = null;
        this.percartapastorFileUrl = null;
        this.perfotoFile = null;
        this.perfotoFileUrl = null;
        this.perfotociFile = null;
        this.perfotociFileUrl = null;
        this.perfototituloFile = null;
        this.perfototituloFileUrl = null;
        this.fileUploadperfoto.clear();
        this.fileUploadperfotoci.clear();
        this.fileUploadperfototitulo.clear();
        this.fileUploadpercartapastor.clear();
    }

    enviarDocumentoAdmision() {
        this.docAdmisionForm.patchValue({
            perfoto: this.fileurlperfoto || null,
            perfotoci: this.fileurlperfotoci || null,
            perfototitulo: this.fileurlperfototitulo || null,
            percartapastor: this.fileurlpercartapastor || null
        });
        if (this.docAdmisionForm.invalid) {
            this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Por favor, verifica la información ingresada e intenta nuevamente.', life: 3000 });
            return Object.values(this.docAdmisionForm.controls).forEach(control => {
                control.markAllAsTouched();
                control.markAsDirty();
            });
        }
        const formData: FormData = new FormData();
        if (this.optionDialogDocumentoAdmision) {
            formData.append('perid', this.docAdmisionForm.value.perid);
            formData.append('perfoto', this.perfotoFile || null);
            formData.append('perfotoci', this.perfotociFile || null);
            formData.append('perfototitulo', this.perfototituloFile || null);
            formData.append('percartapastor', this.percartapastorFile || null);
            formData.append('perobservacion', this.docAdmisionForm.value.perobservacion || null);
            formData.append('perusureg', this.usuario.usuname);
            formData.append('perestado', this.docAdmisionForm.value.perestado);
            this.loadingDA = true;
            this.spinner.show();
            this.personaService.adicionarDocumentoAdmision(formData).subscribe(
                (data: any) => {
                    this.optionDialogDocumentoAdmision = false;
                    this.messageService.add(
                        {
                            severity: 'success',
                            summary: 'Documento Admisión',
                            detail: 'Se registró correctamente en el sistema.',
                            life: 3000
                        }
                    );
                    this.listarDocumentoAdmision(this.docAdmisionForm.value.perid);
                    this.documentoAdmisionDialog = false;
                    this.loadingDA = false;
                    this.spinner.hide();
                    this.fileUploadperfoto.clear();
                    this.fileUploadperfotoci.clear();
                    this.fileUploadperfototitulo.clear();
                    this.fileUploadpercartapastor.clear();
                    this.docAdmisionForm.reset();
                    this.percartapastorFile = null;
                    this.percartapastorFileUrl = null;
                    this.perfotoFile = null;
                    this.perfotoFileUrl = null;
                    this.perfotociFile = null;
                    this.perfotociFileUrl = null;
                    this.perfototituloFile = null;
                    this.perfototituloFileUrl = null;
                },
                (error: any) => {
                    console.error("Error: ", error['message']);
                    this.messageService.add(
                        {
                            severity: 'error',
                            summary: 'Problema',
                            detail: 'Ocurrió un error en el registro, verifique los campos ingresados.',
                            life: 3000
                        }
                    );
                    this.spinner.hide();
                }
            );
        }

        if (!this.optionDialogDocumentoAdmision) {
            formData.append('perid', this.docAdmisionForm.value.perid);
            formData.append('perfoto', this.perfotoFile || null);
            formData.append('perfotoci', this.perfotociFile || null);
            formData.append('perfototitulo', this.perfototituloFile || null);
            formData.append('percartapastor', this.percartapastorFile || null);
            formData.append('perobservacion', this.docAdmisionForm.value.perobservacion || null);
            formData.append('perusumod', this.usuario.usuname);
            formData.append('perestado', this.docAdmisionForm.value.perestado);
            this.loadingDA = true;
            this.spinner.show();
            this.personaService.modificarDocumentoAdmision(formData).subscribe(
                (data: any) => {
                    this.optionDialogDocumentoAdmision = false;
                    this.messageService.add(
                        {
                            severity: 'success',
                            summary: 'Documento Admisión',
                            detail: 'Se modificó correctamente en el sistema.',
                            life: 3000
                        }
                    );
                    this.listarDocumentoAdmision(this.docAdmisionForm.value.perid);
                    this.documentoAdmisionDialog = false;
                    this.loadingDA = false;
                    this.spinner.hide();
                    this.fileUploadperfoto.clear();
                    this.fileUploadperfotoci.clear();
                    this.fileUploadperfototitulo.clear();
                    this.fileUploadpercartapastor.clear();
                    this.docAdmisionForm.reset();
                    this.percartapastorFile = null;
                    this.percartapastorFileUrl = null;
                    this.perfotoFile = null;
                    this.perfotoFileUrl = null;
                    this.perfotociFile = null;
                    this.perfotociFileUrl = null;
                    this.perfototituloFile = null;
                    this.perfototituloFileUrl = null;
                },
                (error: any) => {
                    console.error("Error: ", error['message']);
                    this.messageService.add(
                        {
                            severity: 'error',
                            summary: 'Problema',
                            detail: 'Ocurrió un error en el registro, verifique los campos ingresados.',
                            life: 3000
                        }
                    );
                    this.spinner.hide();
                }
            );
        }
    }

    modificarDocumentoAdmision(docadm: any){
        this.optionDialogDocumentoAdmision = false;
        this.documentoAdmisionDialog = true;
        this.docAdmision = {...docadm};
        this.docAdmisionForm.reset()
        this.docAdmisionForm.patchValue({
            perid: this.docAdmision.perid,
            perobservacion: this.docAdmision.perobservacion,
            perestado: this.docAdmision.perestado
        });
        this.percartapastorFile = null;
        this.percartapastorFileUrl = null;
        this.perfotoFile = null;
        this.perfotoFileUrl = null;
        this.perfotociFile = null;
        this.perfotociFileUrl = null;
        this.perfototituloFile = null;
        this.perfototituloFileUrl = null;

        this.docAdmisionForm.get('perfoto')?.clearValidators();
        this.docAdmisionForm.get('perfotoci')?.clearValidators();
        this.docAdmisionForm.get('perfototitulo')?.clearValidators();
        this.docAdmisionForm.get('percartapastor')?.clearValidators();
    }

    // percartapastor

    onUploadpercartapastor(event: any) {
        this.percartapastorFile = event.files[0];
        this.percartapastorFileUrl = URL.createObjectURL(this.percartapastorFile);
        this.cdr.detectChanges();
        this.fileURLpercartapastor(this.percartapastorFile);
    }

    fileURLpercartapastor(file: File): string {
        this.fileurlpercartapastor =  URL.createObjectURL(file);
        return this.fileurlpercartapastor;
    }

    clearFilespercartapastor() {
        if (this.fileUploadpercartapastor) {
          this.fileUploadpercartapastor.clear();
          this.percartapastorFile = null;
          this.percartapastorFileUrl = null;
        } else {
          console.error('fileUpload is not initialized');
        }
    }

    // perfototitulo

    onUploadperfototitulo(event: any) {
        this.perfototituloFile = event.files[0];
        this.perfototituloFileUrl = URL.createObjectURL(this.perfototituloFile);
        this.cdr.detectChanges();
        this.fileURLperfototitulo(this.perfototituloFile);
    }

    fileURLperfototitulo(file: File): string {
        this.fileurlperfototitulo =  URL.createObjectURL(file);
        return this.fileurlperfototitulo;
    }

    clearFilesperfototitulo() {
        if (this.fileUploadperfototitulo) {
          this.fileUploadperfototitulo.clear();
          this.perfototituloFile = null;
          this.perfototituloFileUrl = null;
        } else {
          console.error('fileUpload is not initialized');
        }
    }

    // perfotoci

    onUploadperfotoci(event: any) {
        this.perfotociFile = event.files[0];
        this.perfotociFileUrl = URL.createObjectURL(this.perfotociFile);
        this.cdr.detectChanges();
        this.fileURLperfotoci(this.perfotociFile);
    }

    fileURLperfotoci(file: File): string {
        this.fileurlperfotoci =  URL.createObjectURL(file);
        return this.fileurlperfotoci;
    }

    clearFilesperfotoci() {
        if (this.fileUploadperfotoci) {
          this.fileUploadperfotoci.clear();
          this.perfotociFile = null;
          this.perfotociFileUrl = null;
        } else {
          console.error('fileUpload is not initialized');
        }
    }

    // perfoto

    onUploadperfoto(event: any) {
        this.perfotoFile = event.files[0];
        this.perfotoFileUrl = URL.createObjectURL(this.perfotoFile);
        this.cdr.detectChanges();
        this.fileURLperfoto(this.perfotoFile);
    }

    fileURLperfoto(file: File): string {
        this.fileurlperfoto =  URL.createObjectURL(file);
        return this.fileurlperfoto;
    }

    clearFilesperfoto() {
        if (this.fileUploadperfoto) {
          this.fileUploadperfoto.clear();
          this.perfotoFile = null;
          this.perfotoFileUrl = null;
        } else {
          console.error('fileUpload is not initialized');
        }
    }

    // is Image, PDF

    isImage(fileType: string): boolean {
      return fileType.startsWith('image/');
    }

    isPDF(fileType: string): boolean {
      return fileType === 'application/pdf';
    }
}
