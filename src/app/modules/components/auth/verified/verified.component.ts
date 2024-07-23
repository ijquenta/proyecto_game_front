import { Component, OnInit } from '@angular/core'; // Importa la clase Componente y OnInit desde Angular Core
import { Router } from '@angular/router'; // Importa el servicio de enrutamiento de Angular
import { Message } from 'primeng/api'; // Importa la interfaz Message de PrimeNG para representar mensajes
import { AuthService } from 'src/app/modules/service/core/auth.service'; // Importa el servicio AuthService desde el archivo auth.service
import { NgxSpinnerService } from 'ngx-spinner'; // Importa el servicio NgxSpinnerService para manejar spinners de carga
import { RequestStatus } from 'src/app/modules/models/request-status.model'; // Importa la clase RequestStatus desde el archivo request-status.model
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-verified',
    templateUrl: './verified.component.html',
    styleUrls:['./verified.component.css']
})
export class    VerifiedComponent implements OnInit {

    token: string;
    messages: Message[] | undefined;  // Variable de estados
    status: RequestStatus = 'init'; // Variable de estados
    statusCofirm: boolean = false;

    constructor(
        private authService: AuthService,
        private spinner: NgxSpinnerService,
        private route: ActivatedRoute
    ) { }


    ngOnInit(): void {

        this.route.queryParams.subscribe(params => {
            const token = params['token'];
            if (token) {
                this.confirmEmail(token);
            }
        });
    }

    confirmEmail(token: string): void {
        this.spinner.show();
        this.authService.confirmEmail(token).subscribe({
            next: (response: any) => {
                this.spinner.hide();
                this.statusCofirm = true;
            },
            error: (error: any) => {
                console.error('Error al confirmar el correo electrónico:', error);
                this.spinner.hide();
                this.statusCofirm = false;
            },
            complete: () => {
                this.spinner.hide();
            }
        })
    }
}
