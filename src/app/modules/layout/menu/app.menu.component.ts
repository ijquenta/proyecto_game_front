import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from '../service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
        this.model = [
            // {
            //     label: 'Usuarios',
            //     icon: 'pi pi-fw pi-briefcase',
            //     items: [
            //         {
            //             label: 'Administrar Usuarios',
            //             icon: 'pi pi-fw pi-pencil',
            //             routerLink: ['/usuario/crud']
            //         },
            //         {
            //             label: 'Buscar',
            //             icon: 'pi pi-fw pi-circle-off',
            //             routerLink: ['/usuario/empty']
            //         },
            //     ]
            // },
            {
                label: 'Principal',
                items: [
                    { label: 'Panel de Control', icon: 'pi pi-fw pi-home', routerLink: ['/principal'] }
                ]
            },
            {
                label: 'USUARIOS',
                icon: 'pi pi-fw pi-briefcase',
                items: [
                    {
                        label: 'Usuarios',
                        icon: 'pi pi-fw pi-user',
                        items: [
                            {
                                label: 'Gestionar Usuarios',
                                icon: 'pi pi-fw pi-users',
                                routerLink: ['usuario/crud']
                            },
                            {
                                label: 'Accesos Usuarios',
                                icon: 'pi pi-fw pi-wrench',
                                routerLink: ['usuario/accesos']
                            },
                            {
                                label: 'Gestionar Persona',
                                icon: 'pi pi-fw pi-users',
                                routerLink: ['usuario/persona']
                            }
                            ,
                            // {
                            //     label: 'Reporte Usuarios',
                            //     icon: 'pi pi-fw pi-file-pdf',
                            //     routerLink: ['usuario/reporte']
                            // }
                        ]
                    }
                ]
            },
            {
                label: 'ESTUDIANTES',
                icon: 'pi pi-fw pi-briefcase',
                items: [
                    {
                        label: 'Estudiantes',
                        icon: 'pi pi-fw pi-users',
                        items: [
                            {
                                label: 'Gestionar Estudiantes',
                                icon: 'pi pi-fw pi-folder-open',
                                routerLink: ['estudiante/crud']
                            },
                            // {
                            //     label: 'Accesos Usuarios',
                            //     icon: 'pi pi-fw pi-wrench',
                            //     routerLink: ['/usuario/empty']
                            // },
                            {
                                label: 'Reportes Estudiantes',
                                icon: 'pi pi-fw pi-file-pdf',
                                routerLink: ['estudiante/reporte']
                            }
                        ]
                    },
                    {
                        label: 'Asistencias',
                        icon: 'pi pi-fw pi-clock',
                        items: [
                            {
                                label: 'Gestionar Asistencias',
                                icon: 'pi pi-fw pi-folder-open',
                                routerLink: ['asistencia/crud']
                            },
                            // {
                            //     label: 'Accesos Usuarios',
                            //     icon: 'pi pi-fw pi-wrench',
                            //     routerLink: ['/usuario/empty']
                            // },
                            {
                                label: 'Reportes Asistencias',
                                icon: 'pi pi-fw pi-file-pdf',
                                routerLink: ['asistencia/reporte']
                            }
                        ]
                    },
                    {
                        label: 'Notas',
                        icon: 'pi pi-fw pi-star',
                        items: [
                            {
                                label: 'Gestionar Notas',
                                icon: 'pi pi-fw pi-folder-open',
                                routerLink: ['nota/crud']
                            },
                            // {
                            //     label: 'Accesos Usuarios',
                            //     icon: 'pi pi-fw pi-wrench',
                            //     routerLink: ['/usuario/empty']
                            // },
                            {
                                label: 'Reportes Notas',
                                icon: 'pi pi-fw pi-file-pdf',
                                routerLink: ['nota/reporte']
                            }
                        ]
                    }
                ]
            },
            {
                label: 'DOCENTES',
                icon: 'pi pi-fw pi-briefcase',
                items: [
                    {
                        label: 'Docentes',
                        icon: 'pi pi-fw pi-users',
                        items: [
                            {
                                label: 'Gestionar Docente',
                                icon: 'pi pi-fw pi-folder-open',
                                routerLink: ['docente/crud']
                            },
                            // {
                            //     label: 'Accesos Usuarios',
                            //     icon: 'pi pi-fw pi-wrench',
                            //     routerLink: ['/usuario/empty']
                            // },
                            {
                                label: 'Reportes Docentes',
                                icon: 'pi pi-fw pi-file-pdf',
                                routerLink: ['docente/reporte']
                            }
                        ]
                    }
                ]
            },
            {
                label: 'INSCRIPCIÓN',
                items: [
                    {
                        label: 'Inscripción', icon: 'pi pi-fw pi-user-plus',
                        items: [
                            {
                                label: 'Administrar Inscripción', icon: 'pi pi-fw pi-plus-circle',
                                items: [
                                    { label: 'Nueva Inscripción', icon: 'pi pi-fw pi-user-plus', routerLink: ['inscripcion/nuevo'] },
                                    { label: 'Listar Incripciones', icon: 'pi pi-fw pi-users', routerLink: ['inscripcion/listar'] },
                                    { label: 'Verificar Incripción', icon: 'pi pi-fw pi-verified', routerLink: ['inscripcion/verificar']  },
                                ]
                            },
                            {
                                label: 'Reporte Incripción', icon: 'pi pi-fw pi-file-edit',
                                items: [
                                    { label: 'Reportes por Estudiante', icon: 'pi pi-fw pi-file-pdf', routerLink: ['inscripcion/reporteEstudiante']  },
                                    { label: 'Reportes general', icon: 'pi pi-fw pi-file', routerLink: ['inscripcion/reportes']}
                                ]
                            },
                        ]
                    },
                    {
                        label: 'Matriculación', icon: 'pi pi-fw pi-check-square',
                        items: [
                            {
                                label: 'Administración Matricula', icon: 'pi pi-fw pi-list',
                                items: [
                                    { label: 'Nuevo Apertura Matricula', icon: 'pi pi-fw pi-plus', routerLink: ['matricula/nuevo'] },
                                    { label: 'Listar Matriculas', icon: 'pi pi-fw pi-users', routerLink: ['matricula/listar'] },

                                ]
                            },
                            {
                                label: 'Reporte Matricula', icon: 'pi pi-fw pi-file-pdf',
                                items: [
                                    { label: 'Reportes', icon: 'pi pi-fw pi-file', routerLink: ['matricula/reporte'] },
                                ]
                            },
                        ]
                    }
                ]
            },
            {
                label: 'MATERIAL DE APOYO',
                icon: 'pi pi-fw pi-briefcase',
                items: [
                    {
                        label: 'Material de Apoyo',
                        icon: 'pi pi-fw pi-book',
                        items: [
                            {
                                label: 'Gestionar Material',
                                icon: 'pi pi-fw pi-folder-open',
                                routerLink: ['material/crud']
                            },
                            // {
                            //     label: 'Accesos Usuarios',
                            //     icon: 'pi pi-fw pi-wrench',
                            //     routerLink: ['/usuario/empty']
                            // },
                            {
                                label: 'Reporte Material',
                                icon: 'pi pi-fw pi-file-pdf',
                                routerLink: ['material/reporte']
                            }
                        ]
                    }
                ]
            },
            {
                label: 'MATERIAS Y CURSOS',
                icon: 'pi pi-fw pi-briefcase',
                items: [
                    {
                        label: 'Materia',
                        icon: 'pi pi-fw pi-folder',
                        items: [
                            {
                                label: 'Gestionar Materia',
                                icon: 'pi pi-fw pi-folder-open',
                                routerLink: ['materia/crud']
                            },
                            // {
                            //     label: 'Historial Materia',
                            //     icon: 'pi pi-fw pi-file-pdf',
                            //     routerLink: ['materia/reporte']
                            // }
                        ]
                    },
                    {
                        label: 'Niveles',
                        icon: 'pi pi-fw pi-circle-off',
                        items: [
                            {
                                label: 'Gestionar Niveles',
                                icon: 'pi pi-fw pi-folder-open',
                                routerLink: ['nivel/crud']
                            },
                            // {
                            //     label: 'Reporte Niveles',
                            //     icon: 'pi pi-fw pi-file-pdf',
                            //     routerLink: ['nivel/reporte']
                            // },
                        ]
                    },
                    {
                        label: 'Cursos',
                        icon: 'pi pi-fw pi-circle-off',
                        items: [
                            {
                                label: 'Gestionar Cursos',
                                icon: 'pi pi-fw pi-folder-open',
                                routerLink: ['curso/crud']
                            },
                            // {
                            //     label: 'Reporte Cursos',
                            //     icon: 'pi pi-fw pi-file-pdf',
                            //     routerLink: ['curso/reporte']
                            // },
                        ]
                    }
                ]
            },
            {
                label: 'PAGOS',
                icon: 'pi pi-fw pi-briefcase',
                items: [
                    {
                        label: 'Pagos',
                        icon: 'pi pi-fw pi-credit-card',
                        items: [
                            {
                                label: 'Gestionar Pagos',
                                icon: 'pi pi-fw pi-money-bill',
                                routerLink: ['pago/crud']
                            },
                            {
                                label: 'Reportes Pagos',
                                icon: 'pi pi-fw pi-file-pdf',
                                routerLink: ['pago/reporte']
                            },
                            {
                                label: 'Notificación de pago',
                                icon: 'pi pi-fw pi-bell',
                                routerLink: ['pago/notificacion']
                            }
                        ]
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
                ]
            },
            /*
            {
                label: 'Estudiantes',
                icon: 'pi pi-fw pi-briefcase',
                items: [
                    {
                        label: 'Administrar Estudiantes',
                        icon: 'pi pi-fw pi-pencil',
                        routerLink: ['/usuario/crud']
                    },
                    {
                        label: 'Buscar',
                        icon: 'pi pi-fw pi-circle-off',
                        routerLink: ['/usuario/empty']
                    },
                ]
            },
            {
                label: 'Docentes',
                icon: 'pi pi-fw pi-briefcase',
                items: [
                    {
                        label: 'Administrar Estudiantes',
                        icon: 'pi pi-fw pi-pencil',
                        routerLink: ['/usuario/crud']
                    },
                    {
                        label: 'Buscar',
                        icon: 'pi pi-fw pi-circle-off',
                        routerLink: ['/usuario/empty']
                    },
                ]
            },
            {
                label: 'Materia',
                icon: 'pi pi-fw pi-briefcase',
                items: [
                    {
                        label: 'Administrar Estudiantes',
                        icon: 'pi pi-fw pi-pencil',
                        routerLink: ['/usuario/crud']
                    },
                    {
                        label: 'Buscar',
                        icon: 'pi pi-fw pi-circle-off',
                        routerLink: ['/usuario/empty']
                    },
                ]
            },
            {
                label: 'MATERIAL DE CLASES',
                icon: 'pi pi-fw pi-briefcase',
                items: [
                    {
                        label: 'Administrar Estudiantes',
                        icon: 'pi pi-fw pi-pencil',
                        routerLink: ['/usuario/crud']
                    },
                    {
                        label: 'Buscar',
                        icon: 'pi pi-fw pi-circle-off',
                        routerLink: ['/usuario/empty']
                    },
                ]
            },
            {
                label: 'MATRICULA',
                icon: 'pi pi-fw pi-briefcase',
                items: [
                    {
                        label: 'Administrar Estudiantes',
                        icon: 'pi pi-fw pi-pencil',
                        routerLink: ['/usuario/crud']
                    },
                    {
                        label: 'Buscar',
                        icon: 'pi pi-fw pi-circle-off',
                        routerLink: ['/usuario/empty']
                    },
                ]
            },
            {
                label: 'INSCRIPCIÓN',
                icon: 'pi pi-fw pi-briefcase',
                items: [
                    {
                        label: 'Administrar Estudiantes',
                        icon: 'pi pi-fw pi-pencil',
                        routerLink: ['/usuario/crud']
                    },
                    {
                        label: 'Buscar',
                        icon: 'pi pi-fw pi-circle-off',
                        routerLink: ['/usuario/empty']
                    },
                ]
            },
            {
                label: 'NIVEL',
                icon: 'pi pi-fw pi-briefcase',
                items: [
                    {
                        label: 'Administrar Estudiantes',
                        icon: 'pi pi-fw pi-pencil',
                        routerLink: ['/usuario/crud']
                    },
                    {
                        label: 'Buscar',
                        icon: 'pi pi-fw pi-circle-off',
                        routerLink: ['/usuario/empty']
                    },
                ]
            },
            {
                label: 'PAGOS',
                icon: 'pi pi-fw pi-briefcase',
                items: [
                    {
                        label: 'Administrar Estudiantes',
                        icon: 'pi pi-fw pi-pencil',
                        routerLink: ['/usuario/crud']
                    },
                    {
                        label: 'Buscar',
                        icon: 'pi pi-fw pi-circle-off',
                        routerLink: ['/usuario/empty']
                    },
                ]
            },
            {
                label: 'ASISTENCIA',
                icon: 'pi pi-fw pi-briefcase',
                items: [
                    {
                        label: 'Administrar Estudiantes',
                        icon: 'pi pi-fw pi-pencil',
                        routerLink: ['/usuario/crud']
                    },
                    {
                        label: 'Buscar',
                        icon: 'pi pi-fw pi-circle-off',
                        routerLink: ['/usuario/empty']
                    },
                ]
            },
            {
                label: 'NOTA',
                icon: 'pi pi-fw pi-briefcase',
                items: [
                    {
                        label: 'Administrar Estudiantes',
                        icon: 'pi pi-fw pi-pencil',
                        routerLink: ['/usuario/crud']
                    },
                    {
                        label: 'Buscar',
                        icon: 'pi pi-fw pi-circle-off',
                        routerLink: ['/usuario/empty']
                    },
                ]
            },
            {
                label: 'NOTIFICACIONES',
                icon: 'pi pi-fw pi-briefcase',
                items: [
                    {
                        label: 'Administrar Estudiantes',
                        icon: 'pi pi-fw pi-pencil',
                        routerLink: ['/usuario/crud']
                    },
                    {
                        label: 'Buscar',
                        icon: 'pi pi-fw pi-circle-off',
                        routerLink: ['/usuario/empty']
                    },
                ]
            }, */

            /*{
                label: 'Home',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }
                ]
            },
            {
                label: 'UI Components',
                items: [
                    { label: 'Form Layout', icon: 'pi pi-fw pi-id-card', routerLink: ['/uikit/formlayout'] },
                    { label: 'Input', icon: 'pi pi-fw pi-check-square', routerLink: ['/uikit/input'] },
                    { label: 'Float Label', icon: 'pi pi-fw pi-bookmark', routerLink: ['/uikit/floatlabel'] },
                    { label: 'Invalid State', icon: 'pi pi-fw pi-exclamation-circle', routerLink: ['/uikit/invalidstate'] },
                    { label: 'Button', icon: 'pi pi-fw pi-box', routerLink: ['/uikit/button'] },
                    { label: 'Table', icon: 'pi pi-fw pi-table', routerLink: ['/uikit/table'] },
                    { label: 'List', icon: 'pi pi-fw pi-list', routerLink: ['/uikit/list'] },
                    { label: 'Tree', icon: 'pi pi-fw pi-share-alt', routerLink: ['/uikit/tree'] },
                    { label: 'Panel', icon: 'pi pi-fw pi-tablet', routerLink: ['/uikit/panel'] },
                    { label: 'Overlay', icon: 'pi pi-fw pi-clone', routerLink: ['/uikit/overlay'] },
                    { label: 'Media', icon: 'pi pi-fw pi-image', routerLink: ['/uikit/media'] },
                    { label: 'Menu', icon: 'pi pi-fw pi-bars', routerLink: ['/uikit/menu'], routerLinkActiveOptions: { paths: 'subset', queryParams: 'ignored', matrixParams: 'ignored', fragment: 'ignored' } },
                    { label: 'Message', icon: 'pi pi-fw pi-comment', routerLink: ['/uikit/message'] },
                    { label: 'File', icon: 'pi pi-fw pi-file', routerLink: ['/uikit/file'] },
                    { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/uikit/charts'] },
                    { label: 'Misc', icon: 'pi pi-fw pi-circle', routerLink: ['/uikit/misc'] }
                ]
            },
            {
                label: 'Prime Blocks',
                items: [
                    { label: 'Free Blocks', icon: 'pi pi-fw pi-eye', routerLink: ['/blocks'], badge: 'NEW' },
                    { label: 'All Blocks', icon: 'pi pi-fw pi-globe', url: ['https://www.primefaces.org/primeblocks-ng'], target: '_blank' },
                ]
            },
            {
                label: 'Utilities',
                items: [
                    { label: 'PrimeIcons', icon: 'pi pi-fw pi-prime', routerLink: ['/utilities/icons'] },
                    { label: 'PrimeFlex', icon: 'pi pi-fw pi-desktop', url: ['https://www.primefaces.org/primeflex/'], target: '_blank' },
                ]
            },*/ /*
            {
                label: 'Pages',
                icon: 'pi pi-fw pi-briefcase',
                items: [
                    {
                        label: 'Landing',
                        icon: 'pi pi-fw pi-globe',
                        routerLink: ['/landing']
                    },
                    {
                        label: 'Auth',
                        icon: 'pi pi-fw pi-user',
                        items: [
                            {
                                label: 'Login',
                                icon: 'pi pi-fw pi-sign-in',
                                routerLink: ['/auth/login']
                            },
                            {
                                label: 'Error',
                                icon: 'pi pi-fw pi-times-circle',
                                routerLink: ['/auth/error']
                            },
                            {
                                label: 'Access Denied',
                                icon: 'pi pi-fw pi-lock',
                                routerLink: ['/auth/access']
                            }
                        ]
                    },
                    {
                        label: 'Crud',
                        icon: 'pi pi-fw pi-pencil',
                        routerLink: ['/pages/crud']
                    },
                    {
                        label: 'Timeline',
                        icon: 'pi pi-fw pi-calendar',
                        routerLink: ['/pages/timeline']
                    },
                    {
                        label: 'Not Found',
                        icon: 'pi pi-fw pi-exclamation-circle',
                        routerLink: ['/notfound']
                    },
                    {
                        label: 'Empty',
                        icon: 'pi pi-fw pi-circle-off',
                        routerLink: ['/pages/empty']
                    },
                ]
            },*/ /*
            {
                label: 'Hierarchy',
                items: [
                    {
                        label: 'Submenu 1', icon: 'pi pi-fw pi-bookmark',
                        items: [
                            {
                                label: 'Submenu 1.1', icon: 'pi pi-fw pi-bookmark',
                                items: [
                                    { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
                                    { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
                                    { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' },
                                ]
                            },
                            {
                                label: 'Submenu 1.2', icon: 'pi pi-fw pi-bookmark',
                                items: [
                                    { label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' }
                                ]
                            },
                        ]
                    },
                    {
                        label: 'Submenu 2', icon: 'pi pi-fw pi-bookmark',
                        items: [
                            {
                                label: 'Submenu 2.1', icon: 'pi pi-fw pi-bookmark',
                                items: [
                                    { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
                                    { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' },
                                ]
                            },
                            {
                                label: 'Submenu 2.2', icon: 'pi pi-fw pi-bookmark',
                                items: [
                                    { label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' },
                                ]
                            },
                        ]
                    }
                ]
            },/*
            {
                label: 'Get Started',
                items: [
                    {
                        label: 'Documentation', icon: 'pi pi-fw pi-question', routerLink: ['/documentation']
                    },
                    {
                        label: 'View Source', icon: 'pi pi-fw pi-search', url: ['https://github.com/primefaces/sakai-ng'], target: '_blank'
                    }
                ]
            }*/
        ];
    }
}
