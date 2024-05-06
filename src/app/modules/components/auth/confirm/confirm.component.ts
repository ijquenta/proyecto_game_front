import { Component, OnInit } from '@angular/core'; // Importa la clase Componente y OnInit desde Angular Core
import { Router } from '@angular/router'; // Importa el servicio de enrutamiento de Angular
import { Message } from 'primeng/api'; // Importa la interfaz Message de PrimeNG para representar mensajes

@Component({
    selector: 'app-confirm',
    templateUrl: './confirm.component.html',
    styleUrls:['./confirm.component.css']
})
export class ConfirmComponent implements OnInit {


    messages: Message[] | undefined;

    constructor(
        private router: Router,
    ) { }


    ngOnInit(): void {

    }
}
