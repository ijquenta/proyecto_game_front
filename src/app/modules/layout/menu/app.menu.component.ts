import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from '../service/app.layout.service';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
})
export class AppMenuComponent implements OnInit {
    model: any[] = [];
    items: MenuItem[];

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
        this.model = [
            {
                label: 'Principal',
                icon: 'pi pi-fw pi-home',
                items: [
                    {
                        label: 'Principal',
                        icon: 'pi pi-fw pi-home',
                        routerLink: ['principal/'],
                    },
                ],
            },
            {
                label: 'Administrar',
                icon: 'pi pi-fw pi-wrench',
                items: [
                    {
                        label: 'Usuario',
                        icon: 'pi pi-fw pi-users',
                        routerLink: ['game/usuarios'],
                    },
                    {
                        label: 'Doctores',
                        icon: 'pi pi-fw pi-users',
                        routerLink: ['game/doctores'],
                    },
                    {
                        label: 'Pacientes',
                        icon: 'pi pi-fw pi-users',
                        routerLink: ['game/pacientes'],
                    },
                    {
                        label: 'Sesiones',
                        icon: 'pi pi-fw pi-wrench',
                        routerLink: ['game/sesiones'],
                    },
                ],
            },
        ];
    }
}
