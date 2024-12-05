import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';

// Servicios
import { UsuarioService } from 'src/app/modules/service/data/usuario.service';
import { AuthService } from 'src/app/modules/service/core/auth.service';

// Para validaciones
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { Sesion } from 'src/app/modules/models/game';

interface ColumsTable {
    field: string;
    header: string;
}

@Component({
    templateUrl: './sesiones.component.html',
    providers: [MessageService],
    styleUrls: ['./sesiones.component.css']
})

export class SesionesComponent implements OnInit {

    // Variables
    sesiones: Sesion[] = [];
    loading: boolean = false;
    optionDialog: boolean = false;
    errors: any;
    rowsPerPageOptions = [5, 10, 20];

    items: MenuItem[];
    home: MenuItem | undefined;

    constructor( private usuarioService: UsuarioService, private authService: AuthService, private formBuilder: FormBuilder, private spinner: NgxSpinnerService)
    {
    }

    ngOnInit() {

        this.items = [
            { label: 'Administrar'},
            { label: 'Sesiones', routerLink:''},
        ];

        this.home = { icon: 'pi pi-home', routerLink: '/' };

        this.usuarioService.obtenerSesiones().subscribe({
            next: (sesiones) => {
                this.sesiones = sesiones as [];
            },
            error: (err) => {
                console.error(err);
            }
        });
    }
}
