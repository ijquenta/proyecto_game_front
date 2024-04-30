import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/modules/layout/service/app.layout.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { RequestStatus } from 'src/app/modules/models/request-status.model';
import { AuthService } from 'src/app/services/auth.service';
// Services
import { PersonaService } from 'src/app/modules/service/data/persona.service';
import { UsuarioService } from 'src/app/modules/service/data/usuario.service';
// Models
import { Persona, PersonaExpanded } from 'src/app/modules/models/persona';
import { Usuario } from 'src/app/modules/models/usuario';
import { TipoPais, TipoCiudad, TipoEstadoCivil, TipoGenero, TipoDocumento, TipoRol } from 'src/app/modules/models/diccionario';
import { Message } from 'primeng/api';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';

import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms'; // importamos para la validación
import { NgxSpinnerService } from 'ngx-spinner';

import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';

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

    // ------------------------------------------------
    Personas: Persona[] = [];
    persona: Persona;
    personaRegistro: Persona;

    usuario: Usuario;
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

    personaBool: boolean = false;
    usuarioBool: boolean = false;
    // ------------------------------------------------
    // formUser = this.formBuilder.nonNullable.group();
    messages: Message[] | undefined;
    valCheck: string[] = ['remember'];

    email: string;
    password: string;
    name: string;
    idpersona: any;
    loading: boolean = false;
    cod_persona: number = 0;
    //----------------Variables para validación----------------//
    personaForm: FormGroup;
    usuarioForm: FormGroup;

    status: RequestStatus = 'init';
    personasDuplicated: PersonaExpanded[] = [];
    elements: PersonaExpanded[];
    constructor(
        public layoutService: LayoutService,
        private authService: AuthService,
        private personaService: PersonaService,
        private usuarioService: UsuarioService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private router: Router,
        private http: HttpClient,
        private formBuilder: FormBuilder,
        private spinner: NgxSpinnerService
    ) { }
    ngOnInit() {
        this.fListarPersonas();
        this.personaBool = true;
        this.personaForm = this.formBuilder.group({
            perapepat: [''],
            perapemat: [''],
            pernombres: ['', [Validators.required]],
            tipoDocumento: ['', [Validators.required]],
            pernrodoc: ['', [Validators.required], [this.validarDocumentoExistente()]],
            peremail: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]]
        });
        this.usuarioForm = this.formBuilder.group({
            usuname: ['', [Validators.required]],
            usuemail: ['', [Validators.required]],
            tipoRol: ['', [Validators.required]],
            usupassword: ['', [Validators.required, Validators.minLength(8), this.passwordStrength]],
            usupasswordhash: ['', [Validators.required]]
        }, { validator: this.passwordMatchValidator });
        this.usuario = new Usuario();
        this.llenarTipoCombo();
        this.nuevaPersona();
    }
    fListarPersonas() {
        this.spinner.show();
        this.loading = true;
        this.personaService.ListarPersona().subscribe(
            (result: any) => {
                this.elements = result;
                this.personasDuplicated = this.elements;
                // console.log("this.personasDuclicated", this.personasDuplicated)
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
    passwordStrength(control: AbstractControl): { [key: string]: boolean } | null {
        const value = control.value;
        if (value && (!value.match(/[A-Z]/) || !value.match(/[a-z]/) || !value.match(/[0-9]/))) {
            return { passwordStrength: true };
        }
        return null;
    }
    passwordMatchValidator(fg: FormGroup): { [key: string]: boolean } | null {
        const password = fg.get('usupassword').value;
        const confirmPassword = fg.get('usupasswordhash').value;
        if (password && confirmPassword && password !== confirmPassword) {
            return { mismatch: true };
        }
        return null;
    }
    validarDocumentoExistente(): AsyncValidatorFn { // Método para crear un validador asíncrono para verificar si un número de documento ya existe
        this.fListarPersonas();// Se llama al método para obtener la lista de personas
        return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {         // Se retorna una función que actúa como validador asíncrono
            const numeroDocumento = control.value; // Se obtiene el valor del control de formulario, que representa el número de documento ingresado por el usuario
            // console.log("numeroDocumento", numeroDocumento)
            if (!numeroDocumento) {// Si el número de documento está vacío, no se realiza ninguna validación
                return of(null); // Se devuelve un observable que emite null
            }
            const existe = this.personasDuplicated.some(persona => persona.pernrodoc === numeroDocumento);// Se verifica si algún elemento en la lista de personas tiene el mismo número de documento
            return of(existe ? { documentoExistente: true } : null); // Se devuelve un observable que emite un objeto de errores si existe un duplicado, de lo contrario, emite null
        };
    }
    nuevaPersona() {
        this.persona = new Persona();
        this.TipoDocumentoSeleccionado = new TipoDocumento(1, "Ninguno");
        this.personaDialog = true;
        this.loading = true;
    }
    llenarTipoCombo() {
        this.spinner.show();
        this.personaService.getTipoDocumento().subscribe((data: any) => {
            this.TipoDocumento = data;
            // console.log('Documento: ', this.TipoDocumento);
            this.spinner.hide();
        },
            (error: any) => {
                console.log("Error: ", error);
                this.spinner.hide();
                this.messageService.add({ severity: 'error', summary: '', detail: 'No se pudo obtener datos de tipo de documentos ', life: 3000 });
            }
        );
        this.spinner.show();
        this.personaService.getRoles().subscribe((data: any) => {
            // Filtrar los roles que no son "Secretaria" ni "Administrador"
            this.TipoRol = data.filter((rol: any) => rol.rolnombre === 'Estudiante' || rol.rolnombre === 'Docente' || rol.rolnombre === 'Invitado');
            // console.log('Rol: ', this.TipoRol);
            this.spinner.hide();
        },
            (error: any) => {
                console.log("Error: ", error);
                this.spinner.hide();
                this.messageService.add({ severity: 'error', summary: '', detail: 'No se pudo obtener datos de tipo de rol ', life: 3000 });
            }
        );


    }
    volverDatosPersona() {
        this.personaBool = true;
        this.usuarioBool = false;
    }
    enviarFormulario() {

        if (this.personaForm.invalid) {
            this.messageService.add({ severity: 'error', summary: 'Campos incompletos', detail: 'Por favor, debe llenar todos los campos requeridos.', life: 7000 });
            return Object.values(this.personaForm.controls).forEach(control => {
                control.markAllAsTouched();
                control.markAsDirty();
            })
        }
        if (this.personaForm.valid) {
            this.personaBool = false;
            this.usuarioBool = true;
            this.usuarioForm.patchValue({
                usuname: this.personaForm.value.pernrodoc,
                usuemail: this.personaForm.value.peremail
            })
        }
    }

    doRegister() {

        if (this.usuarioForm.invalid) {
            this.messageService.add({ severity: 'info', summary: 'Campos incompletos', detail: 'Por favor, debe llenar todos los campos requeridos.', life: 3000 });
            return Object.values(this.usuarioForm.controls).forEach(control => {
                control.markAllAsTouched();
                control.markAsDirty();
            })
        }
        if (this.usuarioForm.valid) {
            this.personaBool = false;
            this.usuarioBool = false;
        }

        if (this.usuarioForm.valid && this.personaForm.valid) {
            this.personaRegistro = { ...this.persona };
            this.personaRegistro.perapepat = this.personaForm.value.perapepat;
            this.personaRegistro.perapemat = this.personaForm.value.perapemat;
            this.personaRegistro.pernombres = this.personaForm.value.pernombres;
            this.personaRegistro.pernrodoc = this.personaForm.value.pernrodoc;
            this.personaRegistro.peremail = this.personaForm.value.peremail;
            this.personaRegistro.pertipodoc = this.personaForm.value.tipoDocumento.tipodocid;
            this.personaRegistro.perid = null;
            this.personaRegistro.perfoto = null;
            this.personaRegistro.perusureg = 'Sistema';
            this.personaRegistro.perestcivil = null;
            this.personaRegistro.pergenero = null;
            this.personaRegistro.perpais = null;
            this.personaRegistro.perciudad = null;
            // console.log("personaRegistro: ", this.personaRegistro);
            this.spinner.show();
            this.personaService.registrarPersona(this.personaRegistro).subscribe(
                (data: any) => {
                    this.usuario = new Usuario();
                    // this.messageService.add({ severity: 'success', summary: 'Registro Correcto!', detail: 'La persona se registro correctamente en el sistema.', life: 5000 });
                    this.usuario.perid = data['valor'];
                    this.usuario.usuname = this.usuarioForm.value.usuname;
                    this.usuario.usuemail = this.usuarioForm.value.usuemail;
                    this.usuario.rolid = this.usuarioForm.value.tipoRol.rolid;
                    this.usuario.usupassword = this.usuarioForm.value.usupassword;
                    this.usuario.usupasswordhash = this.usuarioForm.value.usupasswordhash;
                    this.usuario.tipo = 1;
                    this.usuario.usuusureg = 'Sistema';
                    this.usuario.usudescripcion = 'Registro mediante login';
                    this.usuario.usuestado = 1;
                    // console.log("usuarioRegistro: ", this.usuario);
                    this.usuarioService.gestionarUsuario(this.usuario).subscribe(
                        (data: any) => {
                            this.messageService.add({ severity: 'success', summary: 'Registro Correcto!', detail: 'El Usuario se registro correctamente en el sistema.', life: 5000 });
                            this.spinner.hide();
                            this.status = 'success';
                            // this.messages = [{ severity: 'success', summary: '!Éxito¡', detail: 'Las credenciales son válidas, su cuenta fue creada con éxito.', life: 3000 }];
                        },
                        (error: any) => {
                            console.log("Error: ", error);
                            this.spinner.hide();
                            this.messageService.add({ severity: 'error', summary: 'Algo salio mal!', detail: 'Ocurrio un error en el registro de usuario nuevo, porfavor comunicarse con soporte.', life: 3000 });
                        });
                },
                (error: any) => {
                    console.log("Error: ", error);
                    this.spinner.hide();
                    this.messageService.add({ severity: 'Error', summary: 'El usuario ya existe!', detail: 'Ocurrio un error en el registro de usuario nuevo, intente con otro usuario.', life: 3000 });
                });

        }

        // console.log("personaForm: ", this.personaForm.value)
        // console.log("usuarioForm: ", this.usuarioForm.value)

        /*
        console.log("Name, Email y Password: ",this.name, this.email, this.password)


        this.status = 'loading';

        const registerData = {
          name: this.name,
          email: this.email,
          password: this.password
        };


        this.authService.register(registerData.name, registerData.email, registerData.password)
        .subscribe({
            next: () => {
                this.status = 'success';
                this.router.navigate(['/login']);
            },
            error: () => {
                this.status = 'failed';
            }
        })
        */

        // this.usuarioRegistro = { ...this.usuario};
        // this.usuarioRegistro.rolid = this.cod_persona;


        /* aqui



        */

        // // Realizar la solicitud POST a la API para autenticar al usuario
        // this.http.post('/api/login', loginData).subscribe(
        //   (response) => {
        //     // Manejar la respuesta exitosa aquí, por ejemplo, redirigir a la página principal
        //     this.status = 'success';
        //     this.router.navigate(['/principal']);
        //   },
        //   (error) => {
        //     // Manejar el error aquí, por ejemplo, mostrar un mensaje de error al usuario
        //     this.status = 'failed';
        //     console.error('Error en el inicio de sesión:', error);
        //   }
        // );
    }
}
