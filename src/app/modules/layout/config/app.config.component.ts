import { ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';
import { LayoutService } from "../service/app.layout.service";
import { MenuService } from "../menu/app.menu.service";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
// Services
import { AuthService } from 'src/app/modules/service/core/auth.service';
import { TokenService } from 'src/app/modules/service/core/token.service';
import { Router } from '@angular/router';
import { UsuarioService } from '../../service/data/usuario.service';
//Models
import { Usuario } from '../../models/usuario';
import { environment } from 'src/environments/environment';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { Persona } from '../../models/persona';
import { PersonaService } from '../../service/data/persona.service';
import { TipoCiudad, TipoDocumento, TipoEstadoCivil, TipoGenero, TipoPais } from '../../models/diccionario';
import { FileUpload } from 'primeng/fileupload';
@Component({
    selector: 'app-config',
    templateUrl: './app.config.component.html',
    styleUrls: ['../../../app.component.css']
})
export class AppConfigComponent {


    @ViewChild('fileUploadperfoto') fileUploadperfoto: FileUpload;
    usuario: any = {};
    userProfilePhoto = environment.API_URL_PROFILE_PHOTO;
    @Input() minimal: boolean = false;
    scales: number[] = [12, 13, 14, 15, 16];
    isDarkTheme: boolean = false;
    showDialogPerfil: boolean = false
    persona: Persona;
    showDialogPerfilModificar: boolean = false;
    personaForm: FormGroup;
    personasDuplicated: Persona[] = [];
    loading: boolean = false;
    personas: Persona[] = [];
    TipoDocumento: TipoDocumento[] = [];
    TipoGenero: TipoGenero[] = [];
    TipoCiudad: TipoCiudad[] = [];
    TipoCiudadRespaldo: TipoCiudad[] = [];
    TipoPais: TipoPais[] = [];
    id: any;
    TipoEstadoCivil: TipoEstadoCivil[] = [];
    originalPerNroDoc: any;


    fileurlperfoto: any;
    perfotoFile: File | null = null;
    perfotoFileUrl: string | null = null;
    showDialogChangePassword: any;
    userPasswordForm: FormGroup<any>;
    userData: Usuario;

    constructor(public layoutService: LayoutService,
                public menuService: MenuService,
                private authService: AuthService,
                private confirmationService: ConfirmationService,
                private messageService: MessageService,
                private router: Router,
                private spinner: NgxSpinnerService,
                private personaService: PersonaService,
                private formBuilder: FormBuilder,
                private cdr: ChangeDetectorRef,
                private usuarioService: UsuarioService
               ) { }

    ngOnInit() {
        this.obtenerDatosUsuario();
        this.initializeTheme();
        this.asignacionVariables();
        this.listarPersonas();
        this.llenarTipoCombo();

        this.userPasswordForm = this.formBuilder.group({
            usupassword: ['', [Validators.required, Validators.minLength(8), this.seguridadPassword]],
            usupasswordconfirm: ['', [Validators.required]]
        }, { validator: this.validardorPasswords });

    }

    showModalChangePassword() {
        this.showDialogChangePassword = true;
    }

    hideDialogChangePassword(){
        this.showDialogChangePassword = false;
    }


    changePassword() {
        // Verify that the fields are correct
        if (this.userPasswordForm.invalid) {
            this.messageService.add({ severity: 'error', summary: 'Advertencia', detail: 'Por favor, verifica las contraseñas ingresadas.', life: 3000 });
            return Object.values(this.userPasswordForm.controls).forEach(control => {
                control.markAllAsTouched();
                control.markAsDirty();
            });
        }
        console.log("changePassword: ", this.userPasswordForm.value)

        this.userData = new Usuario();
        this.userData.usuname = this.usuario.usuname;
        this.userData.usupassword = this.userPasswordForm.value.usupassword;
        this.spinner.show();
        this.usuarioService.changePassword(this.userData).subscribe({
          next: (response) => {
            console.log("changePassword response: ",response);
            this.spinner.hide();

            this.messageService.add(
                {
                    severity: 'success',
                    summary: 'Contraseña',
                    detail: 'Se cambió correctamente.',
                    life: 3000
                }
            );
          },
          error: (err) => {
            console.log(err);
            this.spinner.hide();
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Ocurrió un error. Contacta al soporte.',
                life: 5000
            });
          },
          complete: () => {
            this.spinner.hide();
            this.showDialogChangePassword = false;
            // this.userPasswordForm.reset();
          }
        });
    }

    // Verifica que la contraseña: debe incluir mayúsculas, minúsculas y números
    seguridadPassword(control: AbstractControl): { [key: string]: boolean } | null {
        const value = control.value;
        if (value && (!value.match(/[A-Z]/) || !value.match(/[a-z]/) || !value.match(/[0-9]/))) {
          return { seguridadPassword: true };
        }
        return null;
      }

    // Verifica si las contraseña y repetir la contraseña sean iguales
    validardorPasswords(fg: FormGroup): { [key: string]: boolean } | null {
        const password = fg.get('usupassword').value;
        const confirmPassword = fg.get('usupasswordconfirm').value;
        if (password && confirmPassword && password !== confirmPassword) {
            return { mismatch: true };
        }
        return null;
    }

    mostrarModalCambiarContrasenia() {
    throw new Error('Method not implemented.');
    }

    obtenerDatosUsuario() {
        this.authService.getProfile().subscribe(
            (result: any) => {
              this.usuario = result[0];
            },
            (error: any) => {
              console.error("Error al obtener el perfil: ", error);
            }
          );
    }

    asignacionVariables() {
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

    listarPersonas() {
        this.spinner.show();
        this.loading = true;
        this.personaService.getPersons().subscribe(
            (result: any) => {
                this.personas = result;
                this.personasDuplicated = this.personas;
                this.loading = false;
                this.spinner.hide();
            },
            (error: any) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Ocurrió un error. Contacta al soporte.',
                    life: 5000
                });
                this.loading = false;
                this.spinner.hide();
            }
        );
    }

    llenarTipoCombo() {
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

    validarEdadMinima(): AsyncValidatorFn {
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

    validarDocumentoExistente(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
            const numeroDocumento = control.value;
            if (!numeroDocumento) {
                return of(null);
            }
            const existe = this.personasDuplicated.some(persona => persona.pernrodoc === numeroDocumento);
            return of(existe ? { documentoExistente: true } : null);
        };
    }

    validateNroDocIfChanged(control: AbstractControl) {
        if (control.value === this.originalPerNroDoc) {
            return of(null);
        } else {
            return this.validarDocumentoExistente()(control);
        }
    }

    mostrarModalModificarPerfil() {
        this.showDialogPerfil = true;
        this.persona = new Persona();
        this.personaService.mostrarPerfil(this.usuario.perid).subscribe(
            (result: any) => {
                this.persona = result['data'];
            },
            (error: any) => {
                console.error("Error al obtener el perfil: ", error);
            }
        );
    }

    mostrarModificarPerfil(){
        this.showDialogPerfilModificar = true;
        this.llenarTipoCombo();
        this.persona = { ...this.persona};
        console.log("mod:", this.persona);
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
            perdirec: this.persona.perdirec,
            peremail: this.persona.peremail,
            percelular: this.persona.percelular,
            pertelefono: this.persona.pertelefono,
            tipoEstadoCivil: new TipoEstadoCivil(this.persona.perestcivil, this.persona.estadocivilnombre),
            tipoPais: new TipoPais(this.persona.perpais, this.persona.paisnombre),
            tipoCiudad: new TipoCiudad(this.persona.perciudad, this.persona.ciudadnombre, this.persona.perpais),
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

    ocultarDialog(){
        this.showDialogPerfilModificar = false;
        this.personaForm.reset();
    }

    enviarFormulario(){
        this.personaForm.patchValue({
            perfoto: this.fileurlperfoto || null,
        });

        if (this.personaForm.invalid) {
            this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Por favor, verifica la información ingresada e intenta nuevamente.', life: 3000 });
            return Object.values(this.personaForm.controls).forEach(control => {
                control.markAllAsTouched();
                control.markAsDirty();
            });
        }

        const formData: FormData = new FormData();

            formData.append('perid', this.personaForm.value.perid);
            formData.append('perfoto', this.perfotoFile || null);
            formData.append('pernomcompleto', (this.personaForm.value.perapepat + ' ' + this.personaForm.value.perapemat + ' ' + this.personaForm.value.pernombres) || null);
            formData.append('pernombres', this.personaForm.value.pernombres || null);
            formData.append('perapepat', this.personaForm.value.perapepat || null);
            formData.append('perapemat', this.personaForm.value.perapemat || null);
            formData.append('pertipodoc', this.personaForm.value.tipoDocumento?.tipodocid || null);
            formData.append('pernrodoc', this.personaForm.value.pernrodoc || null);
            formData.append('perfecnac', this.personaForm.value.perfecnac || null);
            formData.append('pergenero', this.personaForm.value.tipoGenero?.generoid || null);
            formData.append('perestcivil', this.personaForm.value.tipoEstadoCivil?.estadocivilid || null);
            formData.append('perpais', this.personaForm.value.tipoPais?.paisid || null);
            formData.append('perciudad', this.personaForm.value.tipoCiudad?.ciudadid || null);
            formData.append('perdirec', this.personaForm.value.perdirec || null);
            formData.append('peremail', this.personaForm.value.peremail || null);
            formData.append('percelular', this.personaForm.value.percelular || null);
            formData.append('pertelefono', this.personaForm.value.pertelefono || null);
            formData.append('perusumod', this.usuario.usuname);

            this.loading = true;
            this.spinner.show();

            console.log("datos para modificar: ", formData.getAll)

            this.personaService.modificiarPerfil(formData).subscribe(
                (data: any) => {

                    this.showDialogPerfilModificar = false;
                    this.messageService.add(
                        {
                            severity: 'success',
                            summary: 'Datos de perfil',
                            detail: 'Se modificó correctamente en el sistema.',
                            life: 3000
                        }
                    );

                    this.loading = false;
                    this.spinner.hide();
                    this.fileUploadperfoto.clear();
                    this.personaForm.reset();
                    this.perfotoFile = null;

                    this.personaService.mostrarPerfil(this.usuario.perid).subscribe(
                        (result: any) => {
                            this.persona = result['data'];
                        },
                        (error: any) => {
                            console.error("Error al obtener el perfil: ", error);
                        }
                    );

                    this.obtenerDatosUsuario();
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

    isImage(fileType: string): boolean {
      return fileType.startsWith('image/');
    }

    isPDF(fileType: string): boolean {
      return fileType === 'application/pdf';
    }


    initializeTheme() {
        const theme = localStorage.getItem('theme');
        if(theme === "theme-dark"){
            this.isDarkTheme = true;
        }
        else {
            this.isDarkTheme = false;
        }
        const colorScheme = localStorage.getItem('colorScheme');
        if (theme && colorScheme) {
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
        if(themeLink) {
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

    logout(){
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
