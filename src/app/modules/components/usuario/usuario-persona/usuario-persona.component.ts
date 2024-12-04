// Models
import { Persona, PersonaExpanded } from 'src/app/modules/models/persona';
import { Usuario } from 'src/app/modules/models/usuario';
import { TipoPais, TipoCiudad, TipoEstadoCivil, TipoGenero, TipoDocumento } from 'src/app/modules/models/diccionario';

// Services
import { AuthService } from 'src/app/modules/service/core/auth.service';
import { UsuarioService } from 'src/app/modules/service/data/usuario.service';
import { UploadService } from 'src/app/modules/service/data/upload.service';
import { PersonaService } from 'src/app/modules/service/data/persona.service';

// Angular core
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
// for validations
import { FormBuilder, FormGroup, Validators, AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';

// PrimeNG
import { MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { FileUpload } from 'primeng/fileupload';

// Angular rxjs
import { Observable, of } from 'rxjs';

// Angular ngx-spinner
import { NgxSpinnerService } from 'ngx-spinner';

// File saver
import * as FileSaver from 'file-saver';

// enviroment
import { environment } from 'src/environments/environment';

// Logo
import logoIbciBase64 from '../../../../../assets/base64/logo_ibci_base64.js';

// Interfaces
interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}
interface ColumsTable {
    field: string;
    header: string;
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

    // Gets a reference to the FileUpload in the template
    @ViewChild('fileUpload') fileUpload: FileUpload;

    // Reference to component upload file
    @ViewChild('fileUploadProfilePhoto') fileUploadProfilePhoto: FileUpload;


    // Person expanded
    personExpanded: PersonaExpanded;
    personExpandedElement: PersonaExpanded[];
    personExpandedData: PersonaExpanded;
    personsExpanded: any[] = [];
    personsExpandedDuplicated: PersonaExpanded[] = [];
    personsExpandedInactivate: PersonaExpanded[] = [];

    // Person
    person: Persona;
    persons: Persona[] = [];
    personData: Persona;

    // Person dialog
    personCreateDialog: boolean = false;
    personShowDialog: boolean = false;
    personDeleteDialog: boolean = false;
    personActivateDialog: boolean = false;
    personOptionDialog: boolean = false;

    // Person validation
    personForm: FormGroup;
    originalDocumentNumber: any;

    

    // Types: Country, city, marital status, gender, document

    TipoPais: TipoPais[] = [];
    TipoCiudad: TipoCiudad[] = [];
    TipoCiudadRespaldo: TipoCiudad[] = [];
    TipoEstadoCivil: TipoEstadoCivil[] = [];
    TipoGenero: TipoGenero[] = [];
    TipoDocumento: TipoDocumento[] = [];

    // Upload file image
    imageName: any;
    fileName: any;
    files: any = {};
    fileUploadType: number;

    // User
    usuario: Usuario;

    // User profile photo
    userProfilePhoto = environment.API_URL_PROFILE_PHOTO;

    // Table
    rowsPerPageOptions = [5, 10, 20];
    totalRecords!: number;

    // Status
    statuses: any[] = [];

    // Loading
    loading: boolean = false;

    // Export table
    colsTable!: Column[];
    exportColumns!: ExportColumn[];

    // Breadcrumb
    items: MenuItem[] | undefined;
    home: MenuItem | undefined;

    // Error
    errors: any;

    // Otros
    id: any;
    cols: any[] = [];
    value!: string;

    // Inicialize
    genderOptions = [
        { label: 'Masculino', value: 'Masculino' },
        { label: 'Femenino', value: 'Femenino' }
    ];

    statusOptions = [
        { label: 'Activo', value: 1 },
        { label: 'Inactivo', value: 0 }
    ];

    stateOptionsEstado: any[] = [
        { label: 'Activo', value: 1 },
        { label: 'Inactivo', value: 0 }
    ];

    stateOptionsActivo: any[] = [
        { label: 'Activo', value: 1 },
        { label: 'Inactivo', value: 0 }
    ]

    colsColumsTable!: ColumsTable[];

    selectedColumns: { field: string; header: string; }[] = [
        { field: 'tipodocnombre', header: 'Tipo de Documento' },
        { field: 'pernrodoc', header: 'Número de Documento' },
        { field: 'pernomcompleto', header: 'Nombre Completo' },
        { field: 'pernombres', header: 'Nombres' },
        { field: 'perapepat', header: 'Apellido Paterno' },
        { field: 'perapemat', header: 'Apellido Materno' },
        { field: 'perfecnac', header: 'Fecha de Nacimiento' },
        { field: 'generonombre', header: 'Género' },
        { field: 'perestado', header: 'Estado' },
    ];

    fileurlperfoto: any;
    perfotoFile: File | null = null;
    perfotoFileUrl: string | null = null;



    constructor(
        private usuarioService: UsuarioService,
        private messageService: MessageService,
        private personaService: PersonaService,
        private uploadService: UploadService,
        private authService: AuthService,
        private formBuilder: FormBuilder,
        private spinner: NgxSpinnerService,
        private cd: ChangeDetectorRef,
        private cdr: ChangeDetectorRef
    )
    {

        this.items = [
            { label: 'Usuarios' },
            { label: 'Gestionar Personas', routerLink:''}
        ];

        this.home = { icon: 'pi pi-home', routerLink: '/' };

        this.colsTable = [
            { field: 'perid', header: 'ID' },
            { field: 'tipodocnombre', header: 'Tipo Documento' },
            { field: 'pernrodoc', header: 'Número Documento' },
            { field: 'pernomcompleto', header: 'Nombre Completo' },
            { field: 'pernombres', header: 'Nombres' },
            { field: 'perapepat', header: 'Apellido Paterno' },
            { field: 'perapemat', header: 'Apellido Materno' },
            { field: 'perfecnac', header: 'Fecha Nacimiento' },
            { field: 'generonombre', header: 'Género' },
            { field: 'perusureg', header: 'Registrado' },
            { field: 'perusumod', header: 'Modificado' },
            { field: 'perestado', header: 'Estado' },
        ];

        this.exportColumns = this.colsTable.map((col) => (
            {
                title: col.header,
                dataKey: col.field
            }
        ));

        this.statuses = [
            { label: 'Activo', value: 0 },
            { label: 'Inactivo', value: 1 }
        ];

        this.colsColumsTable = [
            { field: 'perapepat', header: 'Paterno' },
            { field: 'perapemat', header: 'Materno' },
            { field: 'pernombres', header: 'Nombres' },
            { field: 'pernrodoc', header: 'Documento'},
            { field: 'perfecnac', header: 'Nacimiento'},
            { field: 'generonombre', header: 'Género'},
            { field: 'perusureg', header: 'Registrado' },
            { field: 'perusumod', header: 'Modificado' },
            { field: 'perestado', header: 'Estado' },
        ];

        this.selectedColumns = [
            { field: 'perapepat', header: 'Paterno' },
            { field: 'perapemat', header: 'Materno' },
            { field: 'pernombres', header: 'Nombres' },
            { field: 'pernrodoc', header: 'Documento'},
            { field: 'perfecnac', header: 'Nacimiento'},
            { field: 'generonombre', header: 'Género'},
            { field: 'perestado', header: 'Estado' },
        ];
    }

    ngOnInit() {
        this.getPersonsExpended();
        // this.fillTypeCombos();
        // this.getUserProfile();
        this.initializeValidations();
    }

    // Function init
    // Initialize variables validations
    initializeValidations() {
        this.personForm = this.formBuilder.group({
            perid: [''],
            pernombres: ['', [Validators.required]],
            perapepat: ['', [Validators.required]],
            perapemat: [''],
            pernrodoc: [{ value: '' }, [Validators.required], [this.validateExistingDocumentNumber()]],
            perfecnac: ['', [Validators.required], [this.validateMinimumAge()]],
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

    // Get user profile data
    getUserProfile(){
        this.authService.getProfile().subscribe({
            next: (user) => {
                this.usuario = user[0];
            },
            error: (err) => {
                console.error(err);
            }
        });
    }

    // Validations

    // Validate Minimum Age > 15 years
    validateMinimumAge(): AsyncValidatorFn {
        return (control: AbstractControl): Promise<ValidationErrors | null> => {
            return new Promise((resolve) => {
                const dateBirthString: string = control.value;
                const dateBirth: Date = new Date(dateBirthString);
                if (!dateBirth || isNaN(dateBirth.getTime())) {
                    resolve({ InvalidDateformat: true });
                }
                if (dateBirth.getFullYear() > 2009) {
                    resolve({ minimumAge: true });
                }
                resolve(null);
            });
        };
    }

    // Validate if the document number already exists
    validateExistingDocumentNumber(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
            const documentNumber = control.value;
            if (!documentNumber) {
                return of(null);
            }
            const exists = this.personsExpandedDuplicated.some(person => person.pernrodoc === documentNumber);
            return of(exists ? { existingDocument: true } : null);
    };
    }

    // Validate when document number changes, validate if it already exists.
    validateDocumentNumberIfChanged(control: AbstractControl) {
        if (control.value === this.originalDocumentNumber) {
            return of(null);
        } else {
            return this.validateExistingDocumentNumber()(control);
        }
    }

    // Function Person

    // List person data
    listPersons() {
        this.loading = true;
        this.personaService.getPersons().subscribe({
            next: (data: any) => {
                this.persons = data;
            },
            error: (error: any) => {
                this.loading = false;
                console.error(error);
            },
            complete: () => {
                this.loading = false;
            }
        });
    }

    // Get list persons with PersonExpended
    getPersonsExpended() {
        this.spinner.show();
        this.loading = true;
        this.personaService.getPacientes().subscribe({
            next: (data: any) => {
                // this.personExpandedElement = data;
                this.personsExpanded = data['data'];
                // this.personsExpanded = this.personExpandedElement.map(item => this.organizePersonData(item));
                // this.personsExpandedDuplicated = this.personsExpanded;
                // this.cd.markForCheck();
                this.loading = false;
                this.spinner.hide();
            },
            error: (error: any) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Ocurrió un error. Contacta al soporte.',
                    life: 5000
                });
                this.loading = false;
                this.spinner.hide();
            }
        });
    }

    // Organize person data for table
    organizePersonData(data: any): PersonaExpanded {
        const person = new PersonaExpanded();
        person.tipo = data.tipo;
        person.perid = data.perid;
        person.pernomcompleto = data.pernomcompleto;
        person.pernombres = data.pernombres;
        person.perapepat = data.perapepat;
        person.perapemat = data.perapemat;
        person.pertipodoc = data.pertipodoc;
        person.tipodocnombre = data.tipodocnombre;
        person.pernrodoc = data.pernrodoc;
        person.perfecnac = data.perfecnac;
        person.pergenero = data.pergenero;
        person.generonombre = data.generonombre;
        person.perfoto = data.perfoto;
        person.perusureg = data.perusureg;
        person.perobservacion = data.perobservacion;
        person.perfecreg = data.perfecreg;
        person.perusumod = data.perusumod;
        person.perfecmod = data.perfecmod;
        person.perestado = data.perestado;
        person.usuid = data.usuid;
        person.usuname = data.usuname;
        person.usuemail = data.usuemail;
        person.datos.push(
            {
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
            }
        );
        return person;
    }

    // Create new person
    createPerson() {
        this.person = new Persona();
        this.personForm.reset();
        this.personForm.get('pernrodoc')?.enable();
        this.personCreateDialog = true;
        this.personOptionDialog = true;
    }

    // Update person data personExpanded
    updatePerson(data: PersonaExpanded) {
        this.fillTypeCombos();
        this.personExpanded = { ...data };
        this.personOptionDialog = false;
        this.personCreateDialog = true;
        this.originalDocumentNumber = this.personExpanded.pernrodoc;
        this.personForm.reset();
        this.personForm.patchValue({
            perid: this.personExpanded.perid,
            pernombres: this.personExpanded.pernombres,
            perapepat: this.personExpanded.perapepat,
            perapemat: this.personExpanded.perapemat,
            tipoDocumento: new TipoDocumento(this.personExpanded.pertipodoc, this.personExpanded.tipodocnombre),
            pernrodoc: this.personExpanded.pernrodoc,
            perfecnac: this.personExpanded.perfecnac,
            tipoGenero: new TipoGenero(this.personExpanded.pergenero, this.personExpanded.generonombre),
            perdirec: this.personExpanded.datos[0].perdirec,
            peremail: this.personExpanded.datos[0].peremail,
            percelular: this.personExpanded.datos[0].percelular,
            pertelefono: this.personExpanded.datos[0].pertelefono,
            tipoEstadoCivil: new TipoEstadoCivil(this.personExpanded.datos[0].perestcivil, this.personExpanded.datos[0].estadocivilnombre),
            tipoPais: new TipoPais(this.personExpanded.datos[0].perpais, this.personExpanded.datos[0].paisnombre),
            tipoCiudad: new TipoCiudad(this.personExpanded.datos[0].perciudad, this.personExpanded.datos[0].ciudadnombre, this.personExpanded.datos[0].perpais),
            perfoto: this.personExpanded.perfoto,
            perobservacion: this.personExpanded.perobservacion,
            perestado: this.personExpanded.perestado
        });

        const controlDocumentNumber = this.personForm.get('pernrodoc');
        controlDocumentNumber.clearAsyncValidators();
        if (this.originalDocumentNumber) {
            controlDocumentNumber.setAsyncValidators([this.validateDocumentNumberIfChanged.bind(this)]);
        }
        controlDocumentNumber.updateValueAndValidity();
    }

    // Send data to the form to create or update person
    sendForm() {
        this.personForm.patchValue({
            perfoto: this.fileurlperfoto || null,
        });

        if (this.personForm.invalid) {
            this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Por favor, verifica la información ingresada e intenta nuevamente.', life: 3000 });
            Object.values(this.personForm.controls).forEach(control => {
                control.markAllAsTouched();
                control.markAsDirty();
            });
            return;
        }
        const formData: FormData = new FormData();
        formData.append('perfoto', this.perfotoFile || null);
        formData.append('pernomcompleto', (this.personForm.value.perapepat + ' ' + this.personForm.value.perapemat + ' ' + this.personForm.value.pernombres) || null);
        formData.append('pernombres', this.personForm.value.pernombres || null);
        formData.append('perapepat', this.personForm.value.perapepat || null);
        formData.append('perapemat', this.personForm.value.perapemat || null);
        formData.append('pertipodoc', this.personForm.value.tipoDocumento?.tipodocid || null);
        formData.append('pernrodoc', this.personForm.value.pernrodoc || null);
        formData.append('perfecnac', this.personForm.value.perfecnac || null);
        formData.append('pergenero', this.personForm.value.tipoGenero?.generoid || null);
        formData.append('perestcivil', this.personForm.value.tipoEstadoCivil?.estadocivilid || null);
        formData.append('perpais', this.personForm.value.tipoPais?.paisid || null);
        formData.append('perciudad', this.personForm.value.tipoCiudad?.ciudadid || null);
        formData.append('perdirec', this.personForm.value.perdirec || null);
        formData.append('peremail', this.personForm.value.peremail || null);
        formData.append('percelular', this.personForm.value.percelular || null);
        formData.append('pertelefono', this.personForm.value.pertelefono || null);
        formData.append('perobservacion', this.personForm.value.perobservacion || null);
        formData.append('perestado', this.personForm.value.perestado || 0)

        if (this.personOptionDialog) {
            // Create
            formData.append('tipo', '1')
            formData.append('perusureg', this.usuario.usuname);
        } else {
            // Update
            formData.append('tipo', '2')
            formData.append('perid', this.personForm.value.perid);
            formData.append('perusumod', this.usuario.usuname);
        }

        this.loading = true;
        this.spinner.show();
        this.personaService.managePerson(formData).subscribe({
            next: (data: any) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Persona',
                    detail: this.personOptionDialog ? 'Se creó correctamente.' : 'Se actualizó correctamente.',
                    life: 3000
                });

                this.fileUploadProfilePhoto.clear();
                this.personForm.reset();
                this.perfotoFile = null;
            },
            error: (error: any) => {
                console.error("Error: ", error.message);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Problema',
                    detail: 'Ocurrió un error en el registro, verifique los campos ingresados.',
                    life: 3000
                });
                this.spinner.hide();
                this.loading = false;
            },
            complete: () => {
                this.loading = false;
                this.personCreateDialog = false;
                this.personOptionDialog = false;
                this.getPersonsExpended();
            }
        });
    }

    // Clear file upload
    clearFilesperfoto() {
        if (this.fileUploadProfilePhoto) {
          this.fileUploadProfilePhoto.clear();
          this.perfotoFile = null;
          this.perfotoFileUrl = null;
        } else {
          console.error('fileUpload is not initialized');
        }
    }

    // Is file image?
    isImage(fileType: string): boolean {
        return fileType.startsWith('image/');
    }

    // Person with profile photo or not
    async deletePerson() {
        this.person = new Persona();
        this.person.tipo = 1;
        this.person.perid = this.personExpanded.perid;
        this.person.perusumod = this.usuario.usuname;
        this.loading = true;
        this.personaService.deletePerson(this.person).subscribe({
            next: (response: any) => {
                // Get perfoto
                const currentPhoto = this.personExpanded.perfoto;
                // Check profile photo
                if (currentPhoto) {
                    // Delete profile photo If exists
                    const deleteSuccess = this.uploadService.deleteProfilePhoto(currentPhoto);
                    // Message If It doesn't have profile photo
                    if (!deleteSuccess) {
                        this.messageService.add({
                            severity: 'warn',
                            summary: 'Imagen',
                            detail: 'No se pudo eliminar la imagen actual.',
                            life: 3000
                        });
                    }
                    // Message If it has profile photo
                    if(deleteSuccess) {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Imagen',
                            detail: 'Se eliminó correctamente.',
                            life: 3000 });
                    }
                }
                this.personDeleteDialog = false;
                this.personOptionDialog = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Persona',
                    detail: 'Se elimino correctamente.',
                    life: 3000
                });
                this.getPersonsExpended();
                this.loading = false;
            },
            error: (error: any) => {
                console.error("error: ", error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Persona',
                    detail: 'Ocurrio un error, porfavor comunicarse con soporte.',
                    life: 3000
                });
                this.loading = false;
            },
            complete: () => {
                this.loading = false;
            }
        });
    }

    // Activate person for personExpanded
    activatePerson() {
        this.person = new Persona();
        this.person.tipo = 3;
        this.person.perid = this.personExpanded.perid;
        this.person.perusumod = this.usuario.usuname;
        this.loading = true;
        this.personaService.deletePerson(this.person).subscribe({
            next: (response) => {
                this.personActivateDialog = false;
                this.personOptionDialog = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Persona',
                    detail: 'Se activo correctamente en el sistema.',
                    life: 5000
                });
                this.getPersonsExpended();
                this.loading = false;
            },
            error: (error) => {
                console.error("error: ", error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Persona',
                    detail: 'Ocurrio un error, porfavor comunicarse con soporte.',
                    life: 5000
                });
                this.loading = false;
            }
        });
    }

    // Confirm delete dialog with data
    confirmDelete(data: any) {
        this.personExpanded = { ...data };
        this.personDeleteDialog = true;
    }

    // Confirm activate dialog with data
    confirmActive(data: any) {
        this.personExpanded = { ...data };
        this.personActivateDialog = true;
    }

    // Hide dialog and fill type combos
    hideDialog() {
        this.personCreateDialog = false;
        this.fillTypeCombos()
    }

    // Show person dialog with data
    showPerson(persona: PersonaExpanded){
        this.personExpanded = {...persona};
        this.personShowDialog= true;
    }

    // Type Combo
    // Fill Type Combo
    fillTypeCombos() {
        this.personaService.getTipoCiudad().subscribe(
            (data: any) => {
                this.TipoCiudad = data;
                this.TipoCiudadRespaldo = data;
            }
        );

        this.personaService.getTipoPais().subscribe(
            (data: any) => {
                this.TipoPais = data;
            }
        );

        this.personaService.getTipoDocumento().subscribe(
            (data: any) => {
                this.TipoDocumento = data;
            }
        );

        this.personaService.getTipoGenero().subscribe(
            (data: any) => {
                this.TipoGenero = data;
            }
        );

        this.personaService.getTipoEstadoCivil().subscribe(
            (data: any) => {
                this.TipoEstadoCivil = data;
            }
        );
    }

    // Change country type
    onChangeTipoPais(data: any) {
        this.TipoCiudad = this.TipoCiudadRespaldo;
        this.id = data.value.paisid;
        this.TipoCiudad = this.TipoCiudad.filter(
            ciudad => ciudad.paisid === this.id
        );
    }

    // File
    // Upload files
    onUpload(event: any) {
        this.perfotoFile = event.files[0];
        this.perfotoFileUrl = URL.createObjectURL(this.perfotoFile);
        this.cdr.detectChanges();
        this.fileURLperfoto(this.perfotoFile);
    }

    fileURLperfoto(file: File): string {
        this.fileurlperfoto =  URL.createObjectURL(file);
        return this.fileurlperfoto;
    }

    // Complementary
    // Get Severity Status
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

    // Get Description Status
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

    // Search in the table
    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }

    // File rpt

    // Export PDF file
    exportPdf() {
        import('jspdf').then(jsPDF => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default('l', 'pt', 'a4');

                // Center title
                const title = 'Lista de Personas';
                const titleFontSize = 16;
                const titleWidth = doc.getStringUnitWidth(title) * titleFontSize / doc.internal.scaleFactor;
                const titleX = (doc.internal.pageSize.getWidth() - titleWidth) / 2;
                const titleY = 60;
                doc.setFontSize(titleFontSize);
                doc.text(title, titleX, titleY);

                // Subtitle
                const subtitle = 'Esta lista muestra todas las personas registradas en el sistema.';
                const subtitleFontSize = 9;
                const subtitleX = 20;
                const subtitleY = 80;
                doc.setFontSize(subtitleFontSize);
                doc.text(subtitle, subtitleX, subtitleY);

                // Description
                const description = 'Sistema de Seguimiento y Gestión Académico';
                const descriptionFontSize = 10;
                const descriptionX = 100;
                const descriptionY = 40;
                doc.setFontSize(descriptionFontSize);
                doc.text(description, descriptionX, descriptionY);

                const descriptionSecondary = 'Instituto Biblico de Capacitación Internacional';
                const descriptionFontSizeSecondary = 10;
                const descriptionX2 = 100;
                const descriptionY2 = 30;
                doc.setFontSize(descriptionFontSizeSecondary);
                doc.text(descriptionSecondary, descriptionX2, descriptionY2);

                // Imagen in base64
                const base64Image = logoIbciBase64;
                const imageX = 20;
                const imageY = 10;
                const imageWidth = 80; // Image width in points
                const imageHeight = 50; // Image height in points
                doc.addImage(base64Image, 'PNG', imageX, imageY, imageWidth, imageHeight);

                // Data table
                (doc as any).autoTable({
                    columns: this.exportColumns,
                    body: this.personsExpanded,
                    theme: 'striped',
                    styles: {
                        fontSize: 8,
                        cellPadding: 3
                    },
                    startY: 100,
                });
                let PDF_EXTENSION = '.pdf';
                const fileName = 'rpt-pdf-lista-persona-' + new Date().getTime()+PDF_EXTENSION;
                doc.save(fileName); // Save the PDF file with the new name
            });
        });
    }

    // Export excel file
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

            const dataToExport = this.personsExpanded.map(persona => {
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

            // Calculate columns width based on longset content
            const columnWidths = fieldsToExport.map(field => {
                const columnData = dataToExport.map(row => row[field.header]);
                const maxLength = columnData.reduce((acc, val) => Math.max(acc, val.toString().length), 0);
                return { wch: maxLength + 2 };
            });

            worksheet['!cols'] = columnWidths;

            const workbook = {
                Sheets: { 'Data': worksheet },
                SheetNames: ['Data']
            };

            const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
            this.saveAsExcelFile(excelBuffer, 'rpt-excel-lista-persona-');
        });
    }


    // Save as Excel File
    saveAsExcelFile(buffer: any, fileName: string): void {
        let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        let EXCEL_EXTENSION = '.xlsx';
        const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
        FileSaver.saveAs(data, fileName + new Date().getTime() + EXCEL_EXTENSION);
    }
}
