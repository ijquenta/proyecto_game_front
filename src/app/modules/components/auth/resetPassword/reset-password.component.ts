import { RequestStatus } from 'src/app/modules/models/request-status.model';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms'; // importamos para la validación
import { NgxSpinnerService } from 'ngx-spinner';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/modules/service/core/auth.service';
import { Usuario } from 'src/app/modules/models/usuario';
import { environment } from 'src/environments/environment';
import { UsuarioService } from 'src/app/modules/service/data/usuario.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['../register/register.component.css'],
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
    // Variables
    usuario: Usuario;
    token: string;
    routeSub: Subscription;
    status: RequestStatus = 'init';
    userProfilePhotofil = environment.API_URL_PROFILE_PHOTO;
    usuarioForm: FormGroup;
    forgotForm: FormGroup;
    usuarioRegistro: Usuario;
    resetPasswordBool: boolean;
    messageSuccessBool: boolean;

    constructor(
        private authService: AuthService,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private usuarioService: UsuarioService,
        private router: Router,
        private spinner: NgxSpinnerService
    ) {}

    ngOnInit(): void {
        this.usuario = new Usuario();
        this.obtenerDatosUsuarioToken();
        this.asignacionValidacionUsuario();
        this.resetPasswordBool = true;
        this.messageSuccessBool = false;
    }

    ngOnDestroy(): void {
        if (this.routeSub) {
            this.routeSub.unsubscribe();
        }
    }

    obtenerDatosUsuarioToken() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.token = params['token'];
            this.spinner.show();
            if (this.token) {
              this.authService.getProfileToken(this.token).subscribe({
                next: (usuario) => {
                  this.usuario = usuario[0];
                  this.spinner.hide();
                },
                error: (error) => {
                  console.error('Error al obtener el perfil del usuario', error);
                  this.spinner.hide();
                },
                complete: () => {
                  this.spinner.hide();
                }
              });
            }
        });
    }

    asignacionValidacionUsuario() {
        this.usuarioForm = this.formBuilder.group(
            {
                usuname: [''],
                usupassword: [
                    '',
                    [
                        Validators.required,
                        Validators.minLength(8),
                        this.passwordStrength,
                    ],
                ],
                usupasswordhash: ['', [Validators.required]],
            },
            { validator: this.passwordMatchValidator }
        );
    }

    passwordMatchValidator(fg: FormGroup): { [key: string]: boolean } | null {
        const password = fg.get('usupassword').value;
        const confirmPassword = fg.get('usupasswordhash').value;
        if (password && confirmPassword && password !== confirmPassword) {
            return { mismatch: true };
        }
        return null;
    }

    passwordStrength(control: AbstractControl): { [key: string]: boolean } | null {
        const value = control.value;
        if (value && (!value.match(/[A-Z]/) || !value.match(/[a-z]/) || !value.match(/[0-9]/))) {
            return { passwordStrength: true };
        }
        return null;
    }

    enviarFormulario(): void {
        this.usuarioForm.patchValue({
          usuname: this.usuario.usuname
        });

        if (this.usuarioForm.invalid) {
          return Object.values(this.usuarioForm.controls).forEach(control => {
            control.markAsTouched();
            control.markAsDirty();
          });
        }

        this.usuarioRegistro = new Usuario();
        this.usuarioRegistro.usuname = this.usuarioForm.value.usuname;
        this.usuarioRegistro.usupassword = this.usuarioForm.value.usupassword;
        this.spinner.show();
        this.usuarioService.resetPassword(this.token, this.usuarioRegistro).subscribe({
          next: (response) => {
            console.log(response);
            this.spinner.hide();
          },
          error: (err) => {
            console.log(err);
            this.spinner.hide();
          },
          complete: () => {
            this.spinner.hide();
            this.resetPasswordBool = false;
            this.messageSuccessBool = true;
          }
        });
    }
}
