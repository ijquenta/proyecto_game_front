import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/modules/layout/service/app.layout.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Message } from 'primeng/api';
import { RequestStatus } from 'src/app/modules/models/request-status.model';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms'; // importamos para la validación
// Service
import { AuthService } from 'src/app/services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { StyleClass } from 'primeng/styleclass';
import { AbstractControl } from '@angular/forms';
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
    :host ::ng-deep .pi-eye,
    :host ::ng-deep .pi-eye-slash {
      transform: scale(1.6);
      margin-right: 1rem;
      color: var(--primary-color) !important;
    }
  `
],
    styleUrls:['./login.component.css']
})
export class LoginComponent implements OnInit {

    valCheck: string[] = ['remember'];
    messages: Message[] | undefined;
    usuario: string;
    password: string;
    //----------------Variables para validación----------------//
    loginForm: FormGroup;

    status: RequestStatus = 'init';

    constructor(
        public layoutService: LayoutService,
        private authService: AuthService,
        private router: Router,
        private http: HttpClient,
        private formBuilder: FormBuilder,
        private spinner: NgxSpinnerService
    ) {

    }


    ngOnInit(): void {
        this.loginForm = this.formBuilder.group({
            usuario: [
                '',
                [Validators.required,
                 Validators.minLength(5),
                 Validators.maxLength(20),
                 this.noEspacios
                ]],
            password: ['', [Validators.required]],
        });
    }

    noEspacios(control: AbstractControl) {
        const valor = control.value;
        if (valor?.includes(' ')) {
          return { espaciosNoPermitidos: true };
        }
        return null;
    }

    inicioCorrecto(control: AbstractControl) {
        const valor = control.value;
        if (valor && !valor.match(/^[a-zA-Z]/)) {
          return { inicioInvalido: true };
        }
        return null;
    }

    doLogin() {
        console.log("Usuario y Password: ", this.loginForm.value)
        if(this.loginForm.invalid){
            return Object.values(this.loginForm.controls).forEach(control=>{
                this.messages = [{ severity: 'error', summary: 'Ups!', detail: 'Las credenciales son incorrectas', life: 3000 }];
                control.markAllAsTouched();
                control.markAsDirty();
                this.status = 'failed';
            })
        }
        if(this.loginForm.valid){
            this.spinner.show();
            this.authService.login(this.loginForm.value.usuario, this.loginForm.value.password)
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
        /*
        // Realizar la solicitud POST a la API para autenticar al usuario
        this.http.post('/api/login', loginData).subscribe(
          (response) => {
            // Manejar la respuesta exitosa aquí, por ejemplo, redirigir a la página principal
            this.status = 'success';
            this.router.navigate(['/principal']);
          },
          (error) => {
            // Manejar el error aquí, por ejemplo, mostrar un mensaje de error al usuario
            this.status = 'failed';
            console.error('Error en el inicio de sesión:', error);
          }
        );
        */
    }
}
