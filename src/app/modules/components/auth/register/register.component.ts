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
import { Persona } from 'src/app/modules/models/persona';
import { Usuario } from 'src/app/modules/models/usuario';
import { TipoPais, TipoCiudad, TipoEstadoCivil, TipoGenero, TipoDocumento, TipoRol } from 'src/app/modules/models/diccionario';

import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';

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
  // ------------------------------------------------
  // formUser = this.formBuilder.nonNullable.group();

  valCheck: string[] = ['remember'];

  email: string;
  password: string;
  name: string;
  idpersona: any;
  loading: boolean = false;
  cod_persona: number = 0;

  status: RequestStatus = 'init';

  constructor(
    public layoutService: LayoutService,
    private authService: AuthService,
    private personaService: PersonaService,
    private usuarioService: UsuarioService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private http: HttpClient
  ) { }
  ngOnInit() {
    // console.log('ngOnInit-->');
    this.usuario = new Usuario();
    this.llenarTipoCombo();
    this.nuevaPersona();

}


    nuevaPersona() {
        this.persona = new Persona();
        this.TipoDocumentoSeleccionado = new TipoDocumento(1,"Ninguno");
        this.personaDialog = true;
        this.loading = true;

    }
    llenarTipoCombo(){

        this.personaService.getTipoDocumento().subscribe((data: any) => {
            this.TipoDocumento = data;
            // console.log('Documento: ', this.TipoDocumento);
        });
        this.personaService.getRoles().subscribe((data: any) => {
            // Filtrar los roles que no son "Secretaria" ni "Administrador"
            this.TipoRol = data.filter((rol: any) => rol.rolnombre !== 'Secretaria' && rol.rolnombre !== 'Administrador');
            // console.log('Rol: ', this.TipoRol);
        });


    }
    enviarFormulario() {

            this.personaRegistro = { ...this.persona};
            this.personaRegistro.perid = null;
            this.personaRegistro.perfoto = null;
            this.personaRegistro.perusureg = 'ijquenta';
            this.personaRegistro.perestcivil = null;;
            this.personaRegistro.pertipodoc = this.TipoDocumentoSeleccionado.tipodocid;
            this.personaRegistro.pergenero = null;
            this.personaRegistro.perpais = null;
            this.personaRegistro.perciudad = null;
            console.log("personaRegistro: ", this.personaRegistro);
            this.personaService.registrarPersona(this.personaRegistro).subscribe(
                (data : any) =>{
                    // console.log("Registrar Persona: ", data);
                    this.personaDialog = false;
                    this.usuario = new Usuario();
                    this.usuario.perid = data['valor'];
                    // console.log("idpersona: ", this.usuario);
                    this.optionDialog = false;
                    this.messageService.add({ severity: 'success', summary: 'Registro Correcto!', detail: 'La persona se registro correctamente en el sistema.', life: 3000 });
                    // this.ListarPersonas();
                },
                (error: any)=>{
                    console.log("Error: ", error);
                    this.messageService.add({ severity: 'Error', summary: 'El usuario ya existe!', detail: 'Ocurrio un error en el registro de usuario nuevo, intente con otro usuario.', life: 3000 });
                });
        }

        doRegister() {
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
                    this.usuario.rolid = this.TipoRolSeleccionado.rolid;
                    this.usuario.tipo = 1;
                    this.usuario.usuusureg = 'ijquenta';
                    this.usuario.usudescripcion = 'Registro login';
                    this.usuario.usuestado = 1;
                    // console.log("usuarioRegistro: ", this.usuario);
                    this.usuarioService.gestionarUsuario(this.usuario).subscribe(
                        (data : any) =>{
                            // console.log("Registrar Usuario: ", data);
                            this.messageService.add({ severity: 'success', summary: 'Registro Correcto!', detail: 'El Usuario se registro correctamente en el sistema.', life: 3000 });
                            this.status = 'success';
                            // this.loading = false;
                            this.router.navigate(['/login']);
                        }),
                        (error: any)=>{
                            console.log("Error: ", error);
                            this.messageService.add({ severity: 'error', summary: 'Algo salio mal!', detail: 'Ocurrio un error en el registro de usuario nuevo, porfavor comunicarse con soporte.', life: 3000 });
                    }

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
