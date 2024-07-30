import { Component, OnInit } from '@angular/core'; // Importa la clase Componente y OnInit desde Angular Core
import { Router } from '@angular/router'; // Importa el servicio de enrutamiento de Angular
import { Message } from 'primeng/api'; // Importa la interfaz Message de PrimeNG para representar mensajes
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms'; // Importa clases relacionadas con formularios reactivos de Angular
import { AuthService } from 'src/app/modules/service/core/auth.service'; // Importa el servicio AuthService desde el archivo auth.service
import { NgxSpinnerService } from 'ngx-spinner'; // Importa el servicio NgxSpinnerService para manejar spinners de carga
import { RequestStatus } from 'src/app/modules/models/request-status.model'; // Importa la clase RequestStatus desde el archivo request-status.model
import { timeout, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    providers: [MessageService],
    styleUrls:['./login.component.css'],
    styles: [`
    :host ::ng-deep .pi-eye,
    :host ::ng-deep .pi-eye-slash {
        transform: scale(1.6);
        margin-right: 1rem;
        color: var(--primary-color) !important;
    }
    `
    ],

})
export class LoginComponent implements OnInit {

    messages: Message[] | undefined;  // Variable de estados
    loginForm: FormGroup; // Variable para validación de login
    status: RequestStatus = 'init'; // Variable de estados

    constructor(
        private authService: AuthService,
        private router: Router,
        private formBuilder: FormBuilder,
        private spinner: NgxSpinnerService,
        private messageService: MessageService,
    ) { }

    ngOnInit(): void {
        this.assignValidation();
    }

    assignValidation(){ // Función para la asignación de la varialble de validación
        this.loginForm = this.formBuilder.group({
            usuario: [
                '',
                [Validators.required, // Es requerido
                 Validators.minLength(5), // Es como minimo de 5 letras
                 Validators.maxLength(20), // Es como maximo de 20 letras
                 this.validationNotSpaces // Sin espacios
                ]],
            password: ['', [Validators.required]], // Es requerido
        });
    }

    validationNotSpaces(control: AbstractControl) { // Validación de que no se llene espacios vacios
        const valor = control.value;
        if (valor?.includes(' ')) {
            return { spacesNotAllowed: true };
        }
        return null;
    }

    doLogin() {
        // Verifica si el formulario es inválido y muestra mensajes de error
        if (this.loginForm.invalid) {
            this.displayErrorMessage('Usuario o contraseña incorrectos');
            Object.values(this.loginForm.controls).forEach(control => {
                control.markAsTouched();
                control.markAsDirty();
            });
            this.status = 'failed';
            return;
        }

        // Si el formulario es válido, procede con el login
        if (this.loginForm.valid) {
            this.spinner.show();
            const REQUEST_TIMEOUT = 5000; // 5 segundos

            this.authService.login(this.loginForm.value.usuario, this.loginForm.value.password)
                .pipe(
                    timeout(REQUEST_TIMEOUT),
                    catchError((error) => {
                        if (error.name === 'TimeoutError') {
                            return throwError(() => new Error('El servidor no está disponible, por favor intente más tarde.'));
                        }
                        return throwError(() => error);
                    })
                )
                .subscribe({
                    next: () => {
                        this.handleSuccess();
                    },
                    error: (error: any) => {
                        this.handleError(error);
                    }
                });
        }
    }

    // Función auxiliar para manejar la salida por éxito
    handleSuccess() {
        this.router.navigate(['/principal']);
        this.spinner.hide();
    }

    // Función auxiliar para manejar errores
    handleError(error: any) {
        this.status = 'failed';
        this.spinner.hide();

        if (error.message === 'El servidor no está disponible, por favor intente más tarde.') {
            this.displayErrorMessage(error.message);
        } else {
            if (error.error.message.includes('Email not confirmed')) {
                this.router.navigate(['/confirm']);
            }
            this.displayErrorMessage('Usuario o contraseña incorrectos');
        }
    }

    // Función auxiliar para mostrar mensajes de error
    displayErrorMessage(message: string) {
        this.messages = [{ severity: 'error', summary: '', detail: message, life: 3000 }];
    }

}
