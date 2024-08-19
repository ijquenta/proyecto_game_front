import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

import { FileUpload } from 'primeng/fileupload';
// Service
import { UsuarioService } from 'src/app/modules/service/data/usuario.service';
// Modelos
import { Material, TipoCategoriaTexto, TipoTexto, TipoExtensionTexto, TipoIdiomaTexto, TipoFormatoTexto } from 'src/app/modules/models/material';
import { MaterialService } from 'src/app/modules/service/data/material.service';
import { Texto } from 'src/app/modules/models/material';

import { Usuario } from 'src/app/modules/models/usuario';
import { AuthService } from 'src/app/modules/service/core/auth.service';

import { API_URL_FILES_TEXTOS } from 'src/environments/environment';

import {
    FormBuilder,
    FormGroup,
    Validators,
} from '@angular/forms';

import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin } from 'rxjs';

interface ColumsTable {
    field: string;
    header: string;
}

@Component({
    templateUrl: './material-crud.component.html',
    providers: [MessageService],
    styleUrls: ['../../../../app.component.css'],
})
export class MaterialCrudComponent implements OnInit {
    Materiales: Material[] = [];
    errors: any;
    optionDialog: boolean = false;
    deleteDialog: boolean = false;
    statuses: any[] = [];
    loading: boolean = false;
    textos: Texto[] = [];
    texto = new Texto(0,'',0,0,'','','','',0,0,0,'',0,'','','','',0);
    textoForm: FormGroup;
    usuario: Usuario;
    items: MenuItem[] | undefined;
    home: MenuItem | undefined;
    selectedColumns: { field: string; header: string }[];
    colsColumsTable!: ColumsTable[];

    // Tipos para combos
    tipoTexto: TipoTexto[] = [];
    tipoCategoriaTexto: TipoCategoriaTexto[] = [];
    tipoExtensionTexto: TipoExtensionTexto[] = [];
    tipoIdiomaTexto: TipoIdiomaTexto[] = [];

    tipoTextoOptions: {
        label: string;
        value: number;
    }[];

    tipoCategoriaOptions: {
        label: string;
        value: number;
    }[];

    tipoFormatoOptions: {
        label: string;
        value: number;
    }[];

    tipoExtensionOptions: {
        label: string;
        value: number;
    }[];

    tipoIdiomaOptions: {
        label: string;
        value: number;
    }[];

    statusOptions = [
        { label: 'Activo', value: 1 },
        { label: 'Inactivo', value: 0 },
    ];

    tipoFormatoTexto: TipoFormatoTexto[] = [
        { tipforid: 1, tipfornombre: 'PDF' },
        { tipforid: 2, tipfornombre: 'Word' },
        { tipforid: 3, tipfornombre: 'Excel' },
        { tipforid: 4, tipfornombre: 'PowerPoint' },
        { tipforid: 5, tipfornombre: 'Text File' },
    ];
    /** Indica si el formulario está en modo de edición */
    isEditMode: boolean = false;

    /** Variables para el manejo de archivos */
    textoFile: File | null = null;
    textoFileUrl: string | null = null;
    fileObjectUrlTexto: any;
    uploadProgress: number = 0;

    constructor(
        public usuarioService: UsuarioService,
        private messageService: MessageService,
        public materialService: MaterialService,
        private formBuilder: FormBuilder,
        private spinner: NgxSpinnerService,
        private authService: AuthService,
        private cdr: ChangeDetectorRef
    ) {
        this.items = [
            { label: 'Material de apoyo' },
            { label: 'Gestionar Material' },
            { label: 'Listar Texto', routerLink: '' },
        ];
        this.home = { icon: 'pi pi-home', routerLink: '/principal' };

        this.colsColumsTable = [
            { field: 'texnombre', header: 'Nombre' },
            { field: 'textipo', header: 'Tipo Texto' },
            { field: 'texformato', header: 'Formato' },
            { field: 'texdocumento', header: 'Documento' },
            { field: 'texruta', header: 'Ruta' },
            { field: 'texdescripcion', header: 'Descripción' },
            { field: 'texautor', header: 'Autor' },
            { field: 'texsize', header: 'Tamaño' },
            { field: 'texextension', header: 'Extensión' },
            { field: 'texidioma', header: 'Idioma' },
            { field: 'texfecpublicacion', header: 'Fecha Publicación' },
            { field: 'texcategoria', header: 'Categoria' },
            { field: 'texusureg', header: 'Registrado' },
            { field: 'texfecreg', header: 'Fecha Registrado' },
            { field: 'texusumod', header: 'Modificado' },
            { field: 'texfecmod', header: 'Fecha Modificado' },
            { field: 'texestado', header: 'Estado' },
        ];

        this.selectedColumns = [
            { field: 'texnombre', header: 'Nombre' },
            { field: 'textipo', header: 'Tipo Texto' },
            { field: 'texformato', header: 'Formato' },
            { field: 'texruta', header: 'Ruta' },
            { field: 'texdescripcion', header: 'Descripción' },
            { field: 'texautor', header: 'Autor' },
            { field: 'texsize', header: 'Tamaño' },
            { field: 'texidioma', header: 'Idioma' },
            { field: 'texfecpublicacion', header: 'Fecha Publicación' },
            { field: 'texcategoria', header: 'Categoria' },
            { field: 'texestado', header: 'Estado' },
        ];
    }

    ngOnInit() {
        this.getListTexto();
        this.validationsText();
        this.getProfileUsuario();
        this.getOptionsType();
        this.statuses = [
            { label: 'Activo', value: 0 },
            { label: 'Inactivo', value: 1 },
        ];
    }

    getOptionsType() {
        this.spinner.show();
        forkJoin([
            this.materialService.getTipoTexto(),
            this.materialService.getTipoCategoriaTexto(),
            this.materialService.getTipoExtensionTexto(),
            this.materialService.getTipoIdiomaTexto(),
        ]).subscribe({
            next: ([
                tipoTexto,
                tipoCategoriaTexto,
                tipoExtensionTexto,
                tipoIdiomaTexto,
            ]: [
                TipoTexto[],
                TipoCategoriaTexto[],
                TipoExtensionTexto[],
                TipoIdiomaTexto[]
            ]) => {
                this.tipoTexto = tipoTexto;
                this.tipoCategoriaTexto = tipoCategoriaTexto;
                this.tipoExtensionTexto = tipoExtensionTexto;
                this.tipoIdiomaTexto = tipoIdiomaTexto;
                this.spinner.hide();
                this.tipoTextoOptions = tipoTexto.map((tt: any) => ({
                    label: tt.tiptexnombre,
                    value: tt.tiptexid,
                }));

                this.tipoCategoriaOptions = tipoCategoriaTexto.map(
                    (tp: any) => ({
                        label: tp.tipcatnombre,
                        value: tp.tipcatid,
                    })
                );

                this.tipoExtensionOptions = tipoExtensionTexto.map(
                    (te: any) => ({
                        label: te.tipextnombre,
                        value: te.tipextid,
                    })
                );

                this.tipoIdiomaOptions = tipoIdiomaTexto.map((ti: any) => ({
                    label: ti.tipidinombre,
                    value: ti.tipidiid,
                }));

                this.tipoFormatoOptions = this.tipoFormatoTexto.map(
                    (tf: any) => ({
                        label: tf.tipfornombre,
                        value: tf.tipforid,
                    })
                );
            },
            error: (error: any) => {
                console.error('Error en la solicitud:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Ocurrió un error al obtener los datos. Por favor, intente de nuevo.',
                    life: 5000,
                });
            },
        });
    }

    validationsText() {
        this.textoForm = this.formBuilder.group({
            texid: [''],
            texnombre: ['', [Validators.required]],
            tipoTexto: ['', [Validators.required]],
            texdescripcion: ['', [Validators.required]],
            tipoFormato: ['', [Validators.required]],
            texdocumento: [''],
            tipoIdioma: ['', [Validators.required]],
            texruta: [''],
            texsize: [''],
            tipoExtension: ['', [Validators.required]],
            texautor: ['', [Validators.required]],
            texfecpublicacion: ['', [Validators.required]],
            tipoCategoria: ['', [Validators.required]],
            texestado: ['', [Validators.required]],
        });
    }

    emptyForm() {
        this.textoForm.reset();
    }

    // Obtener datos del perfil del usuario logeado
    getProfileUsuario() {
        this.authService.getProfile().subscribe((usuario) => {
            this.usuario = usuario[0];
        });
    }

    getListTexto() {
        this.loading = true;
        this.materialService.getTextos().subscribe((data: any) => {
            this.textos = data;
            this.loading = false;
        });
    }

    createTexto() {
        this.optionDialog = true;
        this.isEditMode = false;
    }

    viewDocumentText(pagarchivo: any) {
        this.materialService.getFileTexto(pagarchivo);
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }

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

    getDescriptionTipoTexto(textipo: number): string {
        const tipoTexto = this.tipoTexto.find(
            (tipo) => tipo.tiptexid === textipo
        );
        return tipoTexto ? tipoTexto.tiptexnombre : 'Ninguno';
    }

    getDescriptionTipoFormato(texformato: number): string {
        const tipoFormato = this.tipoFormatoTexto.find(
            (tipo) => tipo.tipforid === texformato
        );
        return tipoFormato ? tipoFormato.tipfornombre : 'Ninguno';
    }

    getDescriptionTipoExtension(texextension: number): string {
        const tipoExtension = this.tipoExtensionTexto.find(
            (tipo) => tipo.tipextid === texextension
        );
        return tipoExtension ? tipoExtension.tipextnombre : 'Ninguno';
    }

    getDescriptionTipoIdioma(texidioma: number): string {
        const tipoIdioma = this.tipoIdiomaTexto.find(
            (tipo) => tipo.tipidiid === texidioma
        );
        return tipoIdioma ? tipoIdioma.tipidinombre : 'Ninguno';
    }

    getDescriptionTipoCategoria(texcategoria: number): string {
        const tipoCategoria = this.tipoCategoriaTexto.find(
            (tipo) => tipo.tipcatid === texcategoria
        );
        return tipoCategoria ? tipoCategoria.tipcatnombre : 'Ninguno';
    }

    convertBytesToMB(bytes: number): string {
        const megabytes = bytes / (1024 * 1024);
        return megabytes.toFixed(2);
    }

    /**
     * Subir texto | Upload file
     */

    /**
     * Maneja el evento de carga de archivos para el archivo de texto.
     *
     * @param event - Evento de carga de archivos.
     */
    onUploadTexto(event: any): void {
        if (this.textoFile) {
            let progressInterval = setInterval(() => {
                this.uploadProgress += Math.floor(Math.random() * 20) + 15;
                if (this.uploadProgress >= 100) {
                    this.uploadProgress = 100;
                    clearInterval(progressInterval);
                    this.messageService.add({
                        severity: 'info',
                        summary: 'Éxito',
                        detail: 'Archivo cargado correctamente.',
                    });
                    this.textoFileUrl = URL.createObjectURL(this.textoFile);
                    this.textoForm.patchValue({
                        pagarchivo: this.textoFile.name,
                    });
                    const texdocumentoControl =
                        this.textoForm.get('texdocumento');
                    if (texdocumentoControl) {
                        texdocumentoControl.markAsTouched();
                        texdocumentoControl.markAsDirty();
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
        this.textoFile = event.files[0];
        this.uploadProgress = 0; // Reiniciar la barra de progreso
        this.messageService.add({
            severity: 'info',
            summary: 'Archivo',
            detail: 'Archivo seleccionado correctamente.',
        });
    }

    /**
     * Limpia los archivos seleccionados para subir.
     */
    clearFile(): void {
        this.cdr.detectChanges();
        this.textoFile = null;
        this.textoFileUrl = null;
        this.uploadProgress = 0;
        this.messageService.add({
            severity: 'info',
            summary: 'Archivo',
            detail: 'Selección de archivo limpiada.',
        });
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

    // Cerrar dialog
    cancelar(): void {
        this.textoForm.reset();
        this.optionDialog = false;
        this.uploadProgress = 0;
        this.clearFile();
    }

    saveTexto() {

        // Verifica si el formulario es válido
        if (this.textoForm.invalid) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error en el registro de texto',
                detail: 'Por favor, completa todos los campos obligatorios e intenta nuevamente.',
                life: 5000,
            });
            // Marca todos los controles como tocados y sucios para mostrar errores
            Object.values(this.textoForm.controls).forEach((control) => {
                control.markAllAsTouched();
                control.markAsDirty();
            });
            return;
        }

        // Formateo de la fecha si está presente
        if (this.textoForm.value.texfecpublicacion) {
            const fecha = new Date(this.textoForm.value.texfecpublicacion);
            const fechaFormateada = fecha.toISOString().split('T')[0];
            this.textoForm.patchValue({ texfecpublicacion: fechaFormateada });
        }

        // Carga de los datos
        const textoData: FormData = new FormData();
        textoData.append('texnombre', this.textoForm.value.texnombre);
        textoData.append('texdescripcion', this.textoForm.value.texdescripcion);
        textoData.append('textipo', this.textoForm.value.tipoTexto.tiptexid);
        textoData.append('texcategoria', this.textoForm.value.tipoCategoria.tipcatid);
        textoData.append('texformato', this.textoForm.value.tipoFormato.tipforid);
        textoData.append('texidioma', this.textoForm.value.tipoIdioma.tipidiid);
        textoData.append('texextension', this.textoForm.value.tipoExtension.tipextid);
        textoData.append('texruta', this.textoForm.value.texruta);
        textoData.append('texautor', this.textoForm.value.texautor);
        textoData.append('texfecpublicacion', this.textoForm.value.texfecpublicacion);
        textoData.append('texdocumento', this.textoFile);
        textoData.append('texsize', this.textoFile.size? String(this.textoFile.size) : '0' );
        textoData.append('texestado', this.textoForm.value.texestado);

        // Configuración específica para la creación de un nuevo texto
        let mensajeDetalle = ''; // Variable para el detalle del mensaje

        if (!this.isEditMode) {
            // Si es para crear texto
            textoData.append('texid', '0'); // ID 0 para indicar creación
            textoData.append('texusureg', this.usuario.usuname); // Usuario que registra
            mensajeDetalle = 'El texto fue creado correctamente.'; // Mensaje para creación

            // Llamada al servicio para gestionar el pago (crear o actualizar)
            this.loading = true;
            this.spinner.show();
            this.materialService.createTexto(textoData).subscribe({
                next: (result: any) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: mensajeDetalle, // Utiliza la variable con el mensaje adecuado
                    });
                    // Listar textos
                    this.getListTexto();
                    // Limpiar formulario
                    this.cleanForm();

                    // Ocultar spinner de carga
                    this.loading = false;
                    this.spinner.hide();

                    // Ocultar dialog
                    this.optionDialog = false;
                },
                error: (error: any) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: '¡Error!',
                        detail: 'No se pudo registrar el texto.',
                    });
                    this.loading = false;
                    this.spinner.hide();
                },
            });
        }

        // Configuración específica para la actualización de un texto existente
        if (this.isEditMode) {
            textoData.append('texid', this.textoForm.value.texid); // ID del texto a actualizar
            textoData.append('texusumod', this.usuario.usuname); // Usuario que modifica
            textoData.append('texsize', this.textoForm.value.texsize? this.textoForm.value.texsize: 0);
            mensajeDetalle = 'El texto fue actualizado correctamente.'; // Mensaje para actualización

            // Llamada al servicio para gestionar el pago (crear o actualizar)
            this.loading = true;
            this.spinner.show();
            this.materialService.updateTexto(this.textoForm.value.texid, textoData).subscribe({
                next: (result: any) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: mensajeDetalle, // Utiliza la variable con el mensaje adecuado
                    });
                    // Listar textos
                    this.getListTexto();
                    // Limpiar formulario
                    this.cleanForm();
                    // Ocultar spinner de carga
                    this.loading = false;
                    this.spinner.hide();
                    // Ocultar dialog
                    this.optionDialog = false;
                },
                error: (error: any) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: '¡Error!',
                        detail: 'No se pudo registrar el texto.',
                    });
                    this.loading = false;
                    this.spinner.hide();
                },
            });
        }
    }

    cleanForm() {
        this.textoForm.reset();
        this.uploadProgress = 0;
        this.cdr.detectChanges();
        this.textoFile = null;
        this.textoFileUrl = null;
    }

    getDownloadLink(documento: string): string {
        return `${API_URL_FILES_TEXTOS}/${documento}`;
    }

    isTextoPDF(documento: string): boolean {
        return documento.split('.').pop()?.toLowerCase() === 'pdf';
    }

    /**
     * Editar texto
     * Setear datos en el formulario para editar
     */

    updateTexto(texto: Texto) {
        this.setDataTexto(texto);
        this.optionDialog = true;
        this.isEditMode = true;
    }

    /**
     * Carga los datos de un texto específico si se está en modo edición.
     *
     * @param texto - Objeto Texto con los datos a cargar.
     */
    private setDataTexto(texto: Texto): void {
        this.texto = { ...texto };
        this.textoForm.patchValue({
            texid: texto.texid,
            texnombre: texto.texnombre,
            texdescripcion: texto.texdescripcion,
            tipoTexto: new TipoTexto(texto.textipo,this.getDescriptionTipoTexto(texto.textipo)),
            tipoCategoria: new TipoCategoriaTexto(texto.texcategoria,this.getDescriptionTipoCategoria(texto.texcategoria)),
            tipoFormato: new TipoFormatoTexto(texto.texformato,this.getDescriptionTipoFormato(texto.texformato)),
            tipoIdioma: new TipoIdiomaTexto(texto.texidioma,this.getDescriptionTipoIdioma(texto.texidioma)),
            tipoExtension: new TipoExtensionTexto(texto.texextension,this.getDescriptionTipoExtension(texto.texextension)),
            texruta: texto.texruta,
            texautor: texto.texautor,
            texfecpublicacion: texto.texfecpublicacion,
            texdocumento: texto.texdocumento,
            texsize: texto.texsize? texto.texsize: 0,
            texestado: texto.texestado,
        });
    }

    deleteTexto(texto: Texto){
        this.texto = {...texto}
        this.deleteDialog = true;
    }

    confirmDeleteTexto(){
        this.materialService.deleteTexto(this.texto.texid).subscribe({
            next: (result: any) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'El texto fue eliminado correctamente.',
                });
                this.getListTexto();
                this.deleteDialog = false;
            },
            error: (error: any) => {
                this.messageService.add({
                    severity: 'error',
                    summary: '¡Error!',
                    detail: 'No se pudo eliminar el texto.',
                });
                this.deleteDialog = false;
            },
        });
    }
}
