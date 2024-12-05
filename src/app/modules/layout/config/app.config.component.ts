// Models
import { Persona, PersonaExpanded } from 'src/app/modules/models/persona';
import { Usuario } from '../../models/usuario';
import { TipoPais, TipoCiudad, TipoEstadoCivil, TipoGenero, TipoDocumento } from 'src/app/modules/models/diccionario';

// Services
import { AuthService } from 'src/app/modules/service/core/auth.service';
import { UsuarioService } from 'src/app/modules/service/data/usuario.service';
import { PersonaService } from 'src/app/modules/service/data/persona.service';
import { LayoutService } from "../service/app.layout.service";
import { MenuService } from "../menu/app.menu.service";
// Angular core
import { ChangeDetectorRef, Component, OnInit, ViewChild, Input } from '@angular/core';
// for validations
import { FormBuilder, FormGroup, Validators, AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';

// PrimeNG
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { FileUpload } from 'primeng/fileupload';

// Angular rxjs
import { Observable, of } from 'rxjs';

// Angular router
import { Router } from '@angular/router';

// Angular ngx-spinner
import { NgxSpinnerService } from 'ngx-spinner';

// File saver
import * as FileSaver from 'file-saver';

// enviroment
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-config',
    templateUrl: './app.config.component.html',
    styleUrls: ['../../../app.component.css']
})
export class AppConfigComponent {

    // Reference to component upload file
    @ViewChild('fileUploadProfilePhoto') fileUploadProfilePhoto: FileUpload;

    // Input boolean
    @Input() minimal: boolean = false;
    id: any;

    // User
    usuario: Usuario;

    // Option control panel
    scales: number[] = [12, 13, 14, 15, 16];
    isDarkTheme: boolean = false;

    // App config
    showDialogProfile: boolean = false
    showDialogProfileUpdate: boolean = false;
    showDialogChangePassword: any;
    loading: boolean = false;

    // Person
    person: Persona;
    personForm: FormGroup;
    personsDuplicated: Persona[] = [];
    personas: Persona[] = [];
    originalPersonNumberDocument: any;
    fileurlperfoto: any;
    perfotoFile: File | null = null;
    perfotoFileUrl: string | null = null;

    // Type
    TipoDocumento: TipoDocumento[] = [];
    TipoGenero: TipoGenero[] = [];
    TipoCiudad: TipoCiudad[] = [];
    TipoCiudadRespaldo: TipoCiudad[] = [];
    TipoPais: TipoPais[] = [];
    TipoEstadoCivil: TipoEstadoCivil[] = [];

    // Validation
    userPasswordForm: FormGroup<any>;
    userData: Usuario;

    constructor(public layoutService: LayoutService, public menuService: MenuService, private authService: AuthService, private confirmationService: ConfirmationService, private messageService: MessageService, private router: Router, private spinner: NgxSpinnerService, private personaService: PersonaService, private formBuilder: FormBuilder, private cdr: ChangeDetectorRef, private usuarioService: UsuarioService) { }

    ngOnInit() {
        this.getUserData();

        this.initializeTheme();

        this.assignVariables();

        this.assignValidations();
    }

    // Init
    getUserData() {
        this.authService.getProfile().subscribe({
            next: (result: Usuario) => {
                this.usuario = result;
            },
            error: (error: any) => {
                console.error("Error al obtener el perfil: ", error);
            }
        });
    }

    assignValidations() {
        this.userPasswordForm = this.formBuilder.group({
            usupassword: ['', [Validators.required, Validators.minLength(8), this.passwordSecurity]],
            usupasswordconfirm: ['', [Validators.required]]
        }, { validator: this.validardorPasswords });
    }

    assignVariables() {
        this.personForm = this.formBuilder.group({
            perid: [''],
            pernombres: ['', [Validators.required]],
            perapepat: ['', [Validators.required]],
            perapemat: [''],
            pernrodoc: [{ value: '' }, [Validators.required], [this.validateExistingDocumentNumber()]],
            perfecnac: ['', [Validators.required], [this.validateMiniumAge()]],
            perdirec: ['', [Validators.required]],
            peremail: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
            percelular: ['', [Validators.required]],
            pertelefono: [''],
            perfoto: [''],
            tipoGenero: ['', [Validators.required]],
            tipoEstadoCivil: ['', [Validators.required]],
            tipoPais: ['', [Validators.required]],
            tipoCiudad: ['', [Validators.required]],
            tipoDocumento: ['', [Validators.required]],
            perobservacion: [''],
            perestado: ['', [Validators.required]]
        });
    }

    showModalChangePassword() {
        this.showDialogChangePassword = true;
    }

    hideDialogChangePassword() {
        this.showDialogChangePassword = false;
    }

    // Validations:

    // Verify that the password: must include uppercase, lowercase and numbers
    passwordSecurity(control: AbstractControl): { [key: string]: boolean } | null {
        const value = control.value;
        if (value && (!value.match(/[A-Z]/) || !value.match(/[a-z]/) || !value.match(/[0-9]/))) {
            return { passwordSecurity: true };
        }
        return null;
    }

    // Check if the password and repeat password are the same
    validardorPasswords(fg: FormGroup): { [key: string]: boolean } | null {
        const password = fg.get('usupassword').value;
        const confirmPassword = fg.get('usupasswordconfirm').value;
        if (password && confirmPassword && password !== confirmPassword) {
            return { mismatch: true };
        }
        return null;
    }

    // Person:

    getPersons() {
        this.spinner.show();
        this.loading = true;
        this.personaService.getPersons().subscribe({
            next: (data: any) => {
                this.personas = data;
                this.personsDuplicated = this.personas;
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

    fillTypeCombo() {
        this.personaService.getTipoCiudad().subscribe((data: any) => { this.TipoCiudad = data; this.TipoCiudadRespaldo = data; });
        this.personaService.getTipoPais().subscribe((data: any) => { this.TipoPais = data; });
        this.personaService.getTipoDocumento().subscribe((data: any) => { this.TipoDocumento = data; });
        this.personaService.getTipoGenero().subscribe((data: any) => { this.TipoGenero = data; });
        this.personaService.getTipoEstadoCivil().subscribe((data: any) => { this.TipoEstadoCivil = data; });
    }

    onChangeTipoPais(data: any) {
        this.TipoCiudad = this.TipoCiudadRespaldo;
        this.id = data.value.paisid;
        this.TipoCiudad = this.TipoCiudad.filter(ciudad => ciudad.paisid === this.id);
    }

    validateMiniumAge(): AsyncValidatorFn {
        return (control: AbstractControl): Promise<ValidationErrors | null> => {
            return new Promise((resolve) => {
                const fechaNacimientoStr: string = control.value;
                const fechaNacimiento: Date = new Date(fechaNacimientoStr);
                if (!fechaNacimiento || isNaN(fechaNacimiento.getTime())) {
                    resolve({ formatoFechaInvalido: true });
                }
                if (fechaNacimiento.getFullYear() > 2009) {
                    resolve({ edadMinima: true });
                }
                resolve(null);
            });
        };
    }

    validateExistingDocumentNumber(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
            const numeroDocumento = control.value;
            if (!numeroDocumento) {
                return of(null);
            }
            const existe = this.personsDuplicated.some(persona => persona.pernrodoc === numeroDocumento);
            return of(existe ? { documentoExistente: true } : null);
        };
    }

    validateDocumentNumberIfChanged(control: AbstractControl) {
        if (control.value === this.originalPersonNumberDocument) {
            return of(null);
        } else {
            return this.validateExistingDocumentNumber()(control);
        }
    }

    showModifyProfile() {
        this.showDialogProfileUpdate = true;
        this.fillTypeCombo();
        this.person = { ...this.person };
        this.originalPersonNumberDocument = this.person.pernrodoc;

        this.personForm.reset();
        this.personForm.patchValue({
            perid: this.person.perid,
            pernombres: this.person.pernombres,
            perapepat: this.person.perapepat,
            perapemat: this.person.perapemat,
            tipoDocumento: new TipoDocumento(this.person.pertipodoc, this.person.tipodocnombre),
            pernrodoc: this.person.pernrodoc,
            perfecnac: this.person.perfecnac,
            tipoGenero: new TipoGenero(this.person.pergenero, this.person.generonombre),
            perdirec: this.person.perdirec,
            peremail: this.person.peremail,
            percelular: this.person.percelular,
            pertelefono: this.person.pertelefono,
            tipoEstadoCivil: new TipoEstadoCivil(this.person.perestcivil, this.person.estadocivilnombre),
            tipoPais: new TipoPais(this.person.perpais, this.person.paisnombre),
            tipoCiudad: new TipoCiudad(this.person.perciudad, this.person.ciudadnombre, this.person.perpais),
            perfoto: this.person.perfoto,
            perobservacion: this.person.perobservacion,
            perestado: this.person.perestado
        });

        const nroDocControl = this.personForm.get('pernrodoc');

        nroDocControl.clearAsyncValidators();

        if (this.originalPersonNumberDocument) {
            nroDocControl.setAsyncValidators([this.validateDocumentNumberIfChanged.bind(this)]);
        }

        nroDocControl.updateValueAndValidity();
    }

    hideDialog() {
        this.showDialogProfileUpdate = false;
        this.personForm.reset();
    }

    fileURLperfoto(file: File): string {
        this.fileurlperfoto = URL.createObjectURL(file);
        return this.fileurlperfoto;
    }

    clearFilesperfoto() {
        if (this.fileUploadProfilePhoto) {
            this.fileUploadProfilePhoto.clear();
            this.perfotoFile = null;
            this.perfotoFileUrl = null;
        } else {
            console.error('fileUpload is not initialized');
        }
    }

    isImage(fileType: string): boolean {
        return fileType.startsWith('image/');
    }

    isPDF(fileType: string): boolean {
        return fileType === 'application/pdf';
    }




    // Panel's funtions

    initializeTheme() {
        const theme = localStorage.getItem('theme');
        if (theme === "theme-dark") {
            this.isDarkTheme = true;
        }
        else {
            this.isDarkTheme = false;
        }
        if (theme) {
            this.changeTheme(theme);
        }
    }

    toggleTheme() {
        const theme = this.isDarkTheme ? 'theme-dark' : 'theme-light';
        localStorage.setItem('theme', theme);
        this.changeTheme(theme);
    }

    changeTheme(theme: string) {
        const themeLink = document.getElementById('app-theme') as HTMLLinkElement;
        if (themeLink) {
            themeLink.href = '/assets/layout/styles/theme/' + theme + '/' + theme + '.css'
        }
        localStorage.setItem('theme', theme);
    }

    signOff() {
        this.confirmationService.confirm({
            message: '¿Estás seguro de cerrar sesión?',
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Cerrando sesión...' });
                this.spinner.show();
                setTimeout(() => {
                    this.logout();
                    this.spinner.hide();
                }, 3000);
            },
            reject: (type: ConfirmEventType) => {
                switch (type) {
                    case ConfirmEventType.REJECT:
                    case ConfirmEventType.CANCEL:
                        this.messageService.add({ severity: 'warn', summary: 'Cancelado', detail: 'Cancelaste la operación' });
                        break;
                }
            }
        });
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
        this.visible = false;
    }

    get visible(): boolean {
        return this.layoutService.state.configSidebarVisible;
    }

    set visible(_val: boolean) {
        this.layoutService.state.configSidebarVisible = _val;
    }

    get scale(): number {
        return this.layoutService.config.scale;
    }

    set scale(_val: number) {
        this.layoutService.config.scale = _val;
    }

    get menuMode(): string {
        return this.layoutService.config.menuMode;
    }

    set menuMode(_val: string) {
        this.layoutService.config.menuMode = _val;
    }

    get inputStyle(): string {
        return this.layoutService.config.inputStyle;
    }

    set inputStyle(_val: string) {
        this.layoutService.config.inputStyle = _val;
    }

    get ripple(): boolean {
        return this.layoutService.config.ripple;
    }

    set ripple(_val: boolean) {
        this.layoutService.config.ripple = _val;
    }

    onConfigButtonClick() {
        this.layoutService.showConfigSidebar();
    }

    decrementScale() {
        this.scale--;
        this.applyScale();
    }

    incrementScale() {
        this.scale++;
        this.applyScale();
    }

    applyScale() {
        document.documentElement.style.fontSize = this.scale + 'px';
    }


}
