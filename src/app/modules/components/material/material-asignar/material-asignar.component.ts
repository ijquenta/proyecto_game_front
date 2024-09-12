import { MaterialService } from 'src/app/modules/service/data/material.service';
import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { NotaService } from 'src/app/modules/service/data/nota.service';
import { AuthService } from 'src/app/modules/service/core/auth.service';
import { Usuario } from 'src/app/modules/models/usuario';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import { MateriaTexto } from 'src/app/modules/models/materiaTexto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TipoMateria2, TipoTexto } from 'src/app/modules/models/diccionario';
import { DiccionarioService } from 'src/app/modules/service/data/diccionario.service';
import { forkJoin } from 'rxjs';
import logoIbciBase64 from '../../../../../assets/base64/logo_ibci_base64.js';
import { API_URL_FILES_TEXTOS } from 'src/environments/environment';

interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}

interface ColumsTable {
    field: string;
    header: string;
}

@Component({
    templateUrl: './material-asignar.component.html',
    styleUrls: ['../../../../app.component.css'],
})
export class MaterialAsignarComponent implements OnInit {

    listMateriaTexto: MateriaTexto[] = [];
    listMateriaTextoDuplicated: MateriaTexto[] = [];
    materiaTexto: MateriaTexto[] = [];
    tipoMateria: TipoMateria2[] = [];
    tipoTexto: TipoTexto[] = [];
    materiatexto = new MateriaTexto();

    assignDialog: boolean = false;
    assignBool: boolean = false;
    loading: boolean = false;

    materiaTextoForm: FormGroup;

    usuario: Usuario;
    colsTable!: Column[];
    exportColumns!: ExportColumn[];
    items: MenuItem[] | undefined;
    home: MenuItem | undefined;
    selectedColumns: { field: string; header: string }[];
    colsColumsTable!: ColumsTable[];

    statusOptions = [
        { label: 'Activo', value: 1 },
        { label: 'Inactivo', value: 0 },
    ];
    modifyDialog: boolean;
    deleteDialog: boolean;

    constructor(
        private messageService: MessageService,
        private authService: AuthService,
        private spinner: NgxSpinnerService,
        private materialService: MaterialService,
        private formBuilder: FormBuilder
    ) {
        this.items = [
            { label: 'Material de Apoyo' },
            { label: 'Asignar Material', routerLink: '' },
        ];
        this.home = { icon: 'pi pi-home', routerLink: '/principal' };
    }
    ngOnInit(): void {
        this.assignColumnsForTable();
        this.getUser();
        this.getListMateriaTexto();
        this.assignValidation();
        this.getListTipoMateria();
        this.getListTipoTexto();
        this.assignColumnsForExport();
    }

    assignColumnsForTable(){
        this.colsColumsTable = [
            { field: 'matid', header: 'ID Materia' },
            { field: 'matdesnivel', header: 'Nivel Materia' },
            { field: 'texid', header: 'ID Texto' },
            { field: 'texnombre', header: 'Nombre Texto' },
            { field: 'mattexid', header: 'ID Materia Texto' },
            { field: 'mattexdescripcion', header: 'Descripción Materia Texto' },
            { field: 'mattexusureg', header: 'Registrado' },
            { field: 'mattexfecreg', header: 'Fecha Registrado' },
            { field: 'mattexusumod', header: 'Modificado' },
            { field: 'mattexfecmod', header: 'Fecha Modificado' },
            { field: 'mattexestado', header: 'Estado' },
        ];
        this.selectedColumns = [
            { field: 'matdesnivel', header: 'Nivel Materia' },
            { field: 'texnombre', header: 'Nombre Texto' },
            { field: 'mattexdescripcion', header: 'Descripción Materia Texto' },
            { field: 'mattexusureg', header: 'Registrado' },
            { field: 'mattexfecreg', header: 'Fecha Registrado' },
            { field: 'mattexusumod', header: 'Modificado' },
            { field: 'mattexfecmod', header: 'Fecha Modificado' },
            { field: 'mattexestado', header: 'Estado' },
        ];
    }

    assignColumnsForExport(){
        this.colsTable = [
            { field: 'matnombre', header: 'Nombre Materia' },
            { field: 'texnombre', header: 'Nombre Texto' },
            { field: 'mattexdescripcion', header: 'Descripción' },
            { field: 'mattexusureg', header: 'Registrado' },
            { field: 'mattexfecreg', header: 'Fecha Registrado' },
            { field: 'mattexusumod', header: 'Modificado' },
            { field: 'mattexfecmod', header: 'Fecha Modificado' },
            { field: 'mattexestado', header: 'Estado'}
        ];
        this.exportColumns = this.colsTable.map((col) => ({
            title: col.header,
            dataKey: col.field,
        }));
    }

    getUser() {
        this.authService.usuario$.subscribe((user) => {
            if (user && Array.isArray(user) && user.length > 0) {
                this.usuario = user[0];
            }
        });
    }

    getListMateriaTexto() {
        this.spinner.show();
        this.loading = true;
        this.materialService.getMateriaTexto().subscribe({
            next: (result: any) => {
                this.listMateriaTexto = result as MateriaTexto[];
                this.listMateriaTextoDuplicated = result as MateriaTexto[];
                this.loading = false;
                this.spinner.hide();
            },
            error: (error: any) => {
                this.loading = false;
                this.spinner.hide();
                console.error('error', error);
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Error',
                    detail: 'Algo salió mal!',
                });
            }
        });
    }

    getSeverityNivel(matdesnivel: string): string {
        switch (matdesnivel) {
            case 'PRIMERO':
                return 'danger';
            case 'SEGUNDO':
                return 'info';
            case 'TERCERO':
                return 'warning';
            case 'CUARTO':
                return 'secondary';
            default:
                return 'success';
        }
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

    assignValidation() {
        this.materiaTextoForm = this.formBuilder.group({
            mattexid: [''],
            tipoMateria: ['', [Validators.required]],
            tipoTexto: ['', [Validators.required]],
            mattexdescripcion: ['', [Validators.required]],
            mattexestado: ['', [Validators.required]],
        });
    }

    assign() {
        this.materiaTextoForm.reset();
        this.assignDialog = true;
        this.assignBool = true;
    }

    modify(mattex: MateriaTexto) {
        this.materiatexto = {...mattex};
        this.assignDialog = true;
        this.assignBool = false;
        this.setBody();
    }

    setBody(){
        this.materiaTextoForm.patchValue({
            mattexid : this.materiatexto.mattexid,
            tipoMateria: new TipoMateria2(this.materiatexto.matid, this.materiatexto.matnombre),
            tipoTexto: new TipoTexto(this.materiatexto.texid, this.materiatexto.texnombre),
            mattexdescripcion: this.materiatexto.mattexdescripcion,
            mattexestado: this.materiatexto.mattexestado
        });
    }


    delete(mattex: MateriaTexto){
        this.materiatexto = {...mattex};
        this.deleteDialog = true;
    }

    confirmDeleteMateriaTexto(){
        this.spinner.show();
        this.materialService.deleteMateriaTexto(this.materiatexto.mattexid).subscribe({
            next: (result: any) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'La asignación de materia-texto fue eliminado correctamente.',
                });
                this.getListMateriaTexto();
                this.deleteDialog = false;
                this.spinner.hide();
            },
            error: (error: any) => {
                this.messageService.add({
                    severity: 'error',
                    summary: '¡Error!',
                    detail: 'No se pudo eliminar la asignación.',
                });
                this.deleteDialog = false;
                this.spinner.hide();
            },
        });
    }

    getListTipoMateria() {
        this.materialService.getMateriaCombo().subscribe({
            next: (result: any) => {
                this.tipoMateria = result;
            },
            error: (error: any) => {
                console.error(error);
            },
        });
    }

    getListTipoTexto() {
        this.materialService.getTextoCombo().subscribe({
            next: (result: any) => {
                this.tipoTexto = result;
            },
            error: (error: any) => {
                console.error(error);
            },
        });
    }

    getBody() {
        // Crear una nueva lista de MateriaTexto
        const materiaTextos: MateriaTexto[] = [];

        // Obtener los valores del formulario
        const tipoMateria = this.materiaTextoForm.value.tipoMateria;
        const tipoTexto = this.materiaTextoForm.value.tipoTexto;
        const mattexdescripcion = this.materiaTextoForm.value.mattexdescripcion;
        const mattexestado = this.materiaTextoForm.value.mattexestado;

        // Crear un nuevo objeto MateriaTexto para cada texto asignado
        tipoTexto.forEach((texto: TipoTexto) => {
            const materiaTexto: MateriaTexto = {
                mattexid: null,
                matid: tipoMateria.matid,
                matnombre: null,
                texid: texto.texid,
                texnombre: null,
                textipo: null,
                texdocumento: null,
                mattexdescripcion: mattexdescripcion,
                mattexusureg: this.usuario.usuname,
                mattexusumod: this.usuario.usuname,
                mattexfecreg: null,
                mattexfecmod: null,
                mattexestado: mattexestado,
                tipo: null,
            };
            // Agregar el objeto a la lista
            materiaTextos.push(materiaTexto);
        });

        // Devolver la lista de objetos MateriaTexto
        return materiaTextos;
    }

    saveAssign() {
        if (this.materiaTextoForm.invalid) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error en el Registro',
                detail: 'Por favor, verifica la información ingresada e intenta nuevamente.',
                life: 3000,
            });
            Object.values(this.materiaTextoForm.controls).forEach((control) => {
                control.markAllAsTouched();
                control.markAsDirty();
            });
            return;
        }

        if (this.assignBool) {
            const materiaTextos = this.getBody();
            // Crear un array de observables para cada solicitud de inserción
            const observables = materiaTextos.map((materiaTexto) => {
                return this.materialService.createMateriaTexto(materiaTexto);
            });

            // Ejecutar todas las solicitudes de inserción y esperar a que se completen
            this.spinner.show();
            forkJoin(observables).subscribe({
                next: (results: any[]) => {
                    // Todas las solicitudes se completaron exitosamente
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Exito',
                        detail: 'Material Asignado Correctamente',
                        life: 3000,
                    });
                    this.getListMateriaTexto();
                    this.assignDialog = false;
                    this.assignBool = false;
                    this.materiaTextoForm.reset();
                    this.spinner.hide();
                },
                error: (error) => {
                    console.error('error: ', error);
                    // let errorMessage = 'Se produjo un error al intentar registrar el material.';
                    // Verifica si el error contiene el mensaje específico de violación de clave única
                    if (error.error.message.includes('UniqueViolation')) {
                        const errorMessage =
                            'No se puede insertar el material porque ya existe.';
                        this.messageService.add({
                            severity: 'warn',
                            summary: 'Error en asignación.',
                            detail: errorMessage,
                            life: 7000,
                        });
                    }
                    this.materiaTextoForm.reset();
                    this.getListMateriaTexto();
                    this.assignDialog = false;
                    this.assignBool = false;
                    this.spinner.hide();
                }
            });
        }
        if (!this.assignBool) {
            const materiatextoData: FormData = new FormData();
            materiatextoData.append('mattexid', this.materiaTextoForm.value.mattexid);
            materiatextoData.append('matid', this.materiaTextoForm.value.tipoMateria.matid);
            materiatextoData.append('texid', this.materiaTextoForm.value.tipoTexto.texid);
            materiatextoData.append('mattexdescripcion', this.materiaTextoForm.value.mattexdescripcion);
            materiatextoData.append('mattexusumod', this.usuario.usuname);
            materiatextoData.append('mattexestado', this.materiaTextoForm.value.mattexestado);

            this.spinner.show();
            this.materialService.updateMateriaTexto(this.materiaTextoForm.value.mattexid, materiatextoData).subscribe({
                next: (result: any) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Asignación modificada exixitosamente',
                    });
                    this.getListMateriaTexto();
                    this.hideDialog();
                    this.spinner.hide();
                    this.assignDialog = false;
                },
                error: (error: any) => {
                    if (error.error.message?.includes('UniqueViolation')) {
                        const errorMessage = 'No se puede modificar, porque ya existe el registro.';
                        this.messageService.add({
                            severity: 'error',
                            summary: 'El registro ya existe.',
                            detail: errorMessage,
                            life: 7000}
                        );
                        this.spinner.hide();
                        return;
                    }
                    this.messageService.add({
                        severity: 'error',
                        summary: '¡Error!',
                        detail: 'No se pudo registrar el texto.',
                    });
                    this.spinner.hide();
                }
            });

        }
    }

    hideDialog() {
        this.assignDialog = false;
        this.materiaTextoForm.reset();
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }

    exportPdf() {
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default('l', 'pt', 'a4');

                // Título centrado
                const title =
                    'Lista de Material de Apoyo (Textos) Asignados por Materia';
                const titleFontSize = 16;
                const titleWidth =
                    (doc.getStringUnitWidth(title) * titleFontSize) /
                    doc.internal.scaleFactor;
                const titleX =
                    (doc.internal.pageSize.getWidth() - titleWidth) / 2;
                const titleY = 60;
                doc.setFontSize(titleFontSize);
                doc.text(title, titleX, titleY);

                // Subtítulo
                const subtitle =
                    'Esta lista representa los textos asignados por materia';
                const subtitleFontSize = 9;
                const subtitleX = 20;
                const subtitleY = 80;
                doc.setFontSize(subtitleFontSize);
                doc.text(subtitle, subtitleX, subtitleY);

                // Descripción
                const description =
                    'Sistema de Seguimiento y Gestión Académico';
                const descriptionFontSize = 10;
                const descriptionX = 100;
                const descriptionY = 40;
                doc.setFontSize(descriptionFontSize);
                doc.text(description, descriptionX, descriptionY);

                const description2 =
                    'Instituto Biblico de Capacitación Internacional';
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
                doc.addImage(
                    base64Image,
                    'PNG',
                    imageX,
                    imageY,
                    imageWidth,
                    imageHeight
                );

                // Tabla de datos
                (doc as any).autoTable({
                    columns: this.exportColumns,
                    body: this.listMateriaTextoDuplicated,
                    theme: 'striped',
                    styles: { fontSize: 8, cellPadding: 3 },
                    startY: 100, // Posición inicial de la tabla
                });

                doc.save('lista_asignacion_texto_materia.pdf');
            });
        });
    }

    isTextoPDF(documento: string): boolean {
        return documento.split('.').pop()?.toLowerCase() === 'pdf';
    }

    viewDocumentText(pagarchivo: any) {
        this.materialService.getFileTexto(pagarchivo);
    }

    getDownloadLink(documento: string): string {
        return `${API_URL_FILES_TEXTOS}/${documento}`;
    }
}

