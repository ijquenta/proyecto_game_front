import { Component, OnInit } from '@angular/core'; // Importa la clase Componente y OnInit desde Angular Core
import { Router } from '@angular/router'; // Importa el servicio de enrutamiento de Angular
import { Message } from 'primeng/api'; // Importa la interfaz Message de PrimeNG para representar mensajes

@Component({
    selector: 'app-no-confirm',
    templateUrl: './no-confirm.component.html',
    styleUrls:['./no-confirm.component.css']
})
export class NoConfirmComponent implements OnInit {


    messages: Message[] | undefined;  // Variable de estados

    constructor(
        private router: Router,
    ) { }

    ngOnInit(): void { }
}
