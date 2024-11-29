import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/modules/layout/service/app.layout.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Message } from 'primeng/api';
import { RequestStatus } from 'src/app/modules/models/request-status.model';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms'; // importamos para la validación
import { UsuarioService } from 'src/app/modules/service/data/usuario.service';
// Service
import { AuthService } from 'src/app/modules/service/core/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Usuario } from 'src/app/modules/models/usuario';
@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls:['../login/login.component.css'],
})
export class ForgotPasswordComponent implements OnInit {

    valCheck: string[] = ['remember'];
    messages: Message[] | undefined;
    usuario: string;
    password: string;
    //----------------Variables para validación----------------//
    loginForm: FormGroup;
    forgotForm: FormGroup;
    usuarios: any[] = []; // Cambiado a array para manejar múltiples usuarios
    status: RequestStatus = 'init';

    forgotDataBool: boolean = false;
    userFoundDataBool: boolean = false;
    modalMessage: string;
    displayModal: boolean;
    usuarioRegistro: Usuario;

    constructor(
        public layoutService: LayoutService,
        private authService: AuthService,
        private router: Router,
        private http: HttpClient,
        private formBuilder: FormBuilder,
        private spinner: NgxSpinnerService,
        private usuarioService: UsuarioService
    ) {
        this.loginForm = this.formBuilder.group({
            usuario:['', [Validators.required]],
            password: ['', [Validators.required]],
        });

        this.forgotForm = this.formBuilder.group({
            usuname: ['', [Validators.required]],
            usuemail: [''],
        });
    }

    ngOnInit(): void {
        this.forgotDataBool = true;
    }

    doLogin() {
        if(this.loginForm.invalid){
            return Object.values(this.loginForm.controls).forEach(control=>{
                this.messages = [{ severity: 'error', summary: '', detail: 'Las campos son inválidas', life: 3000 }];
                control.markAllAsTouched();
                control.markAsDirty();
                this.status = 'failed';
            })
        }
        if(this.loginForm.valid){
            this.spinner.show();
            this.authService.login(this.loginForm.value.usuario)
                .subscribe({
                    next: () => {
                        this.status = 'success';
                        this.router.navigate(['/principal']);
                        this.messages = [{ severity: 'success', summary: 'Exitosamente', detail: 'Las credenciales son válidas', life: 2000 }];
                        this.spinner.hide();
                    },
                    error: () => {
                        this.status = 'failed';
                        this.spinner.hide();
                        this.messages = [{ severity: 'error', summary: '', detail: 'Las credenciales son inválidas', life: 3000 }];
                    }
                }
            )
        }
    }

    enviarFormulario() {
        if (this.forgotForm.invalid) {
          this.messages = [{ severity: 'error', summary: '', detail: 'Las credenciales son inválidas', life: 3000 }];
          return Object.values(this.forgotForm.controls).forEach(control => {
            control.markAllAsTouched();
            control.markAsDirty();
            this.status = 'failed';
          });
        }

        if (this.forgotForm.valid) {
          this.forgotDataBool = false;
          this.userFoundDataBool = true;

          const criterio = {
            usuname: this.forgotForm.value.usuname,
            usuemail: this.forgotForm.value.usuemail
          };

          this.spinner.show();
          this.usuarioService.buscarUsuario(criterio).subscribe({
            next: (response) => {
              this.usuarios = response.data;
              this.spinner.hide();
            },
            error: (err) => {
              this.spinner.hide();
            },
            complete: () => {
              this.spinner.hide();
            }
          })
        }
    }

    restablecerContrasena(usuario: any) {
        this.usuarioRegistro = new Usuario();
        this.usuarioRegistro = {...usuario};
        this.spinner.show();
        this.usuarioService.requestChangePassword(this.usuarioRegistro)
            .subscribe({
                next: (response: any) => {
                    if(response.code === 200) {
                        this.modalMessage = `Se ha enviado un enlace para restablecer la contraseña al correo ${usuario.usuemail}.`;
                        this.displayModal = true;
                    }
                    this.spinner.hide();
                },
                error: (err) => {
                    this.modalMessage = `Ocurrio un error, por favor contactarse con soporte.`
                    this.modalMessage = err.message;
                    this.displayModal = true;
                    this.spinner.hide();
                },
                complete: () => {
                    this.spinner.hide();
                }

            }
        )
    }

    volverFormulario() {
      this.forgotDataBool = true;
      this.userFoundDataBool = false;
    }

    volverLogin() {
      this.displayModal = false;
      this.forgotDataBool = false;
      this.userFoundDataBool = false;
      this.router.navigate(['/login']);
    }
}
