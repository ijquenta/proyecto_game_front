import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Pago, TipoPago } from 'src/app/modules/models/pago';
import { Usuario } from 'src/app/modules/models/usuario';
import { PagoService } from 'src/app/modules/service/data/pago.service';
import { DataService } from 'src/app/modules/service/data/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-estudiante-materia',
  templateUrl: './estudiante-materia.component.html',
  styleUrls: ['./estudiante-materia.component.css']
})
export class EstudianteMateriaComponent implements OnInit {
  idEstudiante: number;
  nombreMateria: string;

    // Properties
    tipoPago: TipoPago[] = [];
    pagoForm: FormGroup;
    archivos: File[] = [];
    uploadedFiles: File[] = [];
    pagoData: Pago = new Pago();
    pago: Pago = new Pago();
    pagoRegistroDialog: boolean = false;
    errors: any;
    curid: any;
    matid: any;
    items: MenuItem[];
    home: MenuItem | undefined;


    listarPagoEstudianteMateria: Pago[] = [];
    usuario: any = {};
    verPagosEstudianteClicked: boolean;
    loading2: boolean;
    userProfilePhoto: string;
    curnombre: string;
    matnombre: string;


    // Map for pago types
    private tipoPagoMap: { [key: number]: { color: string, text: string } } = {
        1: { color: 'info', text: 'Ninguno' },
        2: { color: 'success', text: 'Efectivo' },
        3: { color: 'warning', text: 'Deposito Bancario' },
        4: { color: 'primary', text: 'Adelanto' },
        5: { color: 'danger', text: 'Otro' },
    };

    constructor(
        private messageService: MessageService,
        private formBuilder: FormBuilder,
        private pagoService: PagoService,
        private route: ActivatedRoute,
        private dataService: DataService,
        private router: Router,
    ) {

        this.items = [
            { label: 'Pago'},
            { label: 'Gestionar Pagos', routerLink:'/principal/pago/todos' },
            { label: 'Materia', routerLink:''},
        ];

        this.home = { icon: 'pi pi-home', routerLink: '/' };
    }

    /**
     * Método de inicialización del componente.
     * Configura el formulario y obtiene los tipos de pago.
     */

    ngOnInit(): void {
        this.initf();
        this.initializeForm();
        this.listarTipoPagoCombo();
    }

    initf(){
        this.dataService.currentData.subscribe(data => {

            console.log("data rec:", data)
            if (data) {
              this.listarPagoEstudianteMateria = data.listarPagoEstudianteMateria;
              this.usuario = data.usuario;
              this.verPagosEstudianteClicked = data.verPagosEstudianteClicked;
              this.loading2 = data.loading2;
              this.userProfilePhoto = data.userProfilePhoto;
              this.curnombre = data.curnombre;
              this.matnombre = data.matnombre;
            }
          });
        }

    /**
     * Inicializa el formulario de pagos.
     */
    private initializeForm(): void {
        this.pagoForm = this.formBuilder.group({
            // Define your form controls and validators here
        });
    }

    /**
     * Obtiene los tipos de pago disponibles desde el servicio.
     */
    listarTipoPagoCombo(): void {
        this.pagoService.getTipoPago().subscribe({
            next: (result: TipoPago[]) => {
                this.tipoPago = result;
            },
            error: (error: any) => {
                console.log("Error al obtener los tipos de pago:", error);
                this.messageService.add({ severity: 'warn', summary: '¡Error!', detail: 'No se pudieron obtener los tipos de pago' });
            }
        });
    }

    /**
     * Abre el diálogo para crear un nuevo pago.
     * @param data Datos del pago.
     */
    nuevoPago(data: any): void {
        console.log("Crear pago:", data);
        this.pago = { ...data };
        this.pagoRegistroDialog = true;
        // this.router.navigate(['/pago/form']);

        this.router.navigate(['/principal/pago/form']);

    }

    /**
     * Abre el diálogo para actualizar un pago existente.
     * @param data Datos del pago a actualizar.
     */
    actualizarPago(data: Pago): void {
        console.log("Actualizar pago:", data);
        this.pago = { ...data };
        this.pagoRegistroDialog = true;
    }

    /**
     * Obtiene el color de severidad basado en el tipo de pago.
     * @param pagtipo Tipo de pago.
     * @returns Color asociado al tipo de pago.
     */
    getSeverityColor(pagtipo: number): string {
        return this.tipoPagoMap[pagtipo]?.color || 'info';
    }

    /**
     * Obtiene el texto descriptivo basado en el tipo de pago.
     * @param pagtipo Tipo de pago.
     * @returns Texto descriptivo del tipo de pago.
     */
    getText(pagtipo: number): string {
        return this.tipoPagoMap[pagtipo]?.text || 'Otro';
    }

    /**
     * Filtra globalmente los datos en la tabla.
     * @param table Instancia de la tabla.
     * @param event Evento del filtro.
     */
    onGlobalFilter(table: Table, event: Event): void {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    /**
     * Maneja el evento de guardar un pago.
     * @param pago Datos del pago a guardar.
     */
    handleGuardarPago(pago: any): void {
        this.pagoService.gestionarPago(pago).subscribe({
            next: () => {
                this.pagoRegistroDialog = false;
                this.messageService.add({ severity: 'info', summary: 'Exitoso', detail: 'Pago registrado correctamente.', life: 1000 });
                this.listarMateriasPorCurso({ curid: this.curid, matid: this.matid }); // Actualiza la lista después de guardar
            },
            error: (error: any) => {
                this.errors = error;
                console.log("Error al guardar el pago:", error);
                this.messageService.add({ severity: 'warn', summary: '¡Error!', detail: 'Ha ocurrido un error' });
            }
        });
    }

    /**
     * Obtiene la lista de pagos y estudiantes por curso.
     * @param data Datos del curso.
     */
    listarMateriasPorCurso(data: any): void {
        this.loading2 = true;
        this.pagoService.listarPagoEstudiantesMateria(data).subscribe({
            next: (result: Pago[]) => {
                this.listarPagoEstudianteMateria = result;
                console.log("Lista de pagos y estudiantes por materia:", this.listarPagoEstudianteMateria);
                this.loading2 = false;
                this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Información obtenida.', life: 1000 });
            },
            error: (error: any) => {
                this.errors = error;
                this.loading2 = false;
                console.log("Error al listar pagos y estudiantes:", error);
                this.messageService.add({ severity: 'warn', summary: '¡Error!', detail: 'Ha ocurrido un error' });
            }
        });
    }

    /**
     * Registra un nuevo pago si el formulario es válido.
     * @param event Evento del formulario.
     */
    registrarPago(event: any): void {
        if (this.pagoForm.valid) {
            this.handleGuardarPago(this.pagoForm.value);
        } else {
            this.messageService.add({ severity: 'warn', summary: 'Formulario inválido', detail: 'Por favor, complete todos los campos requeridos.' });
        }
    }

    /**
     * Oculta el diálogo de registro de pago y reinicia el formulario.
     */
    ocultarDialog(): void {
        console.log('Dialog ocultado');
        this.pagoRegistroDialog = false;
        // this.verPagosEstudianteClicked = false;
        this.pagoForm.reset();
        this.pago = new Pago();
    }
}

