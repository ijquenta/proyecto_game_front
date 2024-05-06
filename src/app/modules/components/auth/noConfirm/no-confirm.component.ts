import { Component, OnInit } from '@angular/core'; // Importa la clase Componente y OnInit desde Angular Core
import { Router } from '@angular/router'; // Importa el servicio de enrutamiento de Angular
import { Message } from 'primeng/api'; // Importa la interfaz Message de PrimeNG para representar mensajes
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms'; // Importa clases relacionadas con formularios reactivos de Angular
import { AuthService } from 'src/app/services/auth.service'; // Importa el servicio AuthService desde el archivo auth.service
import { NgxSpinnerService } from 'ngx-spinner'; // Importa el servicio NgxSpinnerService para manejar spinners de carga
import { LayoutService } from 'src/app/modules/layout/service/app.layout.service'; // Importa el servicio LayoutService desde el archivo app.layout.service
import { RequestStatus } from 'src/app/modules/models/request-status.model'; // Importa la clase RequestStatus desde el archivo request-status.model


@Component({
    selector: 'app-no-confirm',
    templateUrl: './no-confirm.component.html',
    styleUrls:['./no-confirm.component.css']
})
export class NoConfirmComponent implements OnInit {


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
    }
}
