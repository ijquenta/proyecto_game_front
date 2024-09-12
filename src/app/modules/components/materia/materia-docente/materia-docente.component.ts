//----------------- Importaciones de servicios relacionados con la materia y estudiantes -------------------//
import { NgxSpinnerService } from 'ngx-spinner'; // Servicio de Spinner

//----------------- Importaciones de Angular y PrimeNG -------------------//
import { Component, OnInit } from '@angular/core'; // Componentes básicos de Angular
import { MenuItem, MessageService } from 'primeng/api'; // PrimeNG: para crear menú de navegación y mostrar mensajes
import { Table } from 'primeng/table'; // PrimeNG: tabla interactiva

//----------------- Importaciones relacionadas con diccionarios y modelos -------------------//
import { InscripcionRegistro } from 'src/app/modules/models/inscripcion'; // Modelo de Inscripción

//----------------- Importaciones de servicios relacionados con autenticación y usuarios -------------------//
import { DocenteService } from 'src/app/modules/service/data/docente.service'; // Servicio para manejar docentes
import { AuthService } from 'src/app/modules/service/core/auth.service'; // Servicio de autenticación
import { Usuario } from 'src/app/modules/models/usuario'; // Modelo de Usuario

//----------------- Importación del entorno -------------------//
import { environment } from 'src/environments/environment'; // Variables de entorno

@Component({
    selector: 'app-materia-docente',
    templateUrl: './materia-docente.component.html',
    styleUrls: ['../../../../app.component.css'],
})
export class MateriaDocenteComponent implements OnInit {
    //----------------- Variables de control de carga y estado -------------------//
    loading: boolean = false; // Indicador de carga general
    loading2: boolean = false; // Indicador de carga para otra operación
    verMateriaAsignadaClicked: boolean = false; // Bandera para verificar si se ha clickeado la opción de ver materias asignadas

    //----------------- Variables relacionadas con las materias -------------------//
    curmatid: any; // Identificador del curso materia
    listaMateriasInscritas: any = []; // Lista de materias inscritas por el estudiante
    listarMateriaEstudianteCurso: any[] = []; // Lista de materias asignadas a un curso para el estudiante

    //----------------- Variables para control de diálogos y eliminación -------------------//
    displayDelete: boolean = false; // Bandera para mostrar el diálogo de eliminación
    obsEliminar: string = ''; // Observación cuando se elimina una materia

    //----------------- Variables para manejo de errores -------------------//
    errors: any; // Almacena posibles errores en la ejecución

    //----------------- Variables relacionadas con inscripciones -------------------//
    inscripciones: InscripcionRegistro; // Información relacionada con la inscripción de materias

    //----------------- Variables de usuario y autenticación -------------------//
    usuario: Usuario; // Información del usuario actual
    isImageLoaded: boolean = true; // Indicador de si la imagen del perfil ha sido cargada
    userProfilePhoto = environment.API_URL_PROFILE_PHOTO; // URL de la imagen de perfil del usuario

    //----------------- Opciones de estado y menús -------------------//
    statusOptions = [
        // Opciones de estado para el menú
        { label: 'Activo', value: 1 },
        { label: 'Inactivo', value: 0 },
    ];
    items: MenuItem[]; // Items del menú de navegación
    home: MenuItem | undefined; // Item de la página principal
    matnombre: any;
    curnombre: any;
    curfchini: any;
    curmatfecini: any;
    curmatfecfin: any;

    constructor(
        private messageService: MessageService,
        private authService: AuthService,
        private docenteService: DocenteService,
        private spinner: NgxSpinnerService
    ) {
        this.items = [
            { label: 'Materia' },
            { label: 'Materias Asignadas', routerLink: '' },
        ];
        this.home = { icon: 'pi pi-home', routerLink: '/' };
    }

    ngOnInit(): void {
        this.spinner.show();
        this.authService.usuario$.subscribe((user) => {
            if (user) {
                if (Array.isArray(user) && user.length > 0) {
                    this.usuario = user[0];
                    this.docenteService
                        .obtenerMateriasAsignadas(this.usuario)
                        .subscribe({
                            next: (data) => {
                                this.spinner.hide();
                                this.inscripciones = data;
                            },
                            error: (error) => {
                                this.spinner.hide();
                                console.error('error', error);
                            },
                        });
                }
            }
        });
    }

    listarEstudianteMateria(data: any) {
        this.loading2 = true;
        this.verMateriaAsignadaClicked = true;
        this.curnombre = data.curnombre;
        this.matnombre = data.matnombre;
        this.curfchini = data.curfchini;
        this.curfchini = data.curfchfin;
        this.curmatfecini = data.curmatfecini;
        this.curmatfecfin = data.curmatefcfin;
        this.curmatid = data.curmatid;
        const criterio = {
            curmatid: data.curmatid,
        };
        this.listarEstudiantes(criterio);
    }

    listarEstudiantes(criterio: any) {
        this.docenteService.listarMateriaEstudianteCurso(criterio).subscribe({
            next: (result: any) => {
                this.listarMateriaEstudianteCurso = result as any[];
                this.loading2 = false;
            },
            error: (error) => {
                this.loading2 = false;
                this.errors = error;
                console.error('error', error);
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Error',
                    detail: 'Algo salio mal!',
                });
            }
        });
    }
    // Método de busqueda en la tabla
    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }

    verMateria() {
        this.verMateriaAsignadaClicked = true;
    }

    getInitials(name: string): string {
        if (!name) return '';
        return name.charAt(0).toUpperCase();
    }

    onImageError(): void {
        this.isImageLoaded = false;
    }

    onImageLoad(): void {
        this.isImageLoaded = true;
    }

    // Funciones para obtener el color de la barra de estado
    getSeverityStatus(estado: number): string {
        switch (estado) {
            case 1:
                return 'success';
            case 0:
                return 'danger';
            default:
                return 'info';
        }
    }

    getDescriptionStatus(estado: number): string {
        switch (estado) {
            case 1:
                return 'En curso';
            case 0:
                return 'Terminado';
            default:
                return 'Ninguno';
        }
    }

    getDescriptionStatusEstudiante(estado: number): string {
        switch (estado) {
            case 1:
                return 'Activo';
            case 0:
                return 'Inactivo';
            default:
                return 'Ninguno';
        }
    }

    enviarWhatsApp(celular: string, nombre: string) {
        // Eliminar cualquier espacio y caracteres no numéricos en el número
        const numero = celular.replace(/\D/g, '');
        const mensaje = `Hola ${nombre}, me gustaría ponerme en contacto contigo.`;
        const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
        window.open(url, '_blank');
    }
}
