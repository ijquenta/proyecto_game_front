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

    constructor(public layoutService: LayoutService) {}

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
                        roles: [
                            'Administrador',
                            'Secretaria',
                            'Estudiante',
                            'Docente',
                            'Invitado',
                        ],
                    },
                    {
                        label: 'Panel',
                        icon: 'pi pi-fw pi-chart-pie',
                        routerLink: ['panel/'],
                        roles: ['Administrador', 'Secretaria'],
                    },
                ],
            },
            {
                label: 'Usuario',
                icon: 'pi pi-fw pi-briefcase',
                items: [
                    {
                        label: 'Usuarios',
                        icon: 'pi pi-fw pi-user',
                        items: [
                            {
                                label: 'Gestionar Personas',
                                icon: 'pi pi-fw pi-users',
                                routerLink: ['usuario/persona'],
                                roles: ['Administrador', 'Secretaria'],
                            },
                            {
                                label: 'Gestionar Usuarios',
                                icon: 'pi pi-fw pi-users',
                                routerLink: ['usuario/crud'],
                                roles: ['Administrador', 'Secretaria'],
                            },
                            {
                                label: 'Gestionar Roles',
                                icon: 'pi pi-fw pi-wrench',
                                routerLink: ['usuario/roles'],
                                roles: ['Administrador'],
                            },
                            {
                                label: 'Gestionar Accesos',
                                icon: 'pi pi-fw pi-wrench',
                                routerLink: ['usuario/acceso'],
                                roles: ['Administrador'],
                            },
                            {
                                label: 'Gestionar Permisos',
                                icon: 'pi pi-fw pi-wrench',
                                routerLink: ['usuario/permiso'],
                                roles: ['Administrador'],
                            },
                        ],
                        roles: ['Administrador', 'Secretaria'],
                    },
                ],
                roles: ['Administrador', 'Secretaria'],
            },
            {
                label: 'Curso | Materia',
                icon: 'pi pi-fw pi-briefcase',
                items: [
                    {
                        label: 'Materia',
                        icon: 'pi pi-fw pi-folder',
                        items: [
                            {
                                label: 'Gestionar Materias',
                                icon: 'pi pi-fw pi-folder-open',
                                routerLink: ['materia/crud'],
                                roles: ['Administrador', 'Secretaria'],
                            },
                            {
                                label: 'Materias Asignadas',
                                icon: 'pi pi-fw pi-file-pdf',
                                routerLink: ['materia/docente'],
                                roles: ['Docente'],
                            },
                            {
                                label: 'Mis Materias',
                                icon: 'pi pi-fw pi-book',
                                routerLink: ['materia/estudiante'],
                                roles: ['Estudiante'],
                            },
                            {
                                label: 'Pensum',
                                icon: 'pi pi-fw pi-book',
                                routerLink: ['materia/pensum'],
                                roles: ['Estudiante'],
                            },
                        ],
                        roles: [
                            'Administrador',
                            'Secretaria',
                            'Docente',
                            'Estudiante',
                        ],
                    },
                    {
                        label: 'Nivel',
                        icon: 'pi pi-fw pi-circle-off',
                        items: [
                            {
                                label: 'Gestionar Niveles',
                                icon: 'pi pi-fw pi-folder-open',
                                routerLink: ['nivel/crud'],
                                roles: ['Administrador', 'Secretaria'],
                            },
                        ],
                        roles: ['Administrador', 'Secretaria'],
                    },
                    {
                        label: 'Curso',
                        icon: 'pi pi-fw pi-clone',
                        items: [
                            {
                                label: 'Gestionar Cursos',
                                icon: 'pi pi-fw pi-folder-open',
                                routerLink: ['curso/crud'],
                                roles: ['Administrador', 'Secretaria'],
                            },
                        ],
                        roles: ['Administrador', 'Secretaria'],
                    },
                ],
                roles: ['Administrador', 'Secretaria', 'Docente', 'Estudiante'],
            },
            {
                label: 'Estudiante | Nota',
                icon: 'pi pi-fw pi-briefcase',
                items: [
                    {
                        label: 'Estudiantes',
                        icon: 'pi pi-fw pi-users',
                        items: [
                            {
                                label: 'Admisión',
                                icon: 'pi pi-fw pi-file-import',
                                routerLink: ['estudiante/admision'],
                                roles: [
                                    'Administrador',
                                    'Secretaria',
                                    'Estudiante',
                                ],
                                items: [
                                    {
                                        label: 'Gestionar Admisión',
                                        icon: 'pi pi-fw pi-file-import',
                                        routerLink: ['estudiante/admision'],
                                        roles: ['Administrador', 'Secretaria'],
                                    },
                                    {
                                        label: 'Mi Admisión',
                                        icon: 'pi pi-fw pi-file-import',
                                        routerLink: ['estudiante/mi-admision'],
                                        roles: ['Estudiante'],
                                    },
                                    {
                                        label: 'Tipo Profesión',
                                        icon: 'pi pi-fw pi-list',
                                        routerLink: [
                                            'estudiante/admision/tipoProfesion',
                                        ],
                                        roles: ['Administrador', 'Secretaria'],
                                    },
                                    {
                                        label: 'Tipo Educación',
                                        icon: 'pi pi-fw pi-list',
                                        routerLink: [
                                            'estudiante/admision/tipoEducacion',
                                        ],
                                        roles: ['Administrador', 'Secretaria'],
                                    },
                                    {
                                        label: 'Tipo Cargo',
                                        icon: 'pi pi-fw pi-list',
                                        routerLink: [
                                            'estudiante/admision/tipoCargo',
                                        ],
                                        roles: ['Administrador', 'Secretaria'],
                                    },
                                ],
                            },
                        ],
                        roles: ['Administrador', 'Secretaria', 'Estudiante'],
                    },
                    {
                        label: 'Nota',
                        icon: 'pi pi-fw pi-folder',
                        items: [
                            {
                                label: 'Gestionar Notas',
                                icon: 'pi pi-fw pi-folder-open',
                                routerLink: ['nota/crud'],
                                roles: ['Administrador', 'Secretaria'],
                            },
                            {
                                label: 'Asignar Notas',
                                icon: 'pi pi-fw pi-pencil',
                                routerLink: ['nota/docente'],
                                roles: ['Docente'],
                            },
                            {
                                label: 'Mis Notas',
                                icon: 'pi pi-fw pi-star',
                                routerLink: ['nota/estudiante'],
                                roles: ['Estudiante'],
                            },
                        ],
                        roles: [
                            'Administrador',
                            'Secretaria',
                            'Docente',
                            'Estudiante',
                        ],
                    },
                ],
                roles: ['Administrador', 'Secretaria', 'Docente', 'Estudiante'],
            },
            {
                label: 'Docentes',
                icon: 'pi pi-fw pi-users',
                items: [
                    {
                        label: 'Gestionar Docente',
                        icon: 'pi pi-fw pi-folder-open',
                        routerLink: ['docente/crud'],
                        roles: ['Administrador', 'Secretaria'],
                    },
                    {
                        label: 'Mi Admisión',
                        icon: 'pi pi-fw pi-file-import',
                        routerLink: ['docente/mi-admision-doc'],
                        roles: ['Docente'],
                    },
                ],
                roles: ['Administrador', 'Secretaria', 'Docente'],
            },
            {
                label: 'Inscripción y Matriculación',
                icon: 'pi pi-fw pi-briefcase',
                items: [
                    {
                        label: 'Inscripción',
                        icon: 'pi pi-fw pi-user-plus',
                        items: [
                            {
                                label: 'Inscripbir estudiante',
                                icon: 'pi pi-fw pi-plus-circle',
                                routerLink: ['inscripcion/crud'],
                                roles: ['Administrador', 'Secretaria'],
                            },
                        ],
                        roles: ['Administrador', 'Secretaria'],
                    },
                    {
                        label: 'Matriculación',
                        icon: 'pi pi-fw pi-check-square',
                        items: [
                            {
                                label: 'Administrar Matricula',
                                icon: 'pi pi-fw pi-list',
                                routerLink: ['matricula/listar'],
                                roles: ['Administrador', 'Secretaria'],
                            },
                            {
                                label: 'Asignar Matricula',
                                icon: 'fa-regular fa-address-card',
                                routerLink: ['matricula/asignar'],
                            },
                        ],
                        roles: ['Administrador', 'Secretaria'],
                    },
                ],
                roles: ['Administrador', 'Secretaria'],
            },
            {
                label: 'Material de Apoyo',
                icon: 'pi pi-fw pi-briefcase',
                items: [
                    {
                        label: 'Material de Apoyo',
                        icon: 'pi pi-fw pi-book',
                        items: [
                            {
                                label: 'Gestionar Material',
                                icon: 'pi pi-fw pi-folder-open',
                                roles: [
                                    'Administrador',
                                    'Secretaria',
                                    'Docente',
                                ],
                                items: [
                                    {
                                        label: 'Listar Texto',
                                        icon: 'pi pi-fw pi-plus',
                                        routerLink: ['material/crud'],
                                        roles: [
                                            'Administrador',
                                            'Secretaria',
                                            'Docente',
                                        ],
                                    },
                                    {
                                        label: 'Tipo Texto',
                                        icon: 'pi pi-fw pi-folder-open',
                                        routerLink: [
                                            'material/crud/tipo-texto',
                                        ],
                                        roles: [
                                            'Administrador',
                                            'Secretaria',
                                            'Docente',
                                        ],
                                    },
                                    {
                                        label: 'Tipo Categoria Texto',
                                        icon: 'pi pi-fw pi-folder-open',
                                        routerLink: [
                                            'material/crud/tipo-categoria-texto',
                                        ],
                                        roles: [
                                            'Administrador',
                                            'Secretaria',
                                            'Docente',
                                        ],
                                    },
                                ],
                            },
                            {
                                label: 'Asignar Material',
                                icon: 'pi pi-fw pi-wrench',
                                routerLink: ['material/asignar'],
                                roles: [
                                    'Administrador',
                                    'Secretaria',
                                    'Docente',
                                ],
                            },
                            {
                                label: 'Mi Material de Apoyo',
                                icon: 'pi pi-fw pi-file',
                                routerLink: ['material/mi-material'],
                                roles: ['Estudiante'],
                            },
                        ],
                        roles: [
                            'Administrador',
                            'Secretaria',
                            'Docente',
                            'Estudiante',
                        ],
                    },
                ],
                roles: ['Administrador', 'Secretaria', 'Docente', 'Estudiante'],
            },
            {
                label: 'Pago',
                icon: 'pi pi-fw pi-briefcase',
                roles: ['Administrador', 'Secretaria', 'Estudiante'],
                items: [
                    {
                        label: 'Gestión de Pagos',
                        icon: 'pi pi-fw pi-credit-card',
                        roles: ['Administrador', 'Secretaria'],
                        items: [
                            {
                                label: 'Todos los Pagos',
                                icon: 'pi pi-fw pi-money-bill',
                                routerLink: ['pago/todos'],
                                roles: ['Administrador', 'Secretaria'],
                            },
                        ],
                    },
                    {
                        label: 'Mis Pagos',
                        icon: 'pi pi-fw pi-credit-card',
                        roles: ['Estudiante'],
                        items: [
                            {
                                label: 'Mis Pagos',
                                icon: 'pi pi-fw pi-money-bill',
                                routerLink: ['pago/estudiante'],
                                roles: ['Estudiante'],
                            },
                            {
                                label: 'Mis Matriculas',
                                icon: 'fa-regular fa-address-card',
                                routerLink: ['pago/estudiante-matricula'],
                                roles: ['Estudiante'],
                            },
                        ],
                    },
                ],
            },
            {
                label: 'Contabilidad',
                icon: 'pi pi-fw pi-briefcase',
                items: [
                    {
                        label: 'Contabilidad',
                        icon: 'pi pi-fw pi-credit-card',
                        items: [
                            {
                                label: 'Gestionar Contabilidad',
                                icon: 'pi pi-fw pi-money-bill',
                                routerLink: ['contabilidad/gestionar'],
                                roles: ['Administrador', 'Secretaria'],
                            },
                        ],
                        roles: ['Administrador', 'Secretaria'],
                    },
                ],
                roles: ['Administrador', 'Secretaria'],
            },
        ];
    }
}
