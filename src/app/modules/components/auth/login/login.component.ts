import { Component, OnInit } from '@angular/core'; // Importa la clase Componente y OnInit desde Angular Core
import { Router } from '@angular/router'; // Importa el servicio de enrutamiento de Angular
import { Message } from 'primeng/api'; // Importa la interfaz Message de PrimeNG para representar mensajes
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms'; // Importa clases relacionadas con formularios reactivos de Angular
import { AuthService } from 'src/app/modules/service/core/auth.service'; // Importa el servicio AuthService desde el archivo auth.service
import { NgxSpinnerService } from 'ngx-spinner'; // Importa el servicio NgxSpinnerService para manejar spinners de carga
import { LayoutService } from 'src/app/modules/layout/service/app.layout.service'; // Importa el servicio LayoutService desde el archivo app.layout.service
import { RequestStatus } from 'src/app/modules/models/request-status.model'; // Importa la clase RequestStatus desde el archivo request-status.model
import { timeout, catchError } from 'rxjs/operators';
import { of, throwError } from 'rxjs';


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls:['./login.component.css'],
    // styles: [`
    // :host ::ng-deep .pi-eye,
    // :host ::ng-deep .pi-eye-slash {
    //   transform: scale(1.6);
    //   margin-right: 1rem;
    //   color: var(--primary-color) !important;
    // }
    // `
    // ],

})
export class LoginComponent implements OnInit {


    messages: Message[] | undefined;  // Variable de estados

    loginForm: FormGroup; // Variable para validación de login

    status: RequestStatus = 'init'; // Variable de estados

    constructor(
        private authService: AuthService,
        private router: Router,
        private formBuilder: FormBuilder,
        private spinner: NgxSpinnerService
    ) { }


    ngOnInit(): void {
       this.asignacionValidacion();
    }

    asignacionValidacion(){ // Función para la asignación de la varialble de validación
        this.loginForm = this.formBuilder.group({
            usuario: [
                '',
                [Validators.required, // Es requerido
                 Validators.minLength(5), // Es como minimo de 5 letras
                 Validators.maxLength(20), // Es como maximo de 20 letras
                 this.noEspacios // Sin espacios
                ]],
            password: ['', [Validators.required]], // Es requerido
        });
    }

    noEspacios(control: AbstractControl) { // Validación de que no se llene espacios vacios
        const valor = control.value;
        if (valor?.includes(' ')) {
          return { espaciosNoPermitidos: true };
        }
        return null;
    }

    doLogin() { // Función para relizar el login de usuario
        if(this.loginForm.invalid){
            return Object.values(this.loginForm.controls).forEach(control=>{
                this.messages = [{ severity: 'error', summary: 'Ups!', detail: 'Las credenciales son incorrectas', life: 3000 }];
                control.markAllAsTouched();
                control.markAsDirty();
                this.status = 'failed';
            })
        }
        if (this.loginForm.valid) {
            this.spinner.show();
            const REQUEST_TIMEOUT = 5000; // 5 segundos
            this.authService.login(this.loginForm.value.usuario, this.loginForm.value.password)
                .pipe(
                    timeout(REQUEST_TIMEOUT),
                    // Captura cualquier error y lo procesa
                    catchError((error) => {
                        if (error.name === 'TimeoutError') {
                            return throwError(() => new Error('El servidor no está disponible, por favor intente más tarde.'));
                        }
                        return throwError(() => error);
                    })
                )
                .subscribe({
                    next: () => {
                        this.status = 'success';
                        this.router.navigate(['/principal']);
                        this.messages = [{ severity: 'success', summary: 'Exitosamente', detail: 'Las credenciales son válidas', life: 2000 }];
                        this.spinner.hide();
                    },
                    error: (error: any) => {
                        this.status = 'failed';
                        this.spinner.hide();
                        if (error.message === 'El servidor no está disponible, por favor intente más tarde.') {
                            this.messages = [{ severity: 'error', summary: 'Error:', detail: error.message, life: 3000 }];
                        } else {
                            if (error.error.message.includes('Email not confirmed')) {
                                this.router.navigate(['/confirm']);
                            }
                            this.messages = [{ severity: 'error', summary: 'Error', detail: 'Las credenciales son inválidas', life: 3000 }];
                        }
                    }
                });
        }
    }
}
