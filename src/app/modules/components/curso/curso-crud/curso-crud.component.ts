// Importaciones
import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import logoIbciBase64 from '../../../../../assets/base64/logo_ibci_base64.js';
// Modelos
import { TipoCurso, TipoRol, TipoMateria, TipoEstado, TipoPersona2} from 'src/app/modules/models/diccionario';
import { CursoMateria } from 'src/app/modules/models/curso';
import { Usuario } from 'src/app/modules/models/usuario';
// Servicios
import { CursoService } from 'src/app/modules/service/data/curso.service';
import { ReporteService } from 'src/app/modules/service/data/reporte.service';
import { DiccionarioService } from 'src/app/modules/service/data/diccionario.service';
import { UsuarioService } from 'src/app/modules/service/data/usuario.service';
import { AuthService } from 'src/app/modules/service/core/auth.service';
import { HorarioService } from 'src/app/modules/service/data/horario.service';

import { Router } from '@angular/router';

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

import { CalendarOptions } from '@fullcalendar/core'; // useful for typechecking
import timeGridPlugin from '@fullcalendar/timegrid'; // Plugin para vista de horario
import dayGridPlugin from '@fullcalendar/daygrid';

const esLocale = {
    code: 'es',
    week: {
      dow: 1, // La semana comienza el lunes
      doy: 4, // El primer jueves del año es el primer week of the year
    },
    buttonText: {
      prev: 'Anterior',
      next: 'Siguiente',
      today: 'Hoy',
      month: 'Mes',
      week: 'Semana',
      day: 'Día',
      list: 'Agenda',
    },
    weekText: 'Sem',
    allDayText: 'Todo el día',
    moreLinkText: 'más',
    noEventsText: 'No hay eventos para mostrar',
  };

@Component({
    templateUrl: './curso-crud.component.html',
    providers: [MessageService],
    styleUrls: ['../../../../app.component.css']
})

export class CursoCrudComponent implements OnInit {

    date3:any
    cols: any[] = [];
    statuses: any[] = [];
    rowsPerPageOptions = [5, 10, 20];

    // -------------------------- Variables Cursos_Materias -------------------------- //
    listaCursosMaterias: CursoMateria[] = [];
    listaCursosMateriasDuplicated: CursoMateria[] = [];
    listaCursosMateriasNoActivo: CursoMateria[] = [];
    cursoMateria: CursoMateria;
    submitted: boolean = false;
    cursoMateriaDialog: boolean = false;
    optionCursoMateria: boolean = false;
    eliminarCursoMateriaDialog: boolean = false;
    desactivarCursoMateriaDialog: boolean = false;
    activarCursoMateriaDialog: boolean = false;

    registroCursoMateria: CursoMateria = {};

    tipoCurso: TipoCurso[] = [];
    tipoCursoSeleccionado: TipoCurso;

    tipoMateria: TipoMateria[] = [];
    tipoMateriaSeleccionado: TipoMateria;

    tipoRol: TipoRol[] = [];
    tipoRolSeleccionado: TipoRol;

    tipoPersona: TipoPersona2[] = [];
    tipoPersonaSeleccionado: TipoPersona2;

    tipoEstado: TipoEstado[] = [];
    tipoEstadoSeleccionado: TipoEstado;

    loading: boolean = false;
    userProfilePhoto = environment.API_URL_PROFILE_PHOTO;
    // -------------------------- Variables Cursos_Materias -------------------------- //

    //----------------Variables para validación----------------//
    cursoForm: FormGroup;
    //----------------Variables para validación----------------//
    usuario: Usuario;
    //-> Variables para exportar en excel
    colsTable!: Column[];
    exportColumns!: ExportColumn[];
    //->


    userProfilePhotoEmpty = '../../../../../assets/images/login/sin_foto_perfil.png';
    errors: any;
    items: MenuItem[];
    home: MenuItem | undefined;

    selectedColumns: { field: string; header: string }[];
    colsColumsTable!: ColumsTable[];
    personOptions: TipoPersona2[] = [];

    statusOptions = [
        { label: 'Activo', value: 1 },
        { label: 'Inactivo', value: 0 },
    ];


    // Configurar Calendario
    calendarOptions: CalendarOptions = {
        initialView: 'dayGridMonth', // Vista previo Mensual
        plugins: [dayGridPlugin, timeGridPlugin],
        locale: esLocale,
        dayHeaderFormat: { weekday: 'long' }, // Tipo de Texto de la cabecera
        slotLabelFormat: { // Formato del horario
            hour: 'numeric',
            minute: '2-digit',
            meridiem: 'short',  // AM/PM
            hour12: true  // Formato de 12 horas
        },
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        editable: true,
        selectable: true,
        events: [] // Eventos se cargarán dinámicamente
    };
    curid: any;
    matid: any;
    curmatid: any;

    // calendarOptions: CalendarOptions;
    constructor(
        private messageService: MessageService,
        private cursoService: CursoService,
        private reporte: ReporteService,
        private diccionarioService: DiccionarioService,
        private usuarioServicie: UsuarioService,
        private authService: AuthService,
        private formBuilder: FormBuilder,
        private spinner: NgxSpinnerService,
        private usuarioService: UsuarioService,
        private horarioService: HorarioService,
        private router: Router
    ) {
        this.items = [
            { label: 'Curso' },
            { label: 'Gestionar Curso', routerLink: '' },
        ];
        this.home = { icon: 'pi pi-home', routerLink: '/' };
        this.colsColumsTable = [
            { field: 'curnombre', header: 'Curso' },
            { field: 'matnombre', header: 'Materia' },
            { field: 'pernomcompleto', header: 'Docente' },
            { field: 'curmatfecini', header: 'Fecha Inicio (Año/Mes/Dia)' },
            { field: 'curmatfecfin', header: 'Fecha Fin (Año/Mes/Dia)' },
            { field: 'curmatcosto', header: 'Costo (Bs)' },
            { field: 'curnivel', header: 'Nivel'},
            { field: 'curmatusureg', header: 'Usuario Registrado' },
            { field: 'curmatusumod', header: 'Usuario Modificado' },
            { field: 'curmatestado', header: 'Estado' },
        ];
        this.selectedColumns = [
            { field: 'matnombre', header: 'Materia' },
            { field: 'pernomcompleto', header: 'Docente' },
            { field: 'curmatfecini', header: 'Fecha Inicio (Año/Mes/Dia)' },
            { field: 'curmatfecfin', header: 'Fecha Fin (Año/Mes/Dia)' },
            { field: 'curmatcosto', header: 'Costo (Bs)' },
            { field: 'curmatestado', header: 'Estado' }
        ];
    }

    ngOnInit() {
        this.getAllPersonCombo();
        this.listarCursoMateria();
        this.listarCursoCombo();
        this.obtenerRoles();
        this.tipoEstado = [ new TipoEstado(0, 'FINALIZADO'), new TipoEstado(1, 'VIGENTE'), new TipoEstado(2, 'OTRO') ];
        this.asignacionValidacionesCurso(); // Método de asignación de validaciones
        this.getProfileUsuario(); // Método de getProfile() de usuario logeado
        this.colsTable = [
            { field: 'curmatid', header: 'ID' },
            { field: 'curnombre', header: 'Nombre de nivel' },
            { field: 'matnombre', header: 'Nombre de la materia' },
            { field: 'curmatfecini', header: 'Fec. inicio' },
            { field: 'curmatfecfin', header: 'Fec. fin' },
            { field: 'curmatcosto', header: 'Costo'},
            { field: 'pernomcompleto', header: 'Docente' },
            { field: 'rolnombre', header: 'Rol' },
            { field: 'curmatusureg', header: 'Usu. Reg.' },
            { field: 'curmatfecreg', header: 'Fec. Reg.' },
            { field: 'curmatusumod', header: 'Usu. Mod.' },
            { field: 'curmatfecmod', header: 'Fec. Mod.' }
        ];
        this.exportColumns = this.colsTable.map((col) => ({ title: col.header, dataKey: col.field }));

        this.loadHorarios();
    }

    loadHorarios(): void {
        this.horarioService.getHorarios().subscribe({
            next: (data: any[]) => {
                const events = data.flatMap((horario: any) => {
                    const startDate = horario.horfecini; // Formato 'YYYY-MM-DD'
                    const endDate = horario.horfecfin; // Formato 'YYYY-MM-DD'
                    const startTime = horario.horini; // Formato 'HH:MM:SS'
                    const endTime = horario.horfin; // Formato 'HH:MM:SS'
                    const dayOfWeek = this.getDayOfWeek(horario.hordia);

                    // Genera un color aleatorio para este evento
                    const randomColor = this.generateRandomColor();

                    // Usando 'daysOfWeek' para eventos recurrentes
                    return {
                        title: 'Bases psicológicas en el ciclo de vida familiar',
                        startTime: startTime, // Hora de inicio
                        endTime: endTime,     // Hora de fin
                        startRecur: startDate, // Fecha de inicio de la recurrencia
                        endRecur: endDate,     // Fecha de fin de la recurrencia
                        daysOfWeek: [dayOfWeek], // Días de la semana (0=domingo, 1=lunes...)
                        color: randomColor // Color aleatorio
                    };
                });

                this.calendarOptions.events = events;
            },
            error: (err) => {
                console.error('Error al cargar horarios:', err);
            }
        });
    }

    private generateRandomColor(): string {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    private getDayOfWeek(day: string): number {
        // Mapea los días de la semana a valores numéricos (0=domingo, 1=lunes, etc.)
        const days: { [key: string]: number } = {
            'Lu': 1,
            'Ma': 2,
            'Mi': 3,
            'Ju': 4,
            'Vi': 5,
            'Sa': 6,
            'Do': 0
        };
        return days[day] || 0;
    }



    // Método para asignar las variables de React Form Valid
    asignacionValidacionesCurso() {
        //----- Asignación de la validaciones
        this.cursoForm = this.formBuilder.group({
            curmatid: [''],
            tipoCurso: ['', [Validators.required]],
            tipoMateria: ['', [Validators.required]],
            tipoRol: ['', [Validators.required]],
            tipoPersona: ['', [Validators.required]],
	        curmatfecini: ['', [Validators.required]],
	        curmatfecfin: ['', [Validators.required]],
            curmatcosto: ['', [Validators.required, Validators.min(0)]]
        });
    }
    // Obtener datos del perfil del usuario logeado
    getProfileUsuario() {
        this.authService.getProfile().subscribe(usuario => {
            this.usuario = usuario[0];
        });
    }

    // ---------------------------------- Funciones Curso Materia  ------------------------
    abrirNuevo() {
        this.cursoForm.reset();
        this.cursoMateria = new CursoMateria();
        this.cursoMateriaDialog = true;
        this.optionCursoMateria = true;
    }
    ocultarDialog(){
        this.cursoForm.reset();
        this.cursoMateriaDialog = false;
        this.optionCursoMateria = false;
    }

    listarCursoCombo(){
        this.cursoService.listaCursoCombo().subscribe(
            (result: any) => {
                this.tipoCurso = result;
            }
        )
    }

    listarCursoMateria(){
        this.spinner.show();
        this.loading = true;
        this.cursoService.listarCursoMateria().subscribe(
            (result: any) => {
                this.listaCursosMaterias = result;
                this.listaCursosMateriasDuplicated = result;
                this.loading = false;
                this.spinner.hide();
            },
            (error: any) => {
                console.error("Error: ", error);
                this.spinner.hide();
            }
        )
    }

    onSelectCurso(data: any){
        const nivel = parseInt(data.value.curnivel);
        const criterio = { curnivel: nivel };
        this.obtenerTipoMateria(criterio);
    }

    obtenerTipoMateria(criterio: any){
        this.diccionarioService.getTipoMateria(criterio).subscribe( (result: any) => { this.tipoMateria = result; } )
    }

    obtenerRoles(){
        this.usuarioServicie.getRoles().subscribe( (result: any) => { this.tipoRol = result.filter((rol: any) => rol.rolnombre !== 'Secretaria' && rol.rolnombre !== 'Administrador'); } )
    }

    onSelectPersona(data: any){
        const nombre = data.value.rolnombre;
        const criterio = { rolnombre: nombre };
        this.obtenerTipoPersona(criterio);
    }

    seleccionarPersona(data: any){
        const nombre = data;
        const criterio = { rolnombre: nombre };
        this.obtenerTipoPersona(criterio);
    }

    obtenerTipoPersona(criterio: any){
        this.diccionarioService.getListaPersonaDocenteCombo(criterio).subscribe( (result: any) => { this.tipoPersona = result; } )
    }

    editarCursoMateria(data: any){
        this.cursoMateria = { ...data };
        this.setData();
        this.cursoMateriaDialog = true;
        this.optionCursoMateria = false;
    }

    setData(){
        const curnivel = { curnivel: this.cursoMateria.curnivel };
        this.diccionarioService.getTipoMateria(curnivel).subscribe( (result: any) => { this.tipoMateria = result; } )
        const rolnombre = {rolnombre: this.cursoMateria.rolnombre};
        this.diccionarioService.getListaPersonaDocenteCombo(rolnombre).subscribe( (result: any) => { this.tipoPersona = result; } )
        this.cursoForm.patchValue({
            curmatid: this.cursoMateria.curmatid,
            tipoCurso: new TipoCurso(this.cursoMateria.curid, this.cursoMateria.curnombre, this.cursoMateria.curnivel),
            tipoMateria: new TipoMateria(this.cursoMateria.matid, this.cursoMateria.matnombre, this.cursoMateria.matnivel),
            tipoRol: new TipoRol(this.cursoMateria.rolid, this.cursoMateria.rolnombre),
            tipoPersona: new TipoPersona2(this.cursoMateria.periddocente, this.cursoMateria.pernomcompleto, this.cursoMateria.pernrodoc, this.cursoMateria.perfoto),
            curmatfecini: this.cursoMateria.curmatfecini,
            curmatfecfin: this.cursoMateria.curmatfecfin,
            curmatcosto: this.cursoMateria.curmatcosto
        })
    }

    obtenerBody(){
        this.cursoMateria = new CursoMateria();
        this.cursoMateria.curmatid = this.cursoForm.value.curmatid;
        this.cursoMateria.curid = this.cursoForm.value.tipoCurso.curid;
        this.cursoMateria.matid = this.cursoForm.value.tipoMateria.matid;
        this.cursoMateria.periddocente = this.cursoForm.value.tipoPersona.perid;
        this.cursoMateria.curmatidrol = this.cursoForm.value.tipoRol.rolid;
        this.cursoMateria.curmatidroldes = this.cursoForm.value.tipoRol.rolnombre;
        this.cursoMateria.curmatfecini = this.cursoForm.value.curmatfecini;
        this.cursoMateria.curmatfecfin = this.cursoForm.value.curmatfecfin;
        this.cursoMateria.curmatcosto = this.cursoForm.value.curmatcosto;
        this.cursoMateria.curmatestado = 1;
        this.cursoMateria.curmatestadodescripcion="";
        this.cursoMateria.curmatusureg = this.usuario.usuname;
        this.cursoMateria.curmatusumod = this.usuario.usuname;
        const body = { ...this.cursoMateria }
        return body;
    }

    guardarCursoMateria(){

        if(this.cursoForm.invalid){
            this.messageService.add({ severity: 'error', summary: 'Error en el Registro', detail: 'Por favor, verifica la información ingresada e intenta nuevamente.', life: 3000 });
            return Object.values(this.cursoForm.controls).forEach(control=>{ control.markAllAsTouched(); control.markAsDirty(); })
        }

        this.obtenerBody();

        if(this.optionCursoMateria){
            this.cursoService.insertarCursoMateria(this.cursoMateria).subscribe(
                (result: any) => {
                    this.messageService.add({ severity: 'success', summary: 'Exitosa!', detail: 'Curso-Materia Insertardo', life: 3000 });
                    this.listarCursoMateria();
                    this.cursoMateria = new CursoMateria();
                    this.ocultarDialog();
                },
                (error: any) => {
                    console.error("error: ", error);
                    if (error.error.message?.includes('UniqueViolation')) {
                        const errorMessage = 'No se puede crear la curso-materia porque ya existe un registro igual.';
                        this.messageService.add({ severity: 'error', summary: 'El registro ya existe.', detail: errorMessage, life: 7000});
                        return;
                    }
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Se produjo un error al intentar registrar el curso-materia.', life: 5000});
                }
            );
        }
        else{
            this.cursoService.modificarCursoMateria(this.cursoMateria).subscribe(
                (result: any) => {
                    this.messageService.add({ severity: 'success', summary: 'Exitosa', detail: 'Modificación Curso-Materia Existosamente!', life: 3000 });
                    this.listarCursoMateria();
                    this.cursoMateria = new CursoMateria();
                    this.ocultarDialog();
                },(error: any) => {
                    console.error("error: ", error);
                    if (error.error.message?.includes('UniqueViolation')) {
                        const errorMessage = 'No se puede modificar la curso-materia porque ya existe un registro igual.';
                        this.messageService.add({ severity: 'error', summary: 'El registro ya existe.', detail: errorMessage, life: 7000});
                        return;
                    }
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Se produjo un error al intentar modificar el curso-materia.', life: 5000});
                }
            )
        }
    }

    eliminarCursoMateria(data: CursoMateria) {
        this.eliminarCursoMateriaDialog = true;
        this.cursoMateria = { ...data };
    }

    desactivarCursoMateria(data: CursoMateria) {
        this.desactivarCursoMateriaDialog = true;
        this.cursoMateria = { ...data };
        this.cursoMateria.tipo = 2;
    }

    activarCursoMateria(data: CursoMateria) {
        this.activarCursoMateriaDialog = true;
        this.cursoMateria = { ...data };
        this.cursoMateria.tipo = 3;
    }

    confirmarEliminar() {
        const criterio = { curmatid: this.cursoMateria.curmatid }
        this.cursoService.eliminarCursoMateria(criterio).subscribe(
            (result: any) => {
                this.messageService.add({ severity: 'success', summary: 'Exitosa!', detail: 'Curso-Materia Eliminado', life: 3000 });
                this.listarCursoMateria();
                this.eliminarCursoMateriaDialog = false;
                this.cursoMateria = {};
            },
            error => {
            console.error("error",error);
            const descripcionError = error.error.message;
                this.messageService.add({severity:'warn', summary:'Error', detail: descripcionError, life: 5000});
            }
        );
    }

    confirmarActivarDesactivar() {
        this.cursoMateria.curmatusumod = this.usuario.usuname;
        this.cursoService.gestonarCursoMateriaEstado(this.cursoMateria).subscribe(
            (result: any) => {
                this.messageService.add({ severity: 'success', summary: 'Exitosa!', detail: 'Curso-Materia modificado correctamente', life: 3000 });
                this.listarCursoMateria();
                this.eliminarCursoMateriaDialog = false;
                this.activarCursoMateriaDialog = false;
                this.desactivarCursoMateriaDialog = false;
                this.cursoMateria = {};
            },
            error => {
            console.error("error",error);
                this.messageService.add({severity:'warn', summary:'Error', detail: 'Algo salio mal', life: 5000});
            }
        );
    }

    // Método de busqueda en la tabla
    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal( (event.target as HTMLInputElement).value, 'contains' );
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
    }

    // ------------------------------ Funciones Curso Materia -----------------------------

    // Función para exportar el documento PDF
    exportPdf() {
        import('jspdf').then(jsPDF => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default('l', 'pt', 'a4');

                // Título centrado
                const title = 'Lista Curso-Materia registrados';
                const titleFontSize = 16;
                const titleWidth = doc.getStringUnitWidth(title) * titleFontSize / doc.internal.scaleFactor;
                const titleX = (doc.internal.pageSize.getWidth() - titleWidth) / 2;
                const titleY = 60;
                doc.setFontSize(titleFontSize);
                doc.text(title, titleX, titleY);

                // Subtítulo
                const subtitle = 'Esta lista muestra todas las materias registradas en el sistema.';
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
                    body: this.listaCursosMateriasDuplicated,
                    theme: 'striped',
                    styles: { fontSize: 8, cellPadding: 3 },
                    startY: 100, // Posición inicial de la tabla
                });
                const fechaActual = new Date(); // Obtener la fecha actual
                const fechaFormateada = `${fechaActual.getFullYear()}-${(fechaActual.getMonth() + 1).toString().padStart(2, '0')}-${fechaActual.getDate().toString().padStart(2, '0')}`;// Formatear la fecha como YYYY-MM-DD
                const horaFormateada = `${fechaActual.getHours().toString().padStart(2, '0')}-${fechaActual.getMinutes().toString().padStart(2, '0')}-${fechaActual.getSeconds().toString().padStart(2, '0')}`;// Formatear la hora como HH-MM-SS
                const nombreArchivo = `lista_curso_materia_${fechaFormateada}_${horaFormateada}.pdf`; // Concatenar la fecha y la hora al nombre del archivo
                doc.save(nombreArchivo); // Guardar el archivo PDF con el nuevo nombre
            });
        });
    }



    exportExcel() {
        import('xlsx').then((xlsx) => {
            const fieldsToExport = [
                { field: 'curmatid', header: 'ID' },
                { field: 'curnombre', header: 'Nombre del Curso' },
                { field: 'matnombre', header: 'Nombre de la Materia' },
                { field: 'curmatfecini', header: 'Fecha de Inicio' },
                { field: 'curmatfecfin', header: 'Fecha de Fin' },
                { field: 'curmatcosto', header: 'Costo' },
                { field: 'pernomcompleto', header: 'Nombre del Instructor' },
                { field: 'rolnombre', header: 'Rol del Instructor' },
                { field: 'curmatusureg', header: 'Usuario de Registro' },
                { field: 'curmatfecreg', header: 'Fecha de Registro' },
                { field: 'curmatusumod', header: 'Usuario de Modificación' },
                { field: 'curmatfecmod', header: 'Fecha de Modificación' }
            ];

            // Filtrar y ordenar los datos según sea necesario

            const dataToExport = this.listaCursosMateriasDuplicated.map(curso_materia => {
                const filteredData = {};
                fieldsToExport.forEach(field => {
                    filteredData[field.header] = curso_materia[field.field] || ''; // Asegura que todos los campos existan, incluso si están vacíos
                });
                return filteredData;
            });

            const worksheet = xlsx.utils.json_to_sheet(dataToExport);

            const workbook = { Sheets: { 'Data': worksheet }, SheetNames: ['Data'] };

            const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
            this.saveAsExcelFile(excelBuffer, 'lista_curso_materia');
        });
    }

    saveAsExcelFile(buffer: any, fileName: string): void {
        let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        let EXCEL_EXTENSION = '.xlsx';
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE
        });
        FileSaver.saveAs(data, fileName + '_' + new Date().getTime() + EXCEL_EXTENSION);
    }

    /**
     * Lista los pagos de un estudiante por materia y curso.
     * @param data Datos de curso y materia.
     */
    listarCursoHorario(data: any): void {
        console.log("data", data);
        this.curmatid = data.curmatid;
        this.curid = data.curid;
        this.matid = data.matid;
        this.router.navigate(['/principal/curso/curso-horario'], {
            queryParams: { curid: this.curid, matid: this.matid, curmatid: this.curmatid },
        });
    }


}
