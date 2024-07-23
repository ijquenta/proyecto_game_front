import { MaterialService } from 'src/app/modules/service/data/material.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AutoComplete } from 'primeng/autocomplete';
import { Table } from 'primeng/table';
import { NotaService } from 'src/app/modules/service/data/nota.service';
import { AuthService } from 'src/app/modules/service/core/auth.service';
import { Nota } from 'src/app/modules/models/nota';
import { Inscripcion } from 'src/app/modules/models/inscripcion';
import { Usuario } from 'src/app/modules/models/usuario';
import { CursoMateria } from 'src/app/modules/models/curso';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import { MateriaTexto } from 'src/app/modules/models/materiaTexto';
// --------------- Importación para validaciones
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import * as FileSaver from 'file-saver';
import { TipoMateria2, TipoTexto } from 'src/app/modules/models/diccionario';
import { DiccionarioService } from 'src/app/modules/service/data/diccionario.service';
import { forkJoin } from 'rxjs';
import logoIbciBase64 from '../../../../../assets/base64/logo_ibci_base64.js';

interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}

@Component({
    templateUrl: './material-asignar.component.html',
    styleUrls: ['../../../../app.component.css']
})

export class MaterialAsignarComponent implements OnInit {

    @ViewChild('dtexc') dtexc: Table | undefined;
    @ViewChild('autocomplete') autocomplete: AutoComplete | undefined;

    listaMateriaTexto: MateriaTexto[] = [];
    listaMateriaTextoDuplicated: MateriaTexto[] = [];
    materiaTexto: MateriaTexto[] = [];
    asignarDialog: boolean = false;
    asignarBool: boolean = false;
    //----------------Variables para validación----------------//
    materiaTextoForm: FormGroup;
    tipoMateria: TipoMateria2[] = [];
    tipoTexto: TipoTexto[] = [];

    criterio: any = '';
    loading: boolean = false;
    loading2: boolean = false;
    listarMateriasInscritas: CursoMateria[] = [];
    listarNotaEstudianteMateria: Nota[] = [];
    listarNotaEstudianteCurso: Nota[] = [];
    notaEstudiante = new Inscripcion();
    nota = new Nota();
    notaEstudianteMateria = new Nota();
    verNotasClicked: boolean = false;
    errors: any;
    usuario: Usuario;
    verMateriaClicked: boolean = false;
    notaRegistroDialog: boolean = false;
    optionNota: boolean = false;
    nota1: any;
    nota2: any;
    nota3: any;
    notafinal: any;
    curmatid: any;
    userProfilePhoto = environment.API_URL_PROFILE_PHOTO;

    colsTable!: Column[];
    exportColumns!: ExportColumn[];
    constructor(
        private messageService: MessageService,
        private notaService: NotaService,
        private authService: AuthService,
        private spinner: NgxSpinnerService,
        private materialService: MaterialService,
        private formBuilder: FormBuilder, // formBuilder para utilzar las validaciones del react form valid
        private diccionarioService: DiccionarioService
    ) {
    }
    ngOnInit(): void {
        this.verMateriaClicked = true;
        this.authService.usuario$.subscribe((user => {
            if (user && Array.isArray(user) && user.length > 0) {
                this.usuario = user[0];
            }
        }));
        this.listarMateriasTextos();
        this.asignacionValidacionesCurso()
        this.obtenerTipoMateria();
        this.obtenerTipoTexto();

        this.colsTable = [
            { field: 'mattexid', header: 'ID' },
            { field: 'matnombre', header: 'Nombre de materia' },
            { field: 'texnombre', header: 'Nombre del texto' },
            { field: 'textipo', header: 'Tipo' },
            { field: 'texdocumento', header: 'Documento' },
            { field: 'mattexdescripcion', header: 'Descripción' },
            { field: 'mattexusureg', header: 'Usuario Registro' },
            { field: 'mattexfecreg', header: 'Fecha Registro' },
            { field: 'mattexusumod', header: 'Usuario Modificación' },
            { field: 'mattexfecmod', header: 'Fecha Modificación' }
        ];

        this.exportColumns = this.colsTable.map((col) => ({ title: col.header, dataKey: col.field }));
    }
    listarMateriasTextos() {
        this.spinner.show();
        this.loading = true;
        this.materialService.listarMateriaTexto().subscribe(
            (result: any) => {
                this.listaMateriaTexto = result as MateriaTexto[];
                this.listaMateriaTextoDuplicated = result as MateriaTexto[];
                this.loading = false;
                this.spinner.hide();
            },
            (error: any) => {
                this.errors = error;
                console.log("error", error);
                this.messageService.add({severity: 'warn', summary: 'Error', detail: 'Algo salió mal!'});
            }
        );

    }
    verDocumentoTexto(pagarchivo: any){
        this.materialService.getFileTexto(pagarchivo);
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
    asignar(){
        this.materiaTextoForm.reset();
        this.asignarDialog = true;
        this.asignarBool = true;
    }
    modificar(){
        this.asignarDialog = true;
        this.asignarBool = false;
    }
    // Método para asignar las variables de React Form Valid
    asignacionValidacionesCurso() {
        this.materiaTextoForm = this.formBuilder.group({
            mattexid: [''],
            tipoMateria: ['', [Validators.required]],
            tipoTexto: ['', [Validators.required]],
            mattexdescripcion: ['', [Validators.required]]
        });
    }
    obtenerTipoMateria(){
        this.diccionarioService.listaMateriaCombo2().subscribe(
            (result: any) => {
                this.tipoMateria = result;
            },
            (error: any) => {
                console.error(error);
            }

        )
    }

    obtenerTipoTexto(){
        this.diccionarioService.listarTextoCombo().subscribe(
            (result: any) => {
                this.tipoTexto = result;
            },
            (error: any) => {
                console.error(error);
            }
        )
    }
    obtenerBody() {
        const materiaTextos: MateriaTexto[] = []; // Crear una nueva lista de MateriaTexto

        // Obtener los valores del formulario
        const tipoMateria = this.materiaTextoForm.value.tipoMateria;
        const tipoTexto = this.materiaTextoForm.value.tipoTexto;
        const mattexdescripcion = this.materiaTextoForm.value.mattexdescripcion;

        // Crear un nuevo objeto MateriaTexto para cada texto asignado
        tipoTexto.forEach((texto: TipoTexto) => {
            const materiaTexto: MateriaTexto = {
                mattexid: null,
                matid: tipoMateria.matid,
                matnombre: tipoMateria.matnombre,
                texid: texto.texid,
                texnombre: texto.texnombre,
                textipo: null,
                texdocumento: null,
                mattexdescripcion: mattexdescripcion,
                mattexusureg: this.usuario.usuname,
                mattexusumod: this.usuario.usuname,
                mattexfecreg: null,
                mattexfecmod: null,
                mattexestado: 1,
                tipo: null
            };
            materiaTextos.push(materiaTexto); // Agregar el objeto a la lista
        });

        return materiaTextos; // Devolver la lista de objetos MateriaTexto
    }

    guardarAsignar() {
        if (this.materiaTextoForm.invalid) {
            this.messageService.add({ severity: 'error', summary: 'Error en el Registro', detail: 'Por favor, verifica la información ingresada e intenta nuevamente.', life: 3000 });
            Object.values(this.materiaTextoForm.controls).forEach(control => {
                control.markAllAsTouched();
                control.markAsDirty();
            });
            return;
        }

        if (this.asignarDialog) {
            const materiaTextos = this.obtenerBody();
            // console.log("materiaTextos:", materiaTextos);

            // Crear un array de observables para cada solicitud de inserción
            const observables = materiaTextos.map(materiaTexto => {
                return this.materialService.insertarMateriaTexto(materiaTexto);
            });

            // Ejecutar todas las solicitudes de inserción y esperar a que se completen
            forkJoin(observables).subscribe(
                (results: any[]) => {
                    // Todas las solicitudes se completaron exitosamente
                    this.messageService.add({ severity: 'success', summary: 'Exitosamente', detail: 'Material Agregado', life: 3000 });
                    this.listarMateriasTextos();
                    this.asignarDialog = false;
                    this.asignarBool = false;
                    this.materiaTextoForm.reset();
                },
                error => {
                    // console.log("error",error);
                    // const descripcionError = error.error.message;
                    //     this.messageService.add({severity:'warn', summary:'Error', detail: descripcionError, life: 5000});
                        console.log("error: ", error);
                        // let errorMessage = 'Se produjo un error al intentar registrar el material.';
                        // Verifica si el error contiene el mensaje específico de violación de clave única
                        if (error.error.message.includes('UniqueViolation')) {
                            const errorMessage = 'No se puede insertar el material porque ya se encuentra registrado.';
                            this.messageService.add({ severity: 'warn', summary: 'El registro ya exite.', detail: errorMessage, life: 7000});
                        }
                        this.materiaTextoForm.reset();
                        this.listarMateriasTextos();
                        this.asignarDialog = false;
                        this.asignarBool = false;
                    }
            );
        }

        // if (this.asignarBool) {
        //     this.materialService.insertarMateriaTexto(this.materiaTexto).subscribe(
        //         (result: any) => {
        //             this.messageService.add({ severity: 'success', summary: 'Exitosamente', detail: 'Material Agregado', life: 3000 });
        //             this.listarMateriasTextos();
        //             this.asignarDialog = false;
        //             this.asignarBool = false;
        //         },
        //         error => { console.log("error",error); this.messageService.add({severity:'warn', summary:'Error', detail:'Algo salio mal, al insertar el material'}); }
        //     );
        // }
        // else {
        //     this.materialService.insertarMateriaTexto(this.materiaTexto).subscribe(
        //         (result: any) => {
        //             this.messageService.add({ severity: 'success', summary: 'Exitosamente', detail: 'Material Modificado', life: 3000 });
        //             this.listarMateriasTextos();
        //             this.asignarDialog = false;
        //             this.asignarBool = false;
        //         },
        //         error => { console.log("error",error); this.messageService.add({severity:'warn', summary:'Error', detail:'Algo salio mal, al modificar la material'}); }
        //     );
        // }

    }

    ocultarDialog(){
        this.asignarDialog = false;
        this.materiaTextoForm.reset();
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }
    exportPdf() {
        import('jspdf').then(jsPDF => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default('l', 'pt', 'a4');

                // Título centrado
                const title = 'Lista de Material de Apoyo (Textos) Asignados por Materia';
                const titleFontSize = 16;
                const titleWidth = doc.getStringUnitWidth(title) * titleFontSize / doc.internal.scaleFactor;
                const titleX = (doc.internal.pageSize.getWidth() - titleWidth) / 2;
                const titleY = 60;
                doc.setFontSize(titleFontSize);
                doc.text(title, titleX, titleY);

                // Subtítulo
                const subtitle = 'Esta lista representa los textos asignados por materia';
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
                    body: this.listaMateriaTextoDuplicated,
                    theme: 'striped',
                    styles: { fontSize: 8, cellPadding: 3 },
                    startY: 100, // Posición inicial de la tabla
                });

                doc.save('lista_asignacion_textos_materias.pdf');
            });
        });
    }

}

