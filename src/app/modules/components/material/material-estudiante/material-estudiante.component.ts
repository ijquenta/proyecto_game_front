// Importaciones de servicios
import { AuthService } from 'src/app/modules/service/core/auth.service';
import { MaterialService } from 'src/app/modules/service/data/material.service';

// Importaciones de librerías externas
import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';

import { Usuario } from 'src/app/modules/models/usuario';

@Component({
    selector: 'app-material-estudiante',
    templateUrl: './material-estudiante.component.html',
    styleUrls: ['./material-estudiante.component.scss'],
})
export class MaterialEstudianteComponent implements OnInit {
    items: MenuItem[];
    home: MenuItem | undefined;
    usuario: Usuario;
    materias: any;

    constructor(
        private materialService: MaterialService,
        private authService: AuthService,
        private spinner: NgxSpinnerService
    ) {
        this.items = [
            { label: 'Material de Apoyo' },
        ];

        this.home = { icon: 'pi pi-home', routerLink: '/principal' };
    }

    ngOnInit(): void {
        this.getMaterialUser();
    }

    getMaterialUser() {
        this.authService.usuario$.subscribe((user) => {
            if (user && Array.isArray(user) && user.length > 0) {
                this.usuario = user[0];

                this.materialService
                    .getMateriaTextoEstudiante(this.usuario.perid)
                    .subscribe({
                        next: (result: any) => {
                            this.materias = result;
                            this.spinner.hide();
                        },
                        error: (error: any) => {
                            this.spinner.hide();
                            console.error('error', error);
                        },
                    });
            }
        });
    }

    viewMaterial(texdocumento: any) {
        this.materialService.getFileTexto(texdocumento);
    }
}
