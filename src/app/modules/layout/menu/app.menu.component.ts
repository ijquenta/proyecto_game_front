import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from '../service/app.layout.service';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];
    items: MenuItem[];

    constructor(public layoutService: LayoutService) {
     }

    ngOnInit() {

        this.model = [

            {
                label: 'Principal',
                icon: 'pi pi-fw pi-home',
                items: [
                    { label: 'Panel de Control', icon: 'pi pi-fw pi-home', routerLink: ['/principal'] }
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
                                label: 'Gestionar Persona',
                                icon: 'pi pi-fw pi-users',
                                routerLink: ['usuario/persona'],
                                roles: ['Administrador', 'Secretaria']
                            },
                            {
                                label: 'Gestionar Usuarios',
                                icon: 'pi pi-fw pi-users',
                                routerLink: ['usuario/crud'],
                                roles: ['Administrador', 'Secretaria']
                            },
                            {
                                label: 'Gestionar Roles',
                                icon: 'pi pi-fw pi-wrench',
                                routerLink: ['usuario/roles'],
                                roles: ['Administrador']
                            },
                            // {
                            //     label: 'Gestionar Accesos',
                            //     icon: 'pi pi-fw pi-wrench',
                            //     routerLink: ['usuario/accesos'],
                            //     roles: ['Administrador']
                            // },
                            // {
                            //     label: 'Reporte Usuarios',
                            //     icon: 'pi pi-fw pi-file-pdf',
                            //     routerLink: ['usuario/reporte'],
                            //     roles: ['Administrador']
                            // }
                        ],
                        roles: ['Administrador', 'Secretaria']
                    }
                ],
                roles: ['Administrador', 'Secretaria']

            },
            {
                label: 'Materias y Cursos',
                icon: 'pi pi-fw pi-briefcase',
                items: [
                    {
                        label: 'Materia',
                        icon: 'pi pi-fw pi-folder',
                        items: [
                            {
                                label: 'Gestionar Materia',
                                icon: 'pi pi-fw pi-folder-open',
                                routerLink: ['materia/crud'],
                                roles: ['Administrador', 'Secretaria']
                            },
                            // {
                            //     label: 'Reporte Materia',
                            //     icon: 'pi pi-fw pi-file-pdf',
                            //     routerLink: ['materia/reporte'],
                            //     roles: ['Administrador', 'Secretaria']
                            // },
                            {
                                label: 'Materias asignadas',
                                icon: 'pi pi-fw pi-file-pdf',
                                routerLink: ['materia/docente'],
                                roles: ['Docente']
                            },
                            {
                                label: 'Mis materias',
                                icon: 'pi pi-fw pi-file-pdf',
                                routerLink: ['materia/estudiante'],
                                roles: ['Estudiante']
                            },

                        ],
                        roles: ['Administrador', 'Secretaria', 'Docente', 'Estudiante']
                    },
                    {
                        label: 'Niveles',
                        icon: 'pi pi-fw pi-circle-off',
                        items: [
                            {
                                label: 'Gestionar Niveles',
                                icon: 'pi pi-fw pi-folder-open',
                                routerLink: ['nivel/crud'],
                                roles: ['Administrador', 'Secretaria']
                            },
                            // {
                            //     label: 'Reporte Niveles',
                            //     icon: 'pi pi-fw pi-file-pdf',
                            //     routerLink: ['nivel/reporte']
                            // },
                        ],
                        roles: ['Administrador', 'Secretaria']
                    },
                    {
                        label: 'Cursos',
                        icon: 'pi pi-fw pi-circle-off',
                        items: [
                            {
                                label: 'Gestionar Cursos',
                                icon: 'pi pi-fw pi-folder-open',
                                routerLink: ['curso/crud'],
                                roles: ['Administrador', 'Secretaria']
                            },
                            // {
                            //     label: 'Mis cursos',
                            //     icon: 'pi pi-fw pi-folder-open',
                            //     routerLink: ['curso/estudiante'],
                            //     roles: ['Estudiante']
                            // },
                            // {
                            //     label: 'Reporte Cursos',
                            //     icon: 'pi pi-fw pi-file-pdf',
                            //     routerLink: ['curso/reporte']
                            // },
                        ],
                        roles: ['Administrador', 'Secretaria']
                    }
                ],
                roles: ['Administrador', 'Secretaria', 'Docente', 'Estudiante']
            },
            {
                label: 'Estudiante',
                icon: 'pi pi-fw pi-briefcase',
                items: [
                    {
                        label: 'Estudiantes',
                        icon: 'pi pi-fw pi-users',
                        items: [
                            {
                                label: 'Gestionar Estudiantes',
                                icon: 'pi pi-fw pi-folder-open',
                                routerLink: ['estudiante/crud'],
                                roles: ['Administrador', 'Secretaria']
                            },
                            // {
                            //     label: 'Reportes Estudiantes',
                            //     icon: 'pi pi-fw pi-file-pdf',
                            //     routerLink: ['estudiante/reporte'],
                            //     roles: ['Administrador', 'Secretaria']
                            // }
                        ],
                        roles: ['Administrador', 'Secretaria']
                    },
                    // {
                    //     label: 'Asistencias',
                    //     icon: 'pi pi-fw pi-clock',
                    //     items: [
                    //         {
                    //             label: 'Gestionar Asistencias',
                    //             icon: 'pi pi-fw pi-folder-open',
                    //             routerLink: ['asistencia/crud'],
                    //             roles: ['Administrador', 'Secretaria']
                    //         },
                    //         {
                    //             label: 'Asignar asistencias',
                    //             icon: 'pi pi-fw pi-folder-open',
                    //             routerLink: ['asistencia/docente'],
                    //             roles: ['Docente']
                    //         },
                    //         {
                    //             label: 'Ver mis asistencias',
                    //             icon: 'pi pi-fw pi-folder-open',
                    //             routerLink: ['asistencia/estudiante'],
                    //             roles: ['Estudiante']
                    //         },
                    //         {
                    //             label: 'Reportes Asistencias',
                    //             icon: 'pi pi-fw pi-file-pdf',
                    //             routerLink: ['asistencia/reporte'],
                    //             roles: ['Administrador', 'Secretaria']
                    //         }
                    //     ],
                    //     roles: ['Administrador', 'Secretaria', 'Docente', 'Estudiante']
                    // },
                    {
                        label: 'Notas',
                        icon: 'pi pi-fw pi-star',
                        items: [
                            {
                                label: 'Gestionar Notas',
                                icon: 'pi pi-fw pi-folder-open',
                                routerLink: ['nota/crud'],
                                roles: ['Administrador', 'Secretaria']
                            },
                            {
                                label: 'Asignar notas',
                                icon: 'pi pi-fw pi-wrench',
                                routerLink: ['nota/docente'],
                                roles: ['Docente']
                            },
                            {
                                label: 'Ver mis notas',
                                icon: 'pi pi-fw pi-wrench',
                                routerLink: ['nota/estudiante'],
                                roles: ['Estudiante']
                            },
                            // {
                            //     label: 'Reportes Notas',
                            //     icon: 'pi pi-fw pi-file-pdf',
                            //     routerLink: ['nota/reporte'],
                            //     roles: ['Administrador', 'Secretaria']
                            // }
                        ],
                        roles: ['Administrador', 'Secretaria', 'Docente', 'Estudiante']
                    }
                ],
                roles: ['Administrador', 'Secretaria', 'Docente', 'Estudiante']
            },
            {
                label: 'Docentes',
                icon: 'pi pi-fw pi-users',
                items: [
                    {
                        label: 'Gestionar Docente',
                        icon: 'pi pi-fw pi-folder-open',
                        routerLink: ['docente/crud'],
                        roles: ['Administrador', 'Secretaria']
                    },
                    // {
                    //     label: 'Reportes Docentes',
                    //     icon: 'pi pi-fw pi-file-pdf',
                    //     routerLink: ['docente/reporte'],
                    //     roles: ['Administrador', 'Secretaria']
                    // }
                ],
                roles: ['Administrador', 'Secretaria']
            },

            {
                label: 'Inscripción',
                icon: 'pi pi-fw pi-briefcase',
                items: [
                    {
                        label: 'Inscripciones', icon: 'pi pi-fw pi-user-plus',
                        items: [
                            {
                                label: 'Inscripbir estudiante', icon: 'pi pi-fw pi-plus-circle',
                                items: [
                                    { label: 'Administrar Inscripción', icon: 'pi pi-fw pi-user-plus', routerLink: ['inscripcion/crud'] },
                                    //{ label: 'Listar Incripciones', icon: 'pi pi-fw pi-users', routerLink: ['inscripcion/listar'] },
                                    //{ label: 'Verificar Incripción', icon: 'pi pi-fw pi-verified', routerLink: ['inscripcion/verificar']  },
                                ],
                                roles: ['Administrador', 'Secretaria']
                            },
                            // {
                            //     label: 'Ver mis inscripciones',
                            //     icon: 'pi pi-fw pi-plus-circle',
                            //     routerLink: ['inscripcion/estudiante'],
                            //     roles: [ 'Estudiante']
                            // },
                            // {
                            //     label: 'Reporte Incripción', icon: 'pi pi-fw pi-file-edit',
                            //     items: [
                            //         { label: 'Reportes por Estudiante', icon: 'pi pi-fw pi-file-pdf', routerLink: ['inscripcion/reporteEstudiante']  },
                            //         { label: 'Reportes general', icon: 'pi pi-fw pi-file', routerLink: ['inscripcion/reportes']}
                            //     ]
                            // },
                        ],
                        roles: ['Administrador', 'Secretaria']
                    },
                    {
                        label: 'Matriculación', icon: 'pi pi-fw pi-check-square',
                        items: [
                            {
                                label: 'Administración Matricula', icon: 'pi pi-fw pi-list',
                                items: [
                                    // { label: 'Nuevo Apertura Matricula', icon: 'pi pi-fw pi-plus', routerLink: ['matricula/nuevo'], roles: ['Administrador', 'Secretaria'] },
                                    { label: 'Listar matriculas', icon: 'pi pi-fw pi-users', routerLink: ['matricula/listar'],  roles: ['Administrador', 'Secretaria']},

                                ],
                                roles: ['Administrador', 'Secretaria']
                            },
                            // {
                            //     label: 'Ver mis matriculas', icon: 'pi pi-fw pi-list',
                            //     items: [
                            //         // { label: 'Nuevo Apertura Matricula', icon: 'pi pi-fw pi-plus', routerLink: ['matricula/nuevo'], roles: ['Administrador'] },
                            //         { label: 'Ver mis matriculas',
                            //           icon: 'pi pi-fw pi-users',
                            //           routerLink: ['matricula/estudiante'],
                            //           roles: ['Estudiante']},
                            //     ],
                            //     roles: ['Estudiante']
                            // },
                            /*{
                                label: 'Reporte Matricula', icon: 'pi pi-fw pi-file-pdf',
                                items: [
                                    { label: 'Reportes', icon: 'pi pi-fw pi-file', routerLink: ['matricula/reporte'] },
                                ]
                            },*/
                        ],
                        roles: ['Administrador', 'Secretaria',]
                    }
                ],
                roles: ['Administrador', 'Secretaria']
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
                                routerLink: ['material/crud'],
                                roles: ['Administrador', 'Secretaria', 'Docente', 'Estudiante', 'Invitado']
                            },
                            // {
                            //     label: 'Accesos Usuarios',
                            //     icon: 'pi pi-fw pi-wrench',
                            //     routerLink: ['/usuario/empty']
                            // },
                            // {
                            //     label: 'Reporte Material',
                            //     icon: 'pi pi-fw pi-file-pdf',
                            //     routerLink: ['material/reporte'],
                            //     roles: ['Administrador', 'Secretaria', 'Docente', 'Estudiante', 'Invitado']
                            // }
                        ],
                        roles: ['Administrador', 'Secretaria', 'Docente', 'Estudiante', 'Invitado']
                    }
                ],
                roles: ['Administrador', 'Secretaria', 'Docente', 'Estudiante', 'Invitado']
            },

            {
                label: 'Pagos',
                icon: 'pi pi-fw pi-briefcase',
                items: [
                    {
                        label: 'Pagos',
                        icon: 'pi pi-fw pi-credit-card',
                        items: [
                            {
                                label: 'Gestionar Pagos',
                                icon: 'pi pi-fw pi-money-bill',
                                routerLink: ['pago/crud'],
                                roles: ['Administrador', 'Secretaria']
                            },
                            // {
                            //     label: 'Reportes Pagos',
                            //     icon: 'pi pi-fw pi-file-pdf',
                            //     routerLink: ['pago/reporte'],
                            //     roles: ['Administrador', 'Secretaria']
                            // },
                            // {
                            //     label: 'Notificación de pago',
                            //     icon: 'pi pi-fw pi-bell',
                            //     routerLink: ['pago/notificacion'],
                            //     roles: ['Administrador', 'Secretaria']
                            // },
                            {
                                label: 'Mis pagos',
                                icon: 'pi pi-fw pi-bell',
                                routerLink: ['pago/estudiante'],
                                roles: ['Estudiante']
                            }
                        ],
                        roles: ['Administrador', 'Secretaria', 'Estudiante']
                    },
                    // {
                    //     label: 'Notificación de pago',
                    //     icon: 'pi pi-fw pi-bell',
                    //     items: [
                    //         {
                    //             label: 'Envio de mensaje',
                    //             icon: 'pi pi-fw pi-bell',
                    //             // routerLink: ['/usuario/crud']
                    //         },
                    //     ]
                    // }
                ],
                roles: ['Administrador', 'Secretaria', 'Estudiante']
            },
            // {
            //     label: 'Mensajes',
            //     icon: 'pi pi-fw pi-briefcase',
            //     items: [
            //         {
            //             label: 'Mensajes',
            //             icon: 'pi pi-fw pi-credit-card',
            //             items: [
            //                 {
            //                     label: 'Ver mensajes',
            //                     icon: 'pi pi-fw pi-money-bill',
            //                     routerLink: ['mensaje/crud'],
            //                     roles: ['Administrador', 'Secretaria', 'Docente', 'Estudiante']
            //                 }
            //             ],
            //             roles: ['Administrador', 'Secretaria', 'Docente', 'Estudiante']
            //         },
            //     ],
            //     roles: ['Administrador', 'Secretaria', 'Docente', 'Estudiante']
            // },
        ];
    }








}
