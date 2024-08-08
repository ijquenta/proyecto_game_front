import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { MenuItem, MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';


import { Pago, TipoPago } from 'src/app/modules/models/pago';
import { Usuario } from 'src/app/modules/models/usuario';

import { PagoService } from 'src/app/modules/service/data/pago.service';
import { AuthService } from 'src/app/modules/service/core/auth.service';

@Component({
    selector: 'app-form-pago',
    templateUrl: './form-pago.component.html',
    styleUrls: ['./form-pago.component.css']
})

export class FormPagoComponent implements OnInit {
    @ViewChild('fileUploadPago') fileUploadPago: FileUpload;

    /** Formulario reactivo para gestionar los datos del pago */
    pagoForm: FormGroup;

    /** Lista de tipos de pago disponibles */
    tipoPago: TipoPago[] = [];

    /** Modelo de datos para el pago actual */
    pago: Pago = new Pago();

    /** Modelo de datos para el usuario actual */
    usuario: Usuario = new Usuario();

    /** Indica si el formulario está en modo de edición */
    isEditMode: boolean = false;

    /** Lista de archivos seleccionados para subir */
    archivos: File[] = [];

    /** Elementos para la navegación de migas de pan (breadcrumb) */
    items: MenuItem[];

    /** Elemento de inicio para la navegación de migas de pan (breadcrumb) */
    home: MenuItem | undefined;

    /** Variables para recuperar los datos de pago */
    curid: number = 0;
    matid: number = 0;
    pagid: number = 0;

    /** Variables para el manejo de archivos */
    pagoFile: File | null = null;
    pagoFileUrl: string | null = null;
    fileObjectUrlPago: any;
    uploadProgress: number = 0;

    /** Variables para el manejo de estado */
    statusOptions = [
        { label: 'Activo', value: 1 },
        { label: 'Inactivo', value: 0 },
    ];

    insid: number;

    stateOptionsEstado: any[] = [
        { label: 'Activo', value: 1 },
        { label: 'Inactivo', value: 0 }
    ];

    /**
     * Constructor del componente.
     *
     * @param fb - FormBuilder para crear el formulario reactivo.
     * @param messageService - Servicio para mostrar mensajes de éxito o error.
     * @param pagoService - Servicio para gestionar operaciones relacionadas con pagos.
     * @param router - Router para la navegación.
     * @param route - ActivatedRoute para manejar rutas dinámicas.
     * @param cdr - ChangeDetectorRef para actualizar la vista.
     */
    constructor(
        private fb: FormBuilder,
        private messageService: MessageService,
        private pagoService: PagoService,
        private router: Router,
        private route: ActivatedRoute,
        private cdr: ChangeDetectorRef,
        private authService: AuthService
    ) {
        this.items = [
            { label: 'Pago' },
            { label: 'Gestionar Pagos', routerLink: '/principal/pago/todos' },
            { label: 'Materia', routerLink: '/principal/pago/estudiante-materia' },
            { label: 'Formulario de pago', routerLink: '/principal/pago/form' },
        ];
        this.home = { icon: 'pi pi-home', routerLink: '/' };
    }

    /**
     * Método de ciclo de vida de Angular que se ejecuta al inicializar el componente.
     */
    ngOnInit(): void {
        this.listarTipoPagoCombo(); // Obtener los datos para tipo pago
        this.initializeForm(); // Inicializar formulario.
        this.getDataEstudianteMateria(); // Obtener datos de la tabla de estudiante materia.
        this.getUsuario();
    }

    /**
     * Obtiene el perfil del usuario desde el servicio de autenticación.
     */
    private getUsuario(): void {
        this.authService.getProfile().subscribe({
            next: (usuario: Usuario[]) => {
                this.usuario = usuario[0];
            },
            error: (error: any) => {
                console.error('Error al obtener el perfil del usuario', error);
            },
        });
    }

    /**
     * Inicializa el formulario reactivo con sus validaciones.
     */
        private initializeForm(): void {
            this.pagoForm = this.fb.group({
                pagid: [''],
                insid: [''],
                pagdescripcion: ['', Validators.required],
                pagfecha: ['', Validators.required],
                pagmonto: [0, [Validators.required, Validators.min(0)]],
                tipoPago: ['', Validators.required],
                pagestadodescripcion: [''],
                pagarchivo: ['', Validators.required],
                pagestado: ['', Validators.required]
            });
        }

    /**
     * Lista los tipos de pago disponibles para el dropdown.
     */
    private listarTipoPagoCombo(): void {
        this.pagoService.getTipoPago().subscribe({
            next: (result: TipoPago[]) => {
                this.tipoPago = result;
            },
            error: (error: any) => {
                console.error("error al obtener los tipos de pago:", error);
                this.messageService.add({ severity: 'warn', summary: '¡Error!', detail: 'No se pudieron obtener los tipos de pago' });
            }
        });
    }

    /**
     * Identifica los datos del estudiante y materia en caso de estar en modo edición.
     */
    private getDataEstudianteMateria(): void {
        this.route.queryParams.subscribe(params => {
            this.curid = Number(params['curid']) || 0;
            this.matid = Number(params['matid']) || 0;
            this.pagid = Number(params['pagid']) || 0;
            this.insid = Number(params['insid']) || 0;
            if (this.pagid === 0) {
                this.isEditMode = false;
                // this.pagoForm.patchValue({ pagfecha: new Date() });
            }
            if(this.pagid > 0){
                this.isEditMode = true;
                this.loadPagoData(this.pagid);
            }
        });
    }

    /**
     * Carga los datos de un pago específico si se está en modo edición.
     *
     * @param pagid - ID del pago a cargar.
     */
    private loadPagoData(pagid: number): void {
        this.pagoService.getPagoById(pagid).subscribe({
            next: (result: Pago) => {
                this.pago = result['data'];
                this.pagoForm.patchValue({
                    pagid: this.pago.pagid,
                    insid: this.pago.insid,
                    pagdescripcion: this.pago.pagdescripcion,
                    pagfecha: this.pago.pagfecha,
                    pagmonto: this.pago.pagmonto,
                    pagestado: this.pago.pagestado,
                    pagarchivo: this.pago.pagarchivo,
                    tipoPago: new TipoPago(this.pago.pagtipo, this.tipoPago.find(tp => tp.tpagid === this.pago.pagtipo)?.tpagnombre || '')
                });
            },
            error: (error: any) => {
                console.error("error al obtener los datos del pago:", error);
                this.messageService.add({ severity: 'warn', summary: '¡Error!', detail: 'No se pudieron cargar los datos del pago' });
            }
        });
    }

    /**
     * Guarda los datos del pago, ya sea creando un nuevo registro o actualizando uno existente.
     * Verifica que el formulario sea válido y maneja la fecha y el archivo adjunto.
     */
    guardarPago(): void {
        // Si hay un archivo seleccionado, establece su nombre en el formulario
        if (this.pagoFile) {
            this.pagoForm.patchValue({ pagarchivo: this.pagoFile?.name });
        }
        if (this.pagoForm.value.pagmonto) {
            this.pagoForm.controls['pagmonto'].markAsTouched();  // Marca el control específico como tocado
        }
        // Verifica si el formulario es válido
        if (this.pagoForm.invalid) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error en el registro de pago',
                detail: 'Por favor, completa todos los campos obligatorios e intenta nuevamente.',
                life: 5000
            });
            // Marca todos los controles como tocados y sucios para mostrar errores
            Object.values(this.pagoForm.controls).forEach(control => {
                control.markAllAsTouched();
                control.markAsDirty();
            });
            return;
        }

        // Formateo de la fecha si está presente
        if (this.pagoForm.value.pagfecha) {
            const fecha = new Date(this.pagoForm.value.pagfecha);
            const fechaFormateada = fecha.toISOString().split('T')[0];
            this.pagoForm.patchValue({ pagfecha: fechaFormateada });
        }

        // Crear un FormData para enviar los datos al backend
        const pagoData: FormData = new FormData();
        pagoData.append('tipo', this.isEditMode ? '2' : '1'); // Tipo fijo según el modo de edición
        pagoData.append('insid', String(this.insid));
        pagoData.append('pagdescripcion', this.pagoForm.value.pagdescripcion);
        pagoData.append('pagtipo', this.pagoForm.value.tipoPago.tpagid);
        pagoData.append('pagmonto', this.pagoForm.value.pagmonto);
        pagoData.append('pagfecha', this.pagoForm.value.pagfecha);
        pagoData.append('pagarchivo', this.pagoFile);
        pagoData.append('pagestado', this.pagoForm.value.pagestado);
        // Configuración específica para la creación de un nuevo pago
        let mensajeDetalle = ''; // Variable para el detalle del mensaje

        if (!this.isEditMode) {
            pagoData.append('pagid', '0'); // ID 0 para indicar creación
            pagoData.append('pagusureg', this.usuario.usuname); // Usuario que registra
            mensajeDetalle = 'El pago fue creado correctamente.'; // Mensaje para creación
        }

        // Configuración específica para la actualización de un pago existente
        if (this.isEditMode) {
            pagoData.append('pagid', this.pagoForm.value.pagid); // ID del pago a actualizar
            pagoData.append('pagusumod', this.usuario.usuname); // Usuario que modifica
            mensajeDetalle = 'El pago fue actualizado correctamente.'; // Mensaje para actualización
        }

        // Llamada al servicio para gestionar el pago (crear o actualizar)
        this.pagoService.gestionarPago(pagoData).subscribe({
            next: (result: any) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: mensajeDetalle // Utiliza la variable con el mensaje adecuado
                });
                this.router.navigate(['/principal/pago/estudiante-materia'], {
                    queryParams:    { curid: this.curid, matid: this.matid }
                });
            },
            error: (error: any) => {
                console.error("error al gestionar el pago:", error);
                this.messageService.add({
                    severity: 'warn',
                    summary: '¡Error!',
                    detail: 'No se pudo gestionar el pago.'
                });
            }
        });
    }



    /**
     * Cancela la operación actual y redirige a la lista de pagos.
     */
    cancelar(): void {
        this.router.navigate(['/principal/pago/estudiante-materia'], { queryParams: { curid: this.curid, matid: this.matid } });
    }

    /**
     * Verifica si el tipo de archivo es una imagen.
     *
     * @param fileType - Tipo MIME del archivo.
     * @returns True si el archivo es una imagen, de lo contrario, false.
     */
    isImage(fileType: string): boolean {
        return fileType.startsWith('image/');
    }

    /**
     * Verifica si el tipo de archivo es un PDF.
     *
     * @param fileType - Tipo MIME del archivo.
     * @returns True si el archivo es un PDF, de lo contrario, false.
     */
    isPDF(fileType: string): boolean {
        return fileType === 'application/pdf';
    }


     /**
     * Maneja el evento de selección de archivos.
     *
     * @param event - Evento de selección de archivos.
     */
     onFileSelect(event: any): void {
        this.pagoFile = event.files[0];
        // this.pagoFileUrl = URL.createObjectURL(this.pagoFile);
        this.uploadProgress = 0; // Reiniciar la barra de progreso

        this.messageService.add({ severity: 'info', summary: 'Archivo', detail: 'Archivo seleccionado correctamente.' });
    }

    /**
     * Maneja el evento de carga de archivos para el archivo de pago.
     *
     * @param event - Evento de carga de archivos.
     */
    onUploadPago(event: any): void {
        if (this.pagoFile) {
            let progressInterval = setInterval(() => {
                this.uploadProgress += Math.floor(Math.random() * 20) + 10;

                if (this.uploadProgress >= 100) {
                    this.uploadProgress = 100;
                    clearInterval(progressInterval);
                    this.messageService.add({ severity: 'info', summary: 'Éxito', detail: 'Archivo cargado correctamente.' });
                    this.pagoFileUrl = URL.createObjectURL(this.pagoFile);
                    this.pagoForm.patchValue({ pagarchivo: this.pagoFile.name });
                    const pagarchivoControl = this.pagoForm.get('pagarchivo');
                    if (pagarchivoControl) {
                        pagarchivoControl.markAsTouched();
                        pagarchivoControl.markAsDirty();
                    }
                }

                this.cdr.detectChanges();
            }, 500);
        }
    }

    /**
     * Limpia los archivos seleccionados para subir.
     */
    clearFilespagarchivo(): void {
        this.cdr.detectChanges();

        // if (this.fileUploadPago) {
            // this.fileUploadPago.clear();
            this.pagoFile = null;
            this.pagoFileUrl = null;
            this.uploadProgress = 0;
            this.messageService.add({ severity: 'info', summary: 'Archivo', detail: 'Selección de archivo limpiada.' });
        // } else {
            // console.error('fileUploadPago is not initialized or is not available.');
        // }
    }


}
