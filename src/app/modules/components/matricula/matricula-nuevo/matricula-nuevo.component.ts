// --------- Importación principal
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { MenuItem, MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner'; // spinner
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // validaciones
import logoIbciBase64 from '../../../../../assets/base64/logo_ibci_base64.js';
// import { UploadEvent} from 'src/app/modules/models/upload.js';
import { environment } from 'src/environments/environment';
import { switchMap } from 'rxjs/operators';
import { FileUpload } from 'primeng/fileupload';
import { Injectable } from '@angular/core';
// --------- Importación servicios
import { AuthService } from 'src/app/modules/service/core/auth.service';
import { MatriculaService } from 'src/app/modules/service/data/matricula.service';
import { PagoService } from 'src/app/modules/service/data/pago.service';
import { UploadService } from 'src/app/modules/service/data/upload.service';
// --------- Importación modelos
import { Matricula, TiposMatricula, TipoPersonaEstudiante } from 'src/app/modules/models/matricula';
import { Usuario } from 'src/app/modules/models/usuario';
import { ExportColumn, Column } from 'src/app/modules/models/exportFile';
import { Pago, TipoPago } from 'src/app/modules/models/pago';

interface UploadEvent {
    originalEvent: Event;
    files: File[];
}

@Injectable({
    providedIn: 'root',
})

@Component({
    templateUrl: './matricula-nuevo.component.html',
    providers: [MessageService],
    styleUrls: ['../../../../app.component.css']
})

export class MatriculaNuevoComponent implements OnInit {
        @ViewChild('fileUpload') fileUpload: FileUpload;
        // Variables Matricula
        listaMatricula: Matricula[] = [];
        listaMatriculaInactivo: Matricula[] = [];
        listaMatriculaDuplicado: Matricula[] = [];
        matriculaDialog: boolean = false;
        opcionMatricula: boolean = false;
        activarMatriculaDialog: boolean = false;
        desactivarMatriculaDialog: boolean = false;
        matricula = new Matricula();
        loading: boolean = false;
        userProfilePhoto = environment.API_URL_PROFILE_PHOTO;
        userProfilePhotoEmpty = "../../../../../assets/images/login/sin_foto_perfil.png";
        apiUrlPagoArchivo: string = environment.API_URL_PAGO_ARCHIVO;
        tiposMatricula: TiposMatricula[] = [];
        tipoPersonaEstudiante: TipoPersonaEstudiante[] = [];
        pagoMatriculaDialog: boolean = false;

        // Variables ValidacionMatricula
        matriculaForm: FormGroup;
        pagoForm: FormGroup;
        // Usuario
        usuario: Usuario;
        // Variables para exportar PDF
        colsTable!: Column[];
        exportColumns!: ExportColumn[];
        // --------- Variables for Dataview ---------
        sortOrder: number = 0;
        sortField: string = '';
        filteredUsuarios: any[] = [];
        searchText: string = '';
        items: MenuItem[];
        // Variable pago
        tipoPago: TipoPago[] = [];
        pago = new Pago();
        pagidlast: any;
        // Variable para archivos
        archivos: any = {};
        uploadedFiles: any[] = [];
        nombreArchivo: any;
        loadingSpinner: boolean = false;

        items2: MenuItem[];
        home: MenuItem | undefined;

        stateOptionsEstado: any[] = [
            { label: 'Activo', value: 1 },
            { label: 'Inactivo', value: 0 }
        ];

      //-----------------Variables-------------------//

        pagoFile: File | null = null;
        pagoFileUrl: string | null = null;
        fileObjectUrlPago: any;
        uploadProgress: number = 0;

        /** Indica si el formulario está en modo de edición */
        isEditMode: boolean = false;
        showArchivoImagen: boolean;
        pagarchivo: any;

    constructor(
        private messageService: MessageService,
        private matriculaService: MatriculaService,
        private spinner: NgxSpinnerService,
        private authService: AuthService,
        private formBuilder: FormBuilder,
        private pagoService: PagoService,
        private uploadService: UploadService,
        private cdr: ChangeDetectorRef,
    ) {
        this.items = [
            { label: 'Matriculación' },
            { label: 'Asignar matricula a un estudiante', routerLink: '' },
        ];

        this.home = { icon: 'pi pi-home', routerLink: '/principal' };
    }

    ngOnInit() {


        this.listarMatricula();

        this.obtenerPerfilUsuario(); // obtener los valores del usuario logueado

        this.validacionMatricula(); // se asigna los parametros para la variable de validación

        this.validacionPago(); // se asigna los pararmetros para la variable pago de validación

        this.obtenerColumnas(); // obtener Columnas para exportar en excel y pdf la listaTipoMatricula

        this.obtenerTiposMatricula();

        this.obtenerTipoPago();

        this.obtenerTipoPersonaEstudiante();

    }

    // Funcion para asignar variables de validación para el formulario de registro
    validacionMatricula() {
        this.matriculaForm = this.formBuilder.group({
            matrid: [''],
            tiposMatricula: ['', [Validators.required]],
            matrfec: ['', [Validators.required]],
            tipoPersona: ['', [Validators.required]],
            matrdescripcion: ['', [Validators.required]]
        });
    }

    // Método para asignar las variables de React Form Valid
    validacionPago() {
        this.pagoForm = this.formBuilder.group({
            pagid: [''],
            insid: [''],
            pagdescripcion: ['', Validators.required],
            pagfecha: ['', Validators.required],
            pagmonto: [0, [Validators.required, Validators.min(0)]],
            tipoPago: ['', Validators.required],
            pagestadodescripcion: [''],
            pagarchivo: [''],
            pagestado: ['', Validators.required]
        });
    }

    // Funcion para obtener datos del usuario logueado
    obtenerPerfilUsuario() {
        this.authService.getProfile().subscribe(usuario => {
            this.usuario = usuario[0];
        });
    }

    // Obtener tipos de matricula
    obtenerTiposMatricula(){
        this.matriculaService.listarTipoMatriculaCombo().subscribe(
            (result: any)=>{
                this.tiposMatricula = result;
            },
            (error: any)=>{
                console.error(error);
            }
        )
    }

    // Obtener personas de tipo estudiante
    obtenerTipoPersonaEstudiante(){
        this.matriculaService.listarTipoPersonaEstudiante().subscribe(
            (result: any)=>{
                this.tipoPersonaEstudiante = result;
            },
            (error: any)=>{
                console.error(error);
            }
        )
    }

    // Obtener los tipos de pagos
    obtenerTipoPago() {
        this.pagoService.getTipoPago().subscribe(
            (result: any) => {
                this.tipoPago = result;
            }
        )
    }

    // Función para listar las asignaciones de matricula
    listarMatricula(){
        this.spinner.show();
        this.matriculaService.listarMatricula().subscribe({
            next: (result: any) => {
                this.listaMatricula = result['data'];
                this.listaMatriculaDuplicado = this.listaMatricula;
                this.spinner.hide();
            },
            error: (error: any) => {
                console.error(error);
                this.spinner.hide();
            }
        });
    }

    // Función para nueva asignación de matricula a un usuario
    crearMatriculaAsignacion() {
        this.matriculaForm.reset();
        this.matriculaDialog = true;
        this.opcionMatricula = true;
        this.matriculaForm.patchValue({
            matrfec: new Date()
        })
    }

    // Función para editar matricula
    editarMatriculaAsignacion(data: any) {
        this.obtenerTiposMatricula();
        this.obtenerTipoPersonaEstudiante();
        this.matriculaForm.reset();
        this.matricula = { ...data };
        this.matriculaDialog = true;
        this.opcionMatricula = false;
        this.setDataMatricula();
    }

    // Función para obtener datos para setear datos en el formulario
    setDataMatricula(){
        this.matriculaForm.patchValue({
            matrid: this.matricula.matrid,
            tiposMatricula: new TiposMatricula(this.matricula.tipmatrid, this.matricula.tipmatrgestion),
            tipoPersona: new TipoPersonaEstudiante(this.matricula.peridestudiante, this.matricula.pernomcompleto, this.matricula.perfoto),
            matrfec: this.matricula.matrfec,
            matrdescripcion: this.matricula.matrdescripcion
        })
    }

    // Función para obtener datos del formulario para registrar
    obtenerBodyMatricula(){
        this.matricula.tipmatrid = this.matriculaForm.value.tiposMatricula.tipmatrid;
        this.matricula.peridestudiante = this.matriculaForm.value.tipoPersona.perid;
        this.matricula.matrdescripcion = this.matriculaForm.value.matrdescripcion;
        this.matricula.matrusureg = this.usuario.usuname;
        this.matricula.matrusumod = this.usuario.usuname;
        const body = {...this.matricula}
        return body;
    }

    // Función de cancelar formulario
    ocultarDialogMatricula() {
        this.matriculaDialog = false;
        this.pagoMatriculaDialog = false;
        this.opcionMatricula = true;
        this.messageService.add({ severity: 'info', summary: 'Cancelar', detail: 'Operación cancelada', life: 3000 });
        this.matriculaForm.reset();
    }

    // Función para guardar los datos para agregar y modificar
    guardarMatricula() {
        if(this.matriculaForm.invalid){
            this.messageService.add({ severity: 'error', summary: 'Ups! error de registro', detail: 'Por favor, verifica la información ingresada e intenta nuevamente.', life: 5000 });
            return Object.values(this.matriculaForm.controls).forEach(control=>{
                control.markAllAsTouched();
                control.markAsDirty();
            })
        }
        this.obtenerBodyMatricula();
        if(this.opcionMatricula){
            this.matricula.matrfec = this.matriculaForm.value.matrfec;
            this.matriculaService.insertarMatricula(this.matricula).subscribe({
                next: (result: any) => {
                    this.messageService.add({ severity: 'success', summary: 'Registro correcto', detail: 'Matricula agregada correctamente en el sistema', life: 5000 });
                    this.listarMatricula();
                    this.matriculaDialog = false;
                    this.opcionMatricula = false;
                    this.matriculaForm.reset();
                },
                error: (error: any) => {
                    console.error("error: ", error);
                    let errorMessage = 'Se produjo un error.';
                    if (error.error.message.includes('UniqueViolation')) {
                        errorMessage = 'No se puede crear el registro.';
                    }
                    this.messageService.add({ severity: 'error', summary: 'El registro ya existe.', detail: errorMessage, life: 7000});
                }
            });
        }
        if(!this.opcionMatricula){
            this.matriculaService.modificarMatricula(this.matricula).subscribe({
                next: (result: any) => {
                    this.messageService.add({ severity: 'success', summary: 'Registro correcto', detail: 'Matricula modificado correctamente en el sistema', life: 5000 });
                    this.listarMatricula();
                    this.matriculaDialog = false;
                    this.opcionMatricula = false;
                    this.matriculaForm.reset();
                },
                error: (error: any) => {
                    console.error("error",error);
                    this.messageService.add({severity:'warn', summary:'Error', detail:'Algo salio mal, al modificar la matricula'});
                }
            });
        }
    }

    // Funciones para gestionar el estado de los registos
    desactivarMatricula(data: Matricula) {
        this.desactivarMatriculaDialog = true;
        this.matricula = { ...data };
        this.matricula.tipo = 2;
    }

    // Funciones para gestionar el estado de los registos
    activarMatricula(data: Matricula) {
        this.activarMatriculaDialog = true;
        this.matricula = { ...data };
        this.matricula.tipo = 3;
    }

    // Funcion para gestionar el estado de los registos
    confirmarActivarDesactivar() {
        this.matricula.matrusumod = this.usuario.usuname;
        this.matriculaService.gestionarMatriculaEstado(this.matricula).subscribe({
            next: (result: any) => {
                this.messageService.add({ severity: 'success', summary: 'Registro correcto', detail: 'Estado del tipo matricula modificada correctamente en el sistema', life: 5000 });
                this.listarMatricula();
                this.activarMatriculaDialog = false;
                this.desactivarMatriculaDialog = false;
                this.matricula = new Matricula();
            },
            error: error => {
            console.error("error",error);
                this.messageService.add({severity:'warn', summary:'Error', detail: 'Algo salio mal.', life: 5000});
            }
        });
    }

    // Crear pago con asignación de matricula
    crearPagoMatricula(data: Matricula){
        this.pagoForm.reset();
        this.pagoMatriculaDialog = true;
        this.matricula = {...data};
        this.isEditMode = false;
    }

    modificarPagoMatricula(data: Matricula){
        this.pagoMatriculaDialog = true;
        this.isEditMode = true;
        this.matricula = {...data};
        this.setPagoMatricula();
    }

    // Funciones para registrar pago
    obtenerPagoBody(){
        this.pago.pagdescripcion = this.pagoForm.value.pagdescripcion;
        this.pago.pagfecha = this.pagoForm.value.pagfecha;
        this.pago.pagmonto = this.pagoForm.value.pagmonto;
        this.pago.pagtipo = this.pagoForm.value.tipoPago.tpagid;
        this.pago.pagusumod = this.usuario.usuname;
        this.pago.pagusureg = this.usuario.usuname;
        this.pago.pagarchivo = this.nombreArchivo;
        const body = { ...this.pago }
        return body;
    }

    // Funcion para cargar los datos en el formulario
    setPagoMatricula(){
        this.pagoForm.reset(); // Se resetea el pagoForm para que no se retengan ningún datos anteriores.
        this.pagoForm.patchValue({
            pagid: this.matricula.pagoidmatricula,
            pagdescripcion: this.matricula.pagdescripcion,
            pagfecha: this.matricula.pagfecha,
            pagmonto: this.matricula.pagmonto,
            tipoPago: new TipoPago(this.matricula.pagtipo, this.getText(this.matricula.pagtipo)),
            pagestado: this.matricula.pagestado
        })
    }

    // Función de cancelar formulario
    ocultarDialogPagoMatricula() {
        this.pagoMatriculaDialog = false;
        this.isEditMode = false;
        this.messageService.add({ severity: 'info', summary: 'Cancelar', detail: 'Operación cancelada', life: 3000 });
        this.pagoForm.reset();
        this.clearFilePago();
    }

    /**
     * Guarda los datos del pago, ya sea creando un nuevo registro y asignado a registro de matricula o actualizando uno existente.
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
        pagoData.append('matrid', String(this.matricula.matrid));
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
            mensajeDetalle = 'El pago fue creado y matricula asignada correctamente.'; // Mensaje para creación
        }

        // Configuración específica para la actualización de un pago existente
        if (this.isEditMode) {
            pagoData.append('pagid', this.pagoForm.value.pagid); // ID del pago a actualizar
            pagoData.append('pagusumod', this.usuario.usuname); // Usuario que modifica
            mensajeDetalle = 'El pago fue modificado correctamente.'; // Mensaje para actualización
        }

        // Llamada al servicio para gestionar el pago (crear o actualizar)
        this.spinner.show();
        this.pagoService.manageAssignPayment(pagoData).subscribe({
            next: (result: any) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: mensajeDetalle // Utiliza la variable con el mensaje adecuado
                });
                this.pagoMatriculaDialog = false;
                this.isEditMode = false;
                this.pagoForm.reset();
                this.pagoFile = null;
                this.pagoFileUrl = null;
                this.uploadProgress = 0;

                this.listarMatricula();
                this.spinner.hide();
            },
            error: (error: any) => {
                this.spinner.hide();
                console.error("error al gestionar el pago:", error);
                this.messageService.add({
                    severity: 'warn',
                    summary: '¡Error!',
                    detail: 'No se pudo guardar el registro de pago.'
                });

            }
        });
    }

    // Función para ver el archivo pago subido
    verArchivoPago(pagarchivo: any){
        this.pagoService.getFilePago(pagarchivo);
    }

    /**
     * Funcion para obtener el texto de tipo de pago
     *
     * @param pagtipo
     */
    getText(pagtipo: number): string {
        switch (pagtipo) {
            case 1:
                return 'Ninguno';
            case 2:
                return 'Efectivo';
            case 3:
                return 'Deposito Bancario';
            case 4:
                return 'Adelanto';
            case 5:
                return 'Otro';
            default:
                return 'Otro';
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

    /** Mostrar el archivo de pago */
    mostrarPagoArchivo(filename: string){
        if(this.isImagen(filename)){
        }
        if(this.isPdf(filename)){
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
     * Limpia los archivos seleccionados para subir.
     */
    clearFilePago(): void {
        this.cdr.detectChanges();
        this.pagoFile = null;
        this.pagoFileUrl = null;
        this.uploadProgress = 0;
        this.messageService.add({ severity: 'info', summary: 'Archivo', detail: 'Selección de archivo limpiada.' });
    }

    // Obtener columnas para recuperar los datos para exportar en pdf.
    obtenerColumnas() {
        this.colsTable = [
            { field: 'matrid', header: 'Cod. Matr.' },
            { field: 'matrfec', header: 'Fecha' },
            { field: 'tipmatrgestion', header: 'Matricula' },
            { field: 'tipmatrcosto', header: 'Costo' },
            { field: 'pernomcompleto', header: 'Estudiante' },
            { field: 'pagdescripcion', header: 'Pago' },
            { field: 'pagmonto', header: 'Monto' },
            { field: 'matrdescripcion', header: 'Descripción' },
            { field: 'matrestado', header: 'Estado' }
        ];

        this.exportColumns = this.colsTable.map((col) => ({ title: col.header, dataKey: col.field }));
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

    // Funciones para obtener el color del estado
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
                return 'Activo';
            case 0:
                return 'Inactivo';
            default:
                return 'Ninguno';
        }
    }

    // Funcion para filtrar la tabla
    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }

    // Función para exportar el documento PDF
    exportPdf() {
        import('jspdf').then(jsPDF => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default('l', 'pt', 'a4');

                // Título centrado
                const title = 'Lista de asignación de matricula por estudiante';
                const titleFontSize = 16;
                const titleWidth = doc.getStringUnitWidth(title) * titleFontSize / doc.internal.scaleFactor;
                const titleX = (doc.internal.pageSize.getWidth() - titleWidth) / 2;
                const titleY = 60;
                doc.setFontSize(titleFontSize);
                doc.text(title, titleX, titleY);

                // Subtítulo
                const subtitle = 'Esta lista representa las matriculas asignados por estudiante';
                const subtitleFontSize = 9;
                const subtitleX = 20;
                const subtitleY = 80;
                doc.setFontSize(subtitleFontSize);
                doc.text(subtitle, subtitleX, subtitleY);

                // Descripción
                const description = 'Sistema de Seguimiento y Gestión Académico';
                const descriptionFontSize = 10;
                const descriptionX = 100;
                const descriptionY = 40;
                doc.setFontSize(descriptionFontSize);
                doc.text(description, descriptionX, descriptionY);

                const description2 = 'Instituto Biblico de Capacitación Internacional';
                const descriptionFontSize2 = 10;
                const descriptionX2 = 100;
                const descriptionY2 = 30;
                doc.setFontSize(descriptionFontSize2);
                doc.text(description2, descriptionX2, descriptionY2);

                // Imagen en base64
                const base64Image = logoIbciBase64;
                const imageX = 20;
                const imageY = 10;
                const imageWidth = 80; // Ancho de la imagen en puntos
                const imageHeight = 50; // Alto de la imagen en puntos
                doc.addImage(base64Image, 'PNG', imageX, imageY, imageWidth, imageHeight);

                // Tabla de datos
                (doc as any).autoTable({
                    columns: this.exportColumns,
                    body: this.listaMatriculaDuplicado,
                    theme: 'striped',
                    styles: { fontSize: 8, cellPadding: 3 },
                    startY: 100, // Posición inicial de la tabla
                });

                doc.save('lista_asignacion_matricula.pdf');
            });
        });
    }


}
