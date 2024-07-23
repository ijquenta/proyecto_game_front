import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AutoComplete } from 'primeng/autocomplete';
import { Table } from 'primeng/table';
import { Observable, forkJoin } from 'rxjs';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ReporteService } from 'src/app/modules/service/data/reporte.service';

import { NotaService } from 'src/app/modules/service/data/nota.service';
import { AuthService } from 'src/app/modules/service/core/auth.service';
import { Nota } from 'src/app/modules/models/nota';
import { Inscripcion } from 'src/app/modules/models/inscripcion';
import { Usuario } from 'src/app/modules/models/usuario';

import { CursoMateria } from 'src/app/modules/models/curso';

import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
@Component({
    templateUrl: './nota-crud.component.html',
    styleUrls: ['../../../../app.component.css']
})

export class NotaCrudComponent implements OnInit {

    @ViewChild('dtexc') dtexc: Table | undefined;
    @ViewChild('autocomplete') autocomplete: AutoComplete | undefined;

    // ------------- Datos Nota -------------

    criterio: any = '';
    loading: boolean = false;
    loading2: boolean = false;
    listarMateriasInscritas: CursoMateria[] = [];
    listarNotaEstudianteMateria: Nota[] = [];
    listarNotaEstudianteCurso: Nota[] = [];
    listarNotaEstudianteCursoRespaldo: Nota[] = [];
    notaEjemplo = new Nota;
    listarNotaEstudianteCursoImportar: Nota[] = [];
    notaEstudiante = new Inscripcion();
    nota = new Nota();
    notaEstudianteMateria = new Nota();
    verNotasClicked: boolean = false;
    errors: any;
    usuario: Usuario;
    verMateriaClicked: boolean = false;
    notaRegistroDialog: boolean = false;
    optionNota: boolean = false;
    nota1: number;
    nota2: number;
    nota3: number;
    notafinal: number;
    curmatid: any;
    curnombre: any;
    matnombre: any;
    insid: any
    userProfilePhoto = environment.API_URL_PROFILE_PHOTO;
    nota_recuperada: Nota[] = [];
    nota_recuperada_datos: any;
    notasImportadas: boolean = false;

    constructor(
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private dialogService: DialogService,
        private reporteService: ReporteService,
        private notaService: NotaService,
        private authService: AuthService,
        private spinner: NgxSpinnerService,
    ) { }

    ngOnInit(): void {
        this.verMateriaClicked = true;
        this.obtenerDatosUsuario();
        this.listarCursosMaterias();

        this.notaEjemplo.pernomcompleto = "Apellido Paterno Apellido Materno Nombres";
        this.notaEjemplo.pernrodoc = "9973412";
        this.notaEjemplo.not1=100;
        this.notaEjemplo.not2=100;
        this.notaEjemplo.not3=100;
        this.notaEjemplo.notfinal=100;
        this.listarNotaEstudianteCursoImportar.push(this.notaEjemplo)
        console.log("notas ejemplos: ", this.listarNotaEstudianteCursoImportar)
    }

    rptnotaMateria(){
        console.log("curmatid", this.curmatid)
        const criterio = {
            curmatid: this.curmatid
        }
        this.notaService.rptNotaCursoMateria(criterio)
    }

    obtenerDatosUsuario(){
        this.authService.usuario$.subscribe((user => {
            if (user && Array.isArray(user) && user.length > 0) {
                this.usuario = user[0];
            }
        }));
    }

    listarCursosMaterias() {
        this.spinner.show();
        this.loading = true;
        this.notaService.listarNotaCurso().subscribe(
            (result: any) => {
                this.listarMateriasInscritas = result as CursoMateria[];
                this.loading = false;
                this.spinner.hide();
            },
            (error: any) => {
                this.errors = error;
                this.loading = false
                this.spinner.hide();;
                console.log("error", error);
                this.messageService.add({ severity: 'warn', summary: 'Error', detail: 'Algo salió mal!' });
            }
        );

    }

    listarNotaMateria(data: CursoMateria) {
        this.loading2 = true;
        this.verNotasClicked = true;
        this.curmatid = data.curmatid;
        this.curnombre = data.curnombre;
        this.matnombre = data.matnombre;
        const criterio = {
            curmatid: data.curmatid,
        }
        this.listarNotas(criterio);
    }

    listarNotas(criterio: any) {
        this.notaService.listarNotaEstudianteCurso(criterio).subscribe((result: any) => {
            this.listarNotaEstudianteCurso = result as Nota[];
            this.listarNotaEstudianteCursoRespaldo = this.listarNotaEstudianteCurso;
            console.log("lista de notas respaldo: ", this.listarNotaEstudianteCursoRespaldo)
            this.loading2 = false;
        },
            error => {
                this.errors = error;
                console.log("error", error);
                this.messageService.add({ severity: 'warn', summary: 'Error', detail: 'Algo salio mal!' });
            });
    }

    addNota(data: any) {
        this.nota = { ...data };
        this.optionNota = true;
        this.notaRegistroDialog = true;
        this.calcularNotaFinal();
    }

    updateNota(data: Nota) {
        this.optionNota = false;
        this.nota = { ...data };
        this.notaRegistroDialog = true;
        this.calcularNotaFinal();
    }
    calcularNotaFinal() {
        console.log('Notas antes de filtrar:', this.nota.not1, this.nota.not2, this.nota.not3);
        const notas = [this.nota.not1, this.nota.not2, this.nota.not3].filter(nota => nota !== null && nota !== undefined && nota !== 0);
        console.log('Notas después de filtrar:', notas);
        this.nota.notfinal = notas.length > 0 ? notas.reduce((a, b) => a + b, 0) / notas.length : 0;
        console.log('Nota final calculada:', this.nota.notfinal);
        return this.nota;
    }
    hideDialog() {
        this.notaRegistroDialog = false;
        this.nota1 = 0;
        this.nota2 = 0;
        this.nota3 = 0;
        this.notafinal = 0;
    }
    registrarNota() {
        this.nota.notusureg = this.usuario.usuname;
        this.nota.notusumod = this.usuario.usuname;
        this.nota.notestado = 1;
        this.nota.tipo = this.optionNota ? 1 : 2;
        this.calcularNotaFinal();
        this.loading2 = true;
        this.notaService.gestionarNota(this.nota).subscribe(
            (result: any) => {
                this.notaRegistroDialog = false;
                this.nota = new Nota();
                const notas = 0;
                const criterio = { curmatid: this.curmatid };
                this.loading2 = false;
                this.listarNotas(criterio);
                this.messageService.add({ severity: this.optionNota ? 'info' : 'success', summary: 'Correcto', detail: this.optionNota ? 'Nota registrada.' : 'Nota modificada.' });
            },
            error => {
                this.errors = error;
                console.log("error", error);
                this.messageService.add({ severity: 'warn', summary: 'Error', detail: 'Algo salió mal!' });
            }
        );
    }
    // Método de busqueda en la tabla
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

    // Funciones para descargar y importar excel
    exportExcel() {
        import('xlsx').then((xlsx) => {
            const fieldsToExport = [
                'insid',
                'pernomcompleto',
                'pernrodoc',
                'not1',
                'not2',
                'not3',
                'notfinal',
            ];
            const dataToExport = this.listarNotaEstudianteCursoRespaldo.map(curso_materia => {
                const filteredData = {};
                fieldsToExport.forEach(field => {
                    filteredData[field] = curso_materia[field] || ''; // Asegura que todos los campos existan, incluso si están vacíos
                });
                return filteredData;
            });
            const worksheet = xlsx.utils.json_to_sheet(dataToExport);
            const workbook = { Sheets: { 'Data': worksheet }, SheetNames: ['Data'] };
            const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
            this.saveAsExcelFile(excelBuffer, 'lista_curso_materia');
        });
    }
    exportExcelModel() {
        import('xlsx').then((xlsx) => {
            const fieldsToExport = [
                'insid',
                'peridestudiante',
                'pernomcompleto',
                'pernrodoc',
                'not1',
                'not2',
                'not3',
                'notfinal',
            ];
            const dataToExport = this.listarNotaEstudianteCursoImportar.map(nota_importada => {
                const filteredData = {};
                fieldsToExport.forEach(field => {
                    filteredData[field] = nota_importada[field] || ''; // Asegura que todos los campos existan, incluso si están vacíos
                });
                return filteredData;
            });
            const worksheet = xlsx.utils.json_to_sheet(dataToExport);
            const workbook = { Sheets: { 'Data': worksheet }, SheetNames: ['Data'] };
            const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
            this.saveAsExcelFile(excelBuffer, 'modelo_notas');
        });
    }
    saveAsExcelFile(buffer: any, fileName: string): void { // Método para guardar en un archivo excel
        let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        let EXCEL_EXTENSION = '.xlsx';
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE
        });
        FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
    }
    onFileChange(event: any) {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (e: any) => {
          try {
            const workbook = XLSX.read(e.target.result, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            this.nota_recuperada_datos = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            // Transformar los datos a un formato deseado y contar la cantidad de registros
            this.nota_recuperada = this.nota_recuperada_datos.slice(1).map((row: any) => {
              return {
                insid: row[0],
                pernomcompleto: row[1],
                pernrodoc: row[2],
                not1: row[3] || 0,
                not2: row[4] || 0,
                not3: row[5] || 0,
                notfinal: row[6] || 0
              };
            });

            const cantidadRegistros = this.nota_recuperada.length;

            this.notasImportadas = true;
            console.log("Cantidad de registros subidos correctamente:", cantidadRegistros);
            console.log("lista de notas a insertar : ", this.nota_recuperada)

            this.messageService.add({ severity: 'success', summary: 'Subido correctamente', detail: `Se subieron ${cantidadRegistros} registros correctamente`, life: 5000 });
          } catch (error) {
            console.error("Error al recuperar los datos del archivo:", error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Hubo un error al recuperar los datos del archivo' });
          }
        };

        reader.readAsBinaryString(file);
    }

    abrirModalNotaSubir(){
        this.notasImportadas = true;
    }

    subirNotas(notas_a_subir: Nota[]) {
        // Arreglo para almacenar las notas subidas correctamente
        const notasSubidas: Nota[] = [];

        // Contador para llevar el registro de las notas que no pudieron ser subidas
        let notasNoSubidasCount = 0;

        // Iterar sobre cada nota en el array
        notas_a_subir.forEach(nota => {
            // console.log("Nota antes de importar: ", nota);

            // Establecer propiedades de la nota
            nota.notusureg = this.usuario.usuname;
            nota.notusumod = this.usuario.usuname;
            nota.notid = null;
            nota.notestado = 1;
            nota.tipo = 1;

            // Realizar la solicitud de subida de la nota
            this.loading2 = true;
            this.notaService.gestionarNota(nota).subscribe(
                (result: any) => {
                    // Manejar la respuesta satisfactoria
                    this.loading2 = false;
                    this.notasImportadas = false;
                    notasSubidas.push(nota); // Agregar la nota a las notas subidas correctamente
                    this.listarNotas({ curmatid: this.curmatid });
                },
                error => {
                    // Manejar errores
                    this.errors = error;
                    this.loading2 = false;
                    notasNoSubidasCount++; // Incrementar el contador de notas no subidas
                    console.log("Error", error);
                }
            );
        });

        // Limpiar el diálogo de registro de notas y actualizar la lista de notas
        // this.notaRegistroDialog = false;

        console.log("cantidad de errores", notasNoSubidasCount)
        // Mostrar mensaje con el resultado de la subida de notas
        if (notasNoSubidasCount > 0) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: `No se pudieron subir ${notasNoSubidasCount} notas.` });
        } else {
            const message = `Se han subido ${notasSubidas.length} notas correctamente.`;
            this.messageService.add({ severity: 'info', summary: 'Notas subidas correctamente', detail: message });
        }
    }
    hideSubirNota(){
        this.notasImportadas = false
        this.nota_recuperada = null;
    }





}

