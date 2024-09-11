import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { AutoComplete } from 'primeng/autocomplete';
import { Table } from 'primeng/table';
import { DialogService } from 'primeng/dynamicdialog';
import { ReporteService } from 'src/app/modules/service/data/reporte.service';

import { NotaService } from 'src/app/modules/service/data/nota.service';
import { AuthService } from 'src/app/modules/service/core/auth.service';
import { Nota } from 'src/app/modules/models/nota';
import { Inscripcion } from 'src/app/modules/models/inscripcion';
import { Usuario } from 'src/app/modules/models/usuario';
import { Pago } from 'src/app/modules/models/pago';
import { PagoService } from 'src/app/modules/service/data/pago.service';
import { environment } from 'src/environments/environment';
@Component({
    templateUrl: './pago-estudiante.component.html',
    styleUrls: ['./pago-estudiante.component.scss'],
})
export class PagoEstudianteComponent implements OnInit {
    @ViewChild('dtexc') dtexc: Table | undefined;
    @ViewChild('autocomplete') autocomplete: AutoComplete | undefined;

    criterio: any = '';
    loading: boolean = false;
    loading2: boolean = false;
    listarMateriasInscritas: any[] = [];
    listarMateriasInscritasPagado: any[] = [];
    listarMateriasInscritasSinPagar: any[] = [];
    listarNotaEstudianteMateria: Pago[] = [];
    notaEstudiante = new Inscripcion();
    notaEstudianteMateria = new Nota();
    verPagosClicked: boolean = false;
    errors: any;
    usuario: Usuario;
    verMateriaClicked: boolean = false;
    sortOrder: number = 0;
    sortField: string = '';
    items: MenuItem[];
    home: MenuItem | undefined;
    pagarchivo: any;
    showArchivoImagen: boolean;
    apiUrlPagoArchivo: string = environment.API_URL_PAGO_ARCHIVO;
    constructor(
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private dialogService: DialogService,
        private reporteService: ReporteService,
        private notaService: NotaService,
        private authService: AuthService,
        private pagoService: PagoService
    ) {
        this.items = [
            { label: 'Pagos' },
            { label: 'Mis Pagos', routerLink: '' },
        ];

        this.home = { icon: 'pi pi-home', routerLink: '/principal' };
    }
    ngOnInit(): void {
        this.verMateriaClicked = true;
        this.authService.usuario$.subscribe((user) => {
            if (user && Array.isArray(user) && user.length > 0) {
                this.usuario = user[0];
                const criterio = {
                    perid: this.usuario.perid,
                };
                this.pagoService.listarPagoEstudiante(criterio).subscribe(
                    (result: any) => {
                        this.listarMateriasInscritas = result as Inscripcion[];

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
                        console.log(this.listarMateriasInscritasSinPagar);
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
        this.loading2 = true;
        this.verPagosClicked = true;
        const criterio = {
            perid: data.peridestudiante,
            curid: data.curid,
            matid: data.matid,
        };
        console.log('criterio', criterio);
        this.pagoService.listarPagoEstudianteMateria(criterio).subscribe(
            (result: any) => {
                this.listarNotaEstudianteMateria = result as Pago[];
                console.log(this.listarNotaEstudianteMateria);
                this.loading2 = false;
                //   this.messageService.add({severity:'info', summary:'Correcto', detail:'Información obtenida'});
            },
            (error) => {
                this.loading2 = false;
                this.errors = error;
                console.error('error', error);
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Error',
                    detail: 'Algo salio mal!',
                });
            }
        );
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
     * @param pagarchivo Mostrar el archivo imagen de pago
     */
     mostrarPagoArchivoImagen(pagarchivo: any){
        this.showArchivoImagen = true;
        this.pagarchivo = pagarchivo;
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

    generarComprobantePagoEstudiante(data: any){
        const insid = Number(data.insid);
        const perid = Number(data.peridestudiante)
        const criterio = {
            perid: perid,
            insid: insid,
            usuname: this.usuario.usuname
        }
        this.pagoService.generarComprobantePagoEstudiante(criterio);
    }


}
