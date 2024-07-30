import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, of } from 'rxjs';
// Servicios
import { LayoutService } from 'src/app/modules/layout/service/app.layout.service';
import { PersonaService } from 'src/app/modules/service/data/persona.service';
import { UsuarioService } from 'src/app/modules/service/data/usuario.service';
import { Message, ConfirmationService, MessageService } from 'primeng/api';
// Modelos
import { Persona, PersonaExpanded } from 'src/app/modules/models/persona';
import { Usuario } from 'src/app/modules/models/usuario';
import { TipoPais, TipoCiudad, TipoEstadoCivil, TipoGenero, TipoDocumento, TipoRol } from 'src/app/modules/models/diccionario';
import { RequestStatus } from 'src/app/modules/models/request-status.model';
import { AuthService } from 'src/app/modules/service/core/auth.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css'],
    styles: [`
      :host ::ng-deep .pi-eye,
      :host ::ng-deep .pi-eye-slash {
        transform: scale(1.6);
        margin-right: 1rem;
        color: var(--primary-color) !important;
      }
    `],
    providers: [MessageService, ConfirmationService],

})
export class RegisterComponent implements OnInit {

    Personas: Persona[] = [];
    persona: Persona;
    personData: Persona;

    userData: Usuario;
    usuarioRegistro: Usuario;

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

    TipoRol: TipoRol[] = [];
    TipoRolSeleccionado: TipoRol;

    errors: any;
    personaDialog: boolean = false;
    optionDialog: boolean = false;

    personBool: boolean = false;
    userBool: boolean = false;

    messages: Message[] | undefined;
    valCheck: string[] = ['remember'];

    email: string;
    password: string;
    name: string;
    idpersona: any;
    loading: boolean = false;

    personaForm: FormGroup;
    userForm: FormGroup;
    personasDuplicated: PersonaExpanded[] = [];
    elements: PersonaExpanded[];

    status: RequestStatus = 'init';

    constructor(
        public layoutService: LayoutService,
        private personaService: PersonaService,
        private messageService: MessageService,
        private formBuilder: FormBuilder,
        private spinner: NgxSpinnerService,
        private router: Router,
        private authService: AuthService
    ) { }

    ngOnInit() {
        this.getPersons(); // Se recupera las personas para verificar si existe el usuario

        this.personBool = true;

        this.assignValidationPerson();

        this.assignValidationUser();

        this.userData = new Usuario();

        this.fillComboType();

        this.createPerson();
    }

    getPersons() {
        this.spinner.show();
        this.loading = true;
        this.personaService.getPersons().subscribe(
            (result: any) => {
                this.elements = result;
                this.personasDuplicated = this.elements;
                this.loading = false;
                this.spinner.hide();
            },
            (error: any) => {

                this.loading = false;
                this.spinner.hide();
            }
        );
    }

    // Asignar validaciones del modelo persona
    assignValidationPerson() {
        this.personaForm = this.formBuilder.group({
            perapepat: [''],
            perapemat: [''],
            pernombres: ['', [Validators.required]],
            tipoDocumento: ['', [Validators.required]],
            pernrodoc: ['', [Validators.required], [this.ValidateExistingDocument()]],
            peremail: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]]
        });
    }

    // Asignar validaciones del modelo usuario
    assignValidationUser() {
        this.userForm = this.formBuilder.group({
            usuname: ['', [Validators.required]],
            usuemail: ['', [Validators.required]],
            tipoRol: ['', [Validators.required]],
            usupassword: ['', [Validators.required, Validators.minLength(8), this.passwordStrength]],
            usupasswordhash: ['', [Validators.required]]
        }, { validator: this.passwordMatchValidator });
    }

    // Validación de contraseña control de caracteres
    passwordStrength(control: AbstractControl): { [key: string]: boolean } | null {
        const value = control.value;
        if (value && (!value.match(/[A-Z]/) || !value.match(/[a-z]/) || !value.match(/[0-9]/))) {
            return { passwordStrength: true };
        }
        return null;
    }

    // Validación de contraseña control de contraseñas iguales usupassword y usupasswordconfirm
    passwordMatchValidator(fg: FormGroup): { [key: string]: boolean } | null {
        const password = fg.get('usupassword').value;
        const confirmPassword = fg.get('usupasswordhash').value;
        if (password && confirmPassword && password !== confirmPassword) {
            return { mismatch: true };
        }
        return null;
    }

    ValidateExistingDocument(): AsyncValidatorFn { // Método para crear un validador asíncrono para verificar si un número de documento ya existe
        this.getPersons();// Se llama al método para obtener la lista de personas
        return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {         // Se retorna una función que actúa como validador asíncrono
            const numeroDocumento = control.value; // Se obtiene el valor del control de formulario, que representa el número de documento ingresado por el usuario
            if (!numeroDocumento) {// Si el número de documento está vacío, no se realiza ninguna validación
                return of(null); // Se devuelve un observable que emite null
            }
            const existe = this.personasDuplicated.some(persona => persona.pernrodoc === numeroDocumento);// Se verifica si algún elemento en la lista de personas tiene el mismo número de documento
            return of(existe ? { documentoExistente: true } : null); // Se devuelve un observable que emite un objeto de errores si existe un duplicado, de lo contrario, emite null
        };
    }

    createPerson() {
        this.persona = new Persona();
        this.TipoDocumentoSeleccionado = new TipoDocumento(1, "Ninguno");
        this.personaDialog = true;
        this.loading = true;
    }

    fillComboType() {
        this.spinner.show();
        this.personaService.getTipoDocumento().subscribe({
            next: (data: any) => {
                this.TipoDocumento = data;
                this.spinner.hide();
            },
            error: (error: any) => {
                console.log("Error: ", error);
                this.spinner.hide();
                this.messageService.add({ severity: 'error', summary: '', detail: 'No se pudo obtener datos de tipo de documentos ', life: 3000 });
            }
        });
        this.spinner.show();
        this.personaService.getRoles().subscribe({
            next: (data: any) => {
            this.TipoRol = data.filter((rol: any) => rol.rolnombre === 'Estudiante' || rol.rolnombre === 'Docente' || rol.rolnombre === 'Invitado');
            this.spinner.hide();
            },
            error: (error: any) => {
                console.log("Error: ", error);
                this.spinner.hide();
                this.messageService.add({ severity: 'error', summary: '', detail: 'No se pudo obtener datos de tipo de rol ', life: 3000 });
            }
        });
    }

    returnPersonData() {
        this.personBool = true;
        this.userBool = false;
    }

    sendForm() {

        if (this.personaForm.invalid) {
            this.messageService.add({ severity: 'error', summary: 'Campos incompletos', detail: 'Por favor, debe llenar todos los campos requeridos.', life: 7000 });
            return Object.values(this.personaForm.controls).forEach(control => {
                control.markAllAsTouched();
                control.markAsDirty();
            })
        }
        if (this.personaForm.valid) {
            this.personBool = false;
            this.userBool = true;
            this.userForm.patchValue({
                usuname: this.personaForm.value.pernrodoc,
                usuemail: this.personaForm.value.peremail
            })
        }
    }

    doRegister() {
        // Verificar si el formulario de usuario es inválido
        if (this.userForm.invalid) {
            this.showErrorMessage('Campos incompletos', 'Por favor, debe llenar todos los campos requeridos.');
            this.markAllFieldsAsTouchedAndDirty(this.userForm);
            return;
        }

        // Si ambos formularios son válidos, proceder con el registro
        if (this.userForm.valid && this.personaForm.valid) {
            this.preparePersonData();
            this.spinner.show();

            // Registrar persona
            this.personaService.createPersonForm(this.personData).subscribe({
                next: (data: any) => {
                    this.prepareUserData(data['perid']);
                    this.registerUser();
                },
                error: (error: any) => {
                    this.handleError(error, 'Ocurrió un error en el registro de la persona.');

                }
            });
        }
    }

    // Función auxiliar para mostrar mensajes de error
    private showErrorMessage(summary: string, detail: string) {
        this.messageService.add({ severity: 'error', summary: summary, detail: detail, life: 3000 });
    }

    // Función auxiliar para marcar todos los campos como tocados y sucios
    private markAllFieldsAsTouchedAndDirty(form: FormGroup) {
        Object.values(form.controls).forEach(control => {
            control.markAllAsTouched();
            control.markAsDirty();
        });
    }

    // Función auxiliar para preparar los datos de la persona
    private preparePersonData() {
        this.personData = {
            ...this.persona,
            perapepat: this.personaForm.value.perapepat,
            perapemat: this.personaForm.value.perapemat,
            pernombres: this.personaForm.value.pernombres,
            pernrodoc: this.personaForm.value.pernrodoc,
            peremail: this.personaForm.value.peremail,
            pertipodoc: this.personaForm.value.tipoDocumento.tipodocid,
            perid: null,
            perfoto: null,
            perusureg: 'Register',
            perestcivil: null,
            pergenero: null,
            perpais: null,
            perciudad: null,
            perobservacion: 'Registro mediante formulario'
        };
    }

    // Función auxiliar para preparar los datos del usuario
    private prepareUserData(perid: number) {
        this.userData = {
            perid: perid,
            usuname: this.userForm.value.usuname,
            usuemail: this.userForm.value.usuemail,
            rolid: this.userForm.value.tipoRol.rolid,
            usupassword: this.userForm.value.usupassword,
            usupasswordhash: this.userForm.value.usupasswordhash,
            tipo: 1,
            usuusureg: 'Register',
            usudescripcion: 'Registro mediante formulario',
            usuestado: 1,
            usuid: null,
            usuusumod: null,
            usufecmod: null,
            usufecreg: null,
            perfoto: null,
            pernomcompleto: null,
            pernrodoc: null,
            rolnombre: null
        };
    }

    // Función auxiliar para registrar al usuario
    private registerUser() {
        this.authService.registerUser(this.userData).subscribe({
            next: () => {
                this.showSuccessMessage('Registro Correcto!', 'El Usuario se registró correctamente en el sistema.');
                this.spinner.hide();
                this.router.navigate(['/no-confirm']);
            },
            error: (error: any) => {
                this.handleError(error, 'Ocurrió un error en el registro de usuario nuevo, por favor comuníquese con soporte.');
                // this.deletePersonNotUser(this.userData.perid);
                this.spinner.hide();
            }
        });
    }

    // Función auxiliar para mostrar mensajes de éxito
    private showSuccessMessage(summary: string, detail: string) {
        this.messageService.add({ severity: 'success', summary: summary, detail: detail, life: 5000 });
    }

    // Función auxiliar para manejar errores
    private handleError(error: any, defaultMessage: string) {
        console.error('Error: ', error);
        this.spinner.hide();
        this.showErrorMessage('Algo salió mal!', defaultMessage);
    }

    deletePersonNotUser(perid: number){
        this.personaService.deletePersonForm(perid).subscribe({
            next: () => {
            },
            error: (error: any) => {
            }
        });
    }

}
