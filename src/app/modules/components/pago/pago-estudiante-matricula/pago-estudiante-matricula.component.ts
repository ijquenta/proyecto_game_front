// Importaciones de Angular
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

// Importaciones de PrimeNG
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { AutoComplete } from 'primeng/autocomplete';
import { Table } from 'primeng/table';
import { DialogService } from 'primeng/dynamicdialog';

// Importaciones de servicios
import { ReporteService } from 'src/app/modules/service/data/reporte.service';
import { NotaService } from 'src/app/modules/service/data/nota.service';
import { PagoService } from 'src/app/modules/service/data/pago.service';
import { AuthService } from 'src/app/modules/service/core/auth.service';
import { MatriculaService } from 'src/app/modules/service/data/matricula.service';

// Importaciones de modelos
import { Nota } from 'src/app/modules/models/nota';
import { Inscripcion } from 'src/app/modules/models/inscripcion';
import { Usuario } from 'src/app/modules/models/usuario';
import { Pago } from 'src/app/modules/models/pago';

@Component({
    templateUrl: './pago-estudiante-matricula.component.html',
    styleUrls: ['./pago-estudiante-matricula.component.scss'],
})
export class PagoEstudianteMatriculaComponent implements OnInit {
    // ViewChilds
    @ViewChild('dtexc') dtexc: Table | undefined;
    @ViewChild('autocomplete') autocomplete: AutoComplete | undefined;

    // Variables de control
    criterio: any = '';
    loading: boolean = false;
    loading2: boolean = false;
    verPagosClicked: boolean = false;
    verMateriaClicked: boolean = false;
    sortOrder: number = 0;
    sortField: string = '';
    errors: any;

    // Listas de datos
    listarMateriasInscritas: any[] = [];
    listarMateriasInscritasPagado: any[] = [];
    listarMateriasInscritasSinPagar: any[] = [];
    listarNotaEstudianteMateria: any;

    // Modelos
    notaEstudiante = new Inscripcion();
    notaEstudianteMateria = new Nota();
    usuario: Usuario;

    // Menú
    items: MenuItem[];
    home: MenuItem | undefined;
    showArchivoImagen: boolean;
    pagarchivo: any;

    constructor(
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private dialogService: DialogService,
        private reporteService: ReporteService,
        private notaService: NotaService,
        private authService: AuthService,
        private pagoService: PagoService,
        private matriculaService: MatriculaService
    ) {
        this.items = [
            { label: 'Pagos' },
            { label: 'Mis Matriculas', routerLink: '' },
        ];

        this.home = { icon: 'pi pi-home', routerLink: '/principal' };
    }
    ngOnInit(): void {
        this.verMateriaClicked = true;
        this.authService.usuario$.subscribe((user) => {
            if (user && Array.isArray(user) && user.length > 0) {
                this.usuario = user[0];
                this.matriculaService.listarMatriculaEstudiante(this.usuario.perid).subscribe(
                    (result: any) => {
                        this.listarMateriasInscritas = result['data'] as any[];

                        // Filtrar los cursos que tienen pagestado en 0 o null
                        this.listarMateriasInscritasSinPagar =
                            this.listarMateriasInscritas.filter(
                                (materia) =>
                                    materia.pagestado === 0 ||
                                    materia.pagestado === null
                            );

                        this.listarMateriasInscritasPagado =
                            this.listarMateriasInscritas.filter(
                                (materia) => materia.pagestado >= 1
                            );
                    },
                    (error) => {
                        this.errors = error;
                        console.error('error', error);
                        this.messageService.add({
                            severity: 'warn',
                            summary: 'Error',
                            detail: 'Algo salió mal!',
                        });
                    }
                );
            }
        });
    }

    listarPagoMateria(data: any) {
        this.verPagosClicked = true;
        // Asignar el array de datos
        this.listarNotaEstudianteMateria = Array.isArray(data) ? data : [data];
    }

    getSeverityColor(pagestado: number): string {
        switch (pagestado) {
            case 1:
                return 'primary'; // Color para pagado
            case 2:
                return 'warning'; // Color para pendiente
            case 3:
                return 'danger'; // Color para sin pagar
            default:
                return 'info'; // Puedes ajustar este valor por defecto según tus necesidades
        }
    }
    getText(pagestado: number): string {
        switch (pagestado) {
            case 1:
                return 'Pagado'; // Color para pagado
            case 2:
                return 'Falta Pagar'; // Color para pendiente
            case 3:
                return 'Pendiente'; // Color para sin pagar
            default:
                return 'Sin pagar'; // Puedes ajustar este valor por defecto según tus necesidades
        }
    }

    mostrarPagoArchivo(filename: any) {
        // this.pagoService.getFilePago(pagarchivo);
        if (this.isImagen(filename)) {
        }
        if (this.isPdf(filename)) {
            this.pagoService.getPagoArchivo(filename);
        }
    }

    /**
     *
     * @param filename nombre del archivo
     * @returns retorna si el archivo es una imagen o no.
     */
    isImagen(filename: string): boolean {
        const ext = filename.split('.').pop().toLowerCase();
        return ['jpg', 'jpeg', 'png', 'gif'].includes(ext);
    }

    /**
     *
     * @param filename nombre del archivo
     * @returns retorna si el archivo es un pdf o no.
     */
    isPdf(filename: string): boolean {
        const ext = filename.split('.').pop().toLowerCase();
        return ext === 'pdf';
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
                return 'Terminada';
            case 3:
                return 'Suspendida';
            default:
                return 'Ninguno';
        }
    }

    // Método de busqueda en la tabla
    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }

    getInitials(name: string): string {
        if (!name) return '';
        return name.charAt(0).toUpperCase();
    }

    rptPagos(){
        const criterio = {
            perid: this.usuario.perid,
            usuname: this.usuario.usuname
        }
        this.pagoService.rptPagoEstudianteMateria(criterio);
    }

    /**
     *
     * @param pagarchivo Mostrar el archivo imagen de pago
     */
    mostrarPagoArchivoImagen(pagarchivo: any){
        this.showArchivoImagen = true;
        this.pagarchivo = pagarchivo;
    }

    generarComprobantePagoMatricula(data: any){
        const matrid = Number(data['matrid']);
        const perid = Number(data['peridestudiante'])
        const criterio = {
            perid: perid,
            matrid: matrid,
            usuname: this.usuario.usuname
        }
        this.pagoService.generarComprobantePagoMatricula(criterio);
    }


}
