// Angular Core
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// PrimeNG Components and Services
import { MenuItem, MessageService } from 'primeng/api';
import { AutoComplete } from 'primeng/autocomplete';
import { Table } from 'primeng/table';

// RxJS
import { catchError, forkJoin, of, tap } from 'rxjs';

// Third-party Libraries
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { NgxSpinnerService } from 'ngx-spinner';

// Environment
import { environment } from 'src/environments/environment';

// Application Models
import { Nota } from 'src/app/modules/models/nota';
import { Inscripcion } from 'src/app/modules/models/inscripcion';
import { Usuario } from 'src/app/modules/models/usuario';
import { CursoMateria } from 'src/app/modules/models/curso';
import { TipoPersona2 } from 'src/app/modules/models/diccionario';

// Application Services
import { NotaService } from 'src/app/modules/service/data/nota.service';
import { AuthService } from 'src/app/modules/service/core/auth.service';
import { UsuarioService } from 'src/app/modules/service/data/usuario.service';

// Interface
interface ColumsTable {
    field: string;
    header: string;
}

@Component({
    templateUrl: './nota-docente.component.html',
    styleUrls: ['../../../../app.component.css'],
})
export class NotaDocenteComponent implements OnInit {
    // ViewChild
    @ViewChild('dtexc') dtexc: Table | undefined;
    @ViewChild('autocomplete') autocomplete: AutoComplete | undefined;

    // ------------- Datos Nota -------------
    criterio: any = '';
    loading: boolean = false;
    loading2: boolean = false;

    // Listas de datos
    listarMateriasInscritas: CursoMateria[] = [];
    listarNotaEstudianteMateria: Nota[] = [];
    listarNotaEstudianteCurso: Nota[] = [];
    listarNotaEstudianteCursoRespaldo: Nota[] = [];
    listarNotaEstudianteCursoImportar: Nota[] = [];
    nota_recuperada: Nota[] = [];

    // Objetos de Nota e Inscripción
    notaEjemplo = new Nota();
    notaEstudiante = new Inscripcion();
    nota = new Nota();
    notaEstudianteMateria = new Nota();

    // Variables booleanas de control
    verNotasClicked: boolean = false;
    verMateriaClicked: boolean = false;
    notaRegistroDialog: boolean = false;
    optionNota: boolean = false;
    notasImportadas: boolean = false;

    // Variables para manejar errores y datos adicionales
    errors: any;
    usuario: Usuario;
    nota_recuperada_datos: any;
    curmatid: any;
    curnombre: any;
    matnombre: any;
    insid: any;

    // Variables de notas individuales
    nota1: number;
    nota2: number;
    nota3: number;
    notafinal: number;

    // Variables relacionadas con el entorno
    userProfilePhoto = environment.API_URL_PROFILE_PHOTO;

    // MenuItems
    items: MenuItem[] | undefined;
    home: MenuItem | undefined;

    // Columnas de la tabla
    selectedColumns: { field: string; header: string }[];
    colsColumsTable!: ColumsTable[];

    // Opciones
    personOptions: TipoPersona2[] = [];
    statusOptions = [
        { label: 'Activo', value: 1 },
        { label: 'Inactivo', value: 0 },
    ];

    // Formulario de notas
    notaForm: FormGroup;

    // Variables privadas
    private rowIndexCounters: { [key: string]: number } = {};
    private currentCourse: number | undefined;

    constructor(
        private messageService: MessageService,
        private formBuilder: FormBuilder,
        private notaService: NotaService,
        private authService: AuthService,
        private spinner: NgxSpinnerService,
        private usuarioService: UsuarioService
    ) {
        this.items = [
            { label: 'Nota' },
            { label: 'Asignar Notas', routerLink: '' },
        ];
        this.home = { icon: 'pi pi-home', routerLink: '/' };

        this.colsColumsTable = [
            { field: 'curnombre', header: 'Curso' },
            { field: 'matnombre', header: 'Materia' },
            { field: 'curmatfecfin', header: 'Fecha Fin' },
            { field: 'curmatfecini', header: 'Fecha Inicio' },
            { field: 'curmatdescripcion', header: 'Descripción' },
            { field: 'num_estudiantes', header: 'N° Estudiantes' },
            { field: 'curmatusureg', header: 'Usuario Registrado' },
            { field: 'curmatusumod', header: 'Usuario Modificado' },
            { field: 'curmatestado', header: 'Estado' },
        ];

        this.selectedColumns = [
            { field: 'matnombre', header: 'Materia' },
            { field: 'curmatfecini', header: 'Fecha Inicio' },
            { field: 'curmatfecfin', header: 'Fecha Fin' },
            { field: 'num_estudiantes', header: 'N° Estudiantes' },
            { field: 'curmatestado', header: 'Estado' },
        ];

        this.notaForm = this.formBuilder.group({
            not1: [
                0,
                [Validators.required, Validators.min(0), Validators.max(100)],
            ],
            not2: [
                0,
                [Validators.required, Validators.min(0), Validators.max(100)],
            ],
            not3: [
                0,
                [Validators.required, Validators.min(0), Validators.max(100)],
            ],
            notfinal: [0, [Validators.min(0), Validators.max(100)]],
        });
    }
    ngOnInit(): void {
        this.verMateriaClicked = true;
        this.authService.usuario$.subscribe((user) => {
            if (user && Array.isArray(user) && user.length > 0) {
                this.usuario = user[0];
                const criterio = {
                    perid: this.usuario.perid,
                };
                this.notaService.listarNotaDocente(criterio).subscribe(
                    (result: any) => {
                        this.listarMateriasInscritas = result as CursoMateria[];
                        console.log('lista', this.listarMateriasInscritas);
                        // this.messageService.add({severity: 'info', summary: 'Correcto', detail: 'Información obtenida'});
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

    rptnotaMateria() {
        const criterio = {
            curmatid: this.curmatid,
        };
        this.notaService.rptNotaCursoMateria(criterio);
    }

    getUserData() {
        this.authService.usuario$.subscribe((user) => {
            if (user && Array.isArray(user) && user.length > 0) {
                this.usuario = user[0];
            }
        });
    }

    listarCursosMaterias() {
        this.spinner.show();
        this.loading = true;
        this.notaService.listarNotaCurso().subscribe({
            next: (result: any) => {
                this.listarMateriasInscritas = result as CursoMateria[];
                this.loading = false;
                this.spinner.hide();
            },
            error: (error: any) => {
                this.errors = error;
                this.loading = false;
                this.spinner.hide();
                console.error('error', error);
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Error',
                    detail: 'Algo salió mal!',
                });
            },
        });
    }

    listarNotaMateria(data: CursoMateria) {
        this.loading2 = true;
        this.verNotasClicked = true;
        this.curmatid = data.curmatid;
        this.curnombre = data.curnombre;
        this.matnombre = data.matnombre;
        const criterio = {
            curmatid: data.curmatid,
        };
        this.listarNotas(criterio);
    }

    listarNotas(criterio: any) {
        this.notaService.listarNotaEstudianteCurso(criterio).subscribe(
            (result: any) => {
                this.listarNotaEstudianteCurso = result as Nota[];
                this.listarNotaEstudianteCursoRespaldo =
                    this.listarNotaEstudianteCurso;
                this.loading2 = false;
            },
            (error) => {
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

    /**
     * Método que se ejecuta al añadir una nueva nota.
     * @param data - Datos de la nota a registrar.
     */
    addNota(data: any) {
        this.nota1 = 0;
        this.nota2 = 0;
        this.nota3 = 0;
        this.notafinal = 0;
        this.notaForm.reset();
        this.nota = { ...data };
        this.optionNota = true;
        this.notaRegistroDialog = true;
        this.calcularNotaFinal();
    }

    /**
     * Método que se ejecuta al actualizar una nota existente.
     * @param data - Objeto Nota que contiene los datos a actualizar.
     */
    updateNota(data: Nota) {
        this.nota = new Nota();
        this.notaForm.reset();
        this.optionNota = false;
        this.nota = { ...data };

        // Actualiza los valores del formulario con los datos de la nota
        this.notaForm.patchValue({
            not1: this.nota.not1,
            not2: this.nota.not2,
            not3: this.nota.not3,
            notfinal: this.nota.notfinal,
        });

        this.notaRegistroDialog = true;
        this.calcularNotaFinal();
    }

    /**
     * Método para calcular la nota final promediando las tres notas (not1, not2, not3).
     * Si una o más notas no están presentes o son 0, no se incluyen en el cálculo.
     */
    calcularNotaFinal() {
        // Convertir los valores de las notas a números
        const not1 = parseFloat(this.notaForm.value.not1) || 0;
        const not2 = parseFloat(this.notaForm.value.not2) || 0;
        const not3 = parseFloat(this.notaForm.value.not3) || 0;

        // Crear un array con las notas y filtrar las que son mayores que 0
        const notasValidas = [not1, not2, not3].filter((nota) => nota > 0);

        // Calcular el promedio de las notas válidas y asignarlo a notfinal, con dos decimales
        if (notasValidas.length > 0) {
            const sumaNotas = notasValidas.reduce((a, b) => a + b, 0);
            this.nota.notfinal = parseFloat(
                (sumaNotas / notasValidas.length).toFixed(2)
            );
        } else {
            this.nota.notfinal = 0;
        }
        return this.nota;
    }

    /**
     * Método para registrar o actualizar la nota en la base de datos.
     * Verifica si el formulario es válido antes de intentar registrar la nota.
     */
    registrarNota() {
        if (this.notaForm.invalid) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error en el Registro',
                detail: 'Por favor, verifica la información ingresada e intenta nuevamente.',
                life: 3000,
            });
            return Object.values(this.notaForm.controls).forEach((control) => {
                control.markAllAsTouched();
                control.markAsDirty();
            });
        }

        // Asignación de valores adicionales antes de guardar
        this.nota.notusureg = this.usuario.usuname;
        this.nota.notusumod = this.usuario.usuname;
        this.nota.notestado = 1;
        this.nota.tipo = this.optionNota ? 1 : 2;

        // Recalcula la nota final antes de guardar
        this.calcularNotaFinal();

        this.loading2 = true;

        this.nota.not1 = this.notaForm.value.not1;
        this.nota.not2 = this.notaForm.value.not2;
        this.nota.not3 = this.notaForm.value.not3;

        // Llama al servicio para registrar o actualizar la nota
        this.notaService.gestionarNota(this.nota).subscribe({
            next: (result: any) => {
                this.notaRegistroDialog = false;
                this.nota = new Nota();
                const criterio = { curmatid: this.curmatid };
                this.loading2 = false;
                this.listarNotas(criterio);
                this.messageService.add({
                    severity: this.optionNota ? 'info' : 'success',
                    summary: 'Correcto',
                    detail: this.optionNota
                        ? 'Nota registrada.'
                        : 'Nota modificada.',
                });
            },
            error: (error) => {
                this.errors = error;
                console.error('error', error);
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Error',
                    detail: 'Algo salió mal!',
                });
            },
        });
    }

    hideDialog() {
        this.notaRegistroDialog = false;
        this.nota1 = 0;
        this.nota2 = 0;
        this.nota3 = 0;
        this.notafinal = 0;
        this.notaForm.reset();
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
                return 'En curso';
            case 0:
                return 'Terminado';
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
            const dataToExport = this.listarNotaEstudianteCursoRespaldo.map(
                (curso_materia) => {
                    const filteredData = {};
                    fieldsToExport.forEach((field) => {
                        filteredData[field] = curso_materia[field] || ''; // Asegura que todos los campos existan, incluso si están vacíos
                    });
                    return filteredData;
                }
            );
            const worksheet = xlsx.utils.json_to_sheet(dataToExport);
            const workbook = {
                Sheets: { Data: worksheet },
                SheetNames: ['Data'],
            };
            const excelBuffer: any = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array',
            });
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
            const dataToExport = this.listarNotaEstudianteCursoImportar.map(
                (nota_importada) => {
                    const filteredData = {};
                    fieldsToExport.forEach((field) => {
                        filteredData[field] = nota_importada[field] || ''; // Asegura que todos los campos existan, incluso si están vacíos
                    });
                    return filteredData;
                }
            );
            const worksheet = xlsx.utils.json_to_sheet(dataToExport);
            const workbook = {
                Sheets: { Data: worksheet },
                SheetNames: ['Data'],
            };
            const excelBuffer: any = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array',
            });
            this.saveAsExcelFile(excelBuffer, 'modelo_notas');
        });
    }

    saveAsExcelFile(buffer: any, fileName: string): void {
        // Método para guardar en un archivo excel
        let EXCEL_TYPE =
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        let EXCEL_EXTENSION = '.xlsx';
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE,
        });
        FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
    }

    /**
     * Maneja el evento de cambio de archivo para procesar y extraer datos de un archivo Excel.
     * @param {any} event - El evento que contiene la información del archivo seleccionado.
     */
    onFileChange(event: any) {
        // Obtener el primer archivo del evento
        const file = event.files[0];

        // Verificar que se ha seleccionado un archivo y que es de tipo Excel
        if (file && this.isExcelFile(file)) {
            const reader = new FileReader();

            /**
             * Procesa el archivo una vez que se ha leído completamente.
             * @param {any} e - El evento de carga del archivo que contiene los datos leídos.
             */
            reader.onload = (e: any) => {
                try {
                    // Obtener los datos en ArrayBuffer del archivo cargado
                    const arrayBuffer = e.target.result;

                    // Leer los datos de Excel utilizando XLSX
                    const workbook = XLSX.read(new Uint8Array(arrayBuffer), {
                        type: 'array',
                    });

                    // Obtener el nombre de la primera hoja en el archivo
                    const sheetName = workbook.SheetNames[0];

                    // Obtener la hoja correspondiente al nombre obtenido
                    const sheet = workbook.Sheets[sheetName];

                    // Convertir la hoja en un JSON basado en la estructura de la hoja (matriz bidimensional)
                    this.nota_recuperada_datos = XLSX.utils.sheet_to_json(
                        sheet,
                        { header: 1 }
                    );

                    // Verificar si se han recuperado datos válidos
                    if (
                        this.nota_recuperada_datos &&
                        this.nota_recuperada_datos.length > 1
                    ) {
                        // Transformar los datos a un formato deseado y verificar que las filas estén completas
                        this.nota_recuperada = this.nota_recuperada_datos
                            .slice(1)
                            .map((row: any) => {
                                // Asegurar que la fila no sea nula y tenga el número esperado de columnas
                                if (row && row.length >= 7) {
                                    return {
                                        insid: row[0] || null, // ID de inscripción
                                        pernomcompleto: row[1] || '', // Nombre completo de la persona
                                        pernrodoc: row[2] || '', // Número de documento
                                        not1: row[3] || 0, // Nota 1
                                        not2: row[4] || 0, // Nota 2
                                        not3: row[5] || 0, // Nota 3
                                        notfinal: row[6] || 0, // Nota final
                                    };
                                } else {
                                    // Si la fila está incompleta o vacía, se registra una advertencia y se ignora
                                    console.warn(
                                        'Fila incompleta o vacía encontrada:',
                                        row
                                    );
                                    return null;
                                }
                            })
                            .filter((item) => item !== null); // Filtrar las filas que no se pudieron procesar

                        // Contar la cantidad de registros válidos
                        const cantidadRegistros = this.nota_recuperada.length;

                        // Indicar que se han importado notas
                        this.notasImportadas = true;

                        // Mostrar un mensaje de éxito con la cantidad de registros subidos
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Archivo',
                            detail: `Se recuperaron ${cantidadRegistros} registros correctamente`,
                            life: 5000,
                        });
                    } else {
                        // Si no se han recuperado datos válidos, mostrar un mensaje de error
                        console.error('El archivo no contiene datos válidos.');
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'El archivo no contiene datos válidos',
                        });
                    }
                } catch (error) {
                    // Manejar cualquier error ocurrido durante la lectura y el procesamiento del archivo
                    console.error(
                        'Error al recuperar los datos del archivo:',
                        error
                    );
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Hubo un error al recuperar los datos del archivo',
                    });
                }
            };

            // Leer el archivo como ArrayBuffer
            reader.readAsArrayBuffer(file);
        } else {
            // Mostrar un mensaje de error si el archivo no es válido
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'El archivo debe ser un documento Excel (.xlsx o .xls)',
            });
        }
    }

    /**
     * Verifica si el archivo es un documento Excel.
     * @param {File} file - El archivo a verificar.
     * @returns {boolean} Retorna verdadero si el archivo es un documento Excel, falso en caso contrario.
     */
    isExcelFile(file: File): boolean {
        const validExtensions = ['.xlsx', '.xls'];
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        return fileExtension
            ? validExtensions.includes('.' + fileExtension)
            : false;
    }

    abrirModalNotaSubir() {
        this.notasImportadas = true;
    }

    /**
     * Sube un conjunto de notas a través del servicio de `notaService` y maneja el resultado de cada subida.
     * @param {Nota[]} notas_a_subir - Array de notas que se desea subir.
     */
    subirNotas(notas_a_subir: Nota[]) {
        if (notas_a_subir.length === 0) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se seleccionó ningún archivo',
            });
            return;
        }

        // Arreglo para almacenar las notas subidas correctamente
        const notasSubidas: Nota[] = [];

        // Arreglo para almacenar las notas que no pudieron ser subidas
        let notasNoSubidas: Nota[] = [];

        // Indica que la operación de subida de notas está en curso
        this.loading2 = true;

        /**
         * Mapea cada nota en un Observable, configurando las propiedades necesarias
         * y utilizando `gestionarNota` para subirla.
         * @returns {Observable<any>} Un array de observables que realizarán la operación de subida de notas.
         */
        const observables = notas_a_subir.map((nota) => {
            // Configurar propiedades de la nota
            nota.notusureg = this.usuario.usuname; // Usuario que registra la nota
            nota.notusumod = this.usuario.usuname; // Usuario que modifica la nota
            nota.notid = null; // ID de la nota (nueva nota)
            nota.notestado = 1; // Estado de la nota (activa)
            nota.tipo = 1; // Tipo de la nota

            /**
             * Llama al servicio para gestionar la nota, agrega la nota al array `notasSubidas` si se sube correctamente,
             * o la agrega al array `notasNoSubidas` en caso de error.
             * @returns {Observable<any>} Observable que maneja la subida de la nota.
             */
            return this.notaService.gestionarNota(nota).pipe(
                // Si la subida es exitosa, agrega la nota a `notasSubidas`
                tap(() => notasSubidas.push(nota)),
                // Si hay un error, agrega la nota a `notasNoSubidas` y maneja el error sin interrumpir el flujo
                catchError((error) => {
                    this.loading2 = false;
                    notasNoSubidas.push(nota);
                    console.error('Error al subir nota:', error);
                    // Devuelve un observable vacío para continuar con el flujo
                    return of(null);
                })
            );
        });

        /**
         * Ejecuta todos los observables en paralelo y espera a que todos se completen antes de emitir un único valor.
         * Luego, maneja la lógica de la interfaz de usuario y muestra mensajes de éxito o error.
         */
        forkJoin(observables).subscribe(() => {
            // Indica que la operación de subida de notas ha finalizado
            this.loading2 = false;

            // Reinicia la variable `notasImportadas` para permitir una nueva importación
            this.notasImportadas = false;

            // Actualiza la lista de notas después de la subida
            this.listarNotas({ curmatid: this.curmatid });

            // Mostrar un mensaje de error si alguna nota no se pudo subir
            if (notasNoSubidas.length > 0) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: `No se pudieron subir ${notasNoSubidas.length} notas.`,
                });
            }

            // Mostrar un mensaje de éxito si al menos una nota se subió correctamente
            if (notasSubidas.length > 0) {
                const message = `Se han subido ${notasSubidas.length} notas correctamente.`;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Notas subidas correctamente',
                    detail: message,
                });
            }
        });
    }

    /**
     * Ocultar dialog subir nota
     */
    hideSubirNota() {
        this.notasImportadas = false;
        this.nota_recuperada = null;
    }

    /**
     * Obtener la lista de las personas para el combo de opciones.
     */
    getAllPersonCombo() {
        this.usuarioService.getTipoPersonaDocente().subscribe((result: any) => {
            this.personOptions = result.map((persona: any) => ({
                label: persona.pernomcompleto,
                value: persona.pernomcompleto,
                pernrodoc: persona.pernrodoc,
                perfoto: persona.perfoto,
            }));
        });

        this.verMateriaClicked = true;
        this.getUserData();
        this.listarCursosMaterias();
        this.notaEjemplo.pernomcompleto = 'Apellido Paterno Apellido Materno Nombres';
        this.notaEjemplo.pernrodoc = '9973412';
        this.notaEjemplo.not1 = 100;
        this.notaEjemplo.not2 = 100;
        this.notaEjemplo.not3 = 100;
        this.notaEjemplo.notfinal = 100;
        this.listarNotaEstudianteCursoImportar.push(this.notaEjemplo);
        this.getAllPersonCombo();
    }

    /**
     * Calcula el total de estudiantes para un curso.
     * @param curid ID del curso.
     * @returns Total de estudiantes.
     */
    calculateStudentTotal(curid: number): number {
        return this.listarMateriasInscritas
            .filter((materiaInscrita) => materiaInscrita.curid === curid)
            .reduce(
                (total, materiaInscrita) =>
                    total + materiaInscrita.num_estudiantes,
                0
            );
    }

    /**
     * Resetea el índice de fila para el grupo de curso.
     * @param rowGroupIndex Índice del grupo de filas.
     * @returns Siempre true.
     */
    resetRowIndex(rowGroupIndex: number): boolean {
        this.currentCourse = this.listarMateriasInscritas[rowGroupIndex]?.curid;
        this.rowIndexCounters[this.currentCourse] = 0;
        return true;
    }

    /**
     * Obtiene el índice de fila para el grupo actual.
     * @param rowIndex Índice de fila.
     * @returns Índice de fila incrementado.
     */
    getRowIndex(rowIndex: number): number {
        if (!this.rowIndexCounters[this.currentCourse]) {
            this.rowIndexCounters[this.currentCourse] = 0;
        }
        return ++this.rowIndexCounters[this.currentCourse];
    }

    rptNotaCursoMateriaDocente() {
        const criterio = {
            periddocente: this.usuario.perid,
        };
        this.notaService.rptNotaEstudianteMateriaDocente(criterio);
    }
}
