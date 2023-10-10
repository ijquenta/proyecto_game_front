import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/modules/service/data/usuario.service';
import { Rol } from 'src/app/modules/models/rol';


@Component({
    // selector: './usuario-accesos.component',
    templateUrl: './usuario-accesos.component.html'
})
export class UsuarioAccesosComponent implements OnInit{ 

    listaRoles: Rol[] = [];

    constructor( 
            public usuarioService: UsuarioService,
               ) {}

    ngOnInit() {
        console.log("ngOnInit-->")
        this.usuarioService.getRoles().subscribe(
            (data: any) => {
                this.listaRoles = data;
                console.log("Roless", this.listaRoles)
            }
        )
    }

    // getSeverity(status: string) {
    //     switch (status) {
    //         case 'INSTOCK':
    //             return 'success';
    //         case 'LOWSTOCK':
    //             return 'warning';
    //         case 'OUTOFSTOCK':
    //             return 'danger';
    //     }
    // }
}





