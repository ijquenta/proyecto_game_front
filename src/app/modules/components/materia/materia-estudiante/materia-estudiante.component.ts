// Importaciones de servicios
import { EstudianteService } from 'src/app/modules/service/data/estudiante.service';
import { HorarioService } from 'src/app/modules/service/data/horario.service';
import { AuthService } from 'src/app/modules/service/core/auth.service';
import { MateriaService } from 'src/app/modules/service/data/materia.service';

// Importaciones de modelos
import { Usuario } from 'src/app/modules/models/usuario';
import { InscripcionRegistro } from 'src/app/modules/models/inscripcion';

// Importaciones de librerías externas
import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { CalendarOptions } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import { TreeNode } from 'primeng/api';

// Importación de entorno
import { environment } from 'src/environments/environment';

interface EventItem {
    status?: string;
    date?: string;
    icon?: string;
    color?: string;
    image?: string;
    description?: string; // Descripción adicional para el curso
}

// Configuración de idioma de calendario
const esLocale = {
    code: 'es',
    week: { dow: 1, doy: 4 },
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
    selector: 'app-materia-estudiante',
    templateUrl: './materia-estudiante.component.html',
    styleUrls: ['./materia-estudiante.component.scss'],
})
export class MateriaEstudianteComponent implements OnInit {
    userProfilePhoto = environment.API_URL_PROFILE_PHOTO;
    userProfilePhotoEmpty =
        '../../../../../assets/images/login/sin_foto_perfil.png';

    events: EventItem[];
    items: MenuItem[];
    home: MenuItem | undefined;

    data: TreeNode[] = [
        {
            label: 'Instituto Bíblico de Capacitación Internacional',
            expanded: true,
            children: [
                {
                    label: 'Módulo 1: Introducción al Ministerio',
                    expanded: true,
                    children: [
                        { label: 'Introducción a la Biblia' },
                        { label: 'Teología Básica' },
                        { label: 'Historia del Cristianismo' },
                        { label: 'Ética Cristiana' },
                        { label: 'Prácticas de Ministerio' },
                    ],
                },
                {
                    label: 'Módulo 2: Estudio del Antiguo Testamento',
                    expanded: true,
                    children: [
                        { label: 'Pentateuco' },
                        { label: 'Libros Históricos' },
                        { label: 'Libros Poéticos' },
                        { label: 'Profetas Mayores' },
                        { label: 'Profetas Menores' },
                        { label: 'Cultura y Contexto del Antiguo Testamento' },
                    ],
                },
                {
                    label: 'Módulo 3: Estudio del Nuevo Testamento',
                    expanded: true,
                    children: [
                        { label: 'Evangelios' },
                        { label: 'Hechos de los Apóstoles' },
                        { label: 'Epístolas Paulinas' },
                        { label: 'Epístolas Generales' },
                        { label: 'Apocalipsis' },
                        { label: 'Contexto Histórico del Nuevo Testamento' },
                    ],
                },
                {
                    label: 'Módulo 4: Aplicación y Práctica Ministerial',
                    expanded: true,
                    children: [
                        { label: 'Consejería Pastoral' },
                        { label: 'Predicación y Enseñanza' },
                        { label: 'Liderazgo y Administración Eclesiástica' },
                        { label: 'Evangelismo y Misiones' },
                        { label: 'Adoración y Música' },
                        { label: 'Manejo de Conflictos' },
                        { label: 'Prácticas en el Campo' },
                    ],
                },
            ],
        },
    ];

    selectedNodes: TreeNode[] = [];

    // Propiedades de la clase
    listaMateriasInscritas: any = [];
    loading: boolean = false;
    caledarDialog: boolean = false;
    errors: any;
    inscripciones: InscripcionRegistro;
    usuario: Usuario;
    isImageLoaded: boolean;

    displayDialog: boolean = false;
    listHorarios: any[] = [];
    hours: string[] = this.generateHours();

    statusOptions = [
        { label: 'Activo', value: 1 },
        { label: 'Inactivo', value: 0 },
    ];

    // Configuración del Calendario
    calendarOptions: CalendarOptions = {
        initialView: 'dayGridMonth', // Vista previa Mensual
        plugins: [dayGridPlugin, timeGridPlugin],
        locale: esLocale,
        dayHeaderFormat: { weekday: 'long' }, // Tipo de Texto de la cabecera
        slotLabelFormat: {
            // Formato del horario
            hour: 'numeric',
            minute: '2-digit',
            meridiem: 'short', // AM/PM
            hour12: true, // Formato de 12 horas
        },
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
        },
        editable: true,
        selectable: true,
        events: [], // Eventos se cargarán dinámicamente
    };
    informacionDocente: boolean = false;
    persona: any;
    infoMinisterial: any;
    infoAcademica: any;
    activeIndex: number = 0;
    horarios: any[];
    constructor(
        private estudianteService: EstudianteService,
        private authService: AuthService,
        private spinner: NgxSpinnerService,
        private horarioService: HorarioService,
        private materiaService: MateriaService
    ) {
        this.items = [
            { label: 'Materia' },
            { label: 'Mis Materias', routerLink: '' },
        ];

        this.home = { icon: 'pi pi-home', routerLink: '/principal' };
    }

    ngOnInit(): void {
        this.initUsuarioMateria();

        this.events = [
            {
                status: 'Módulo 1: Introducción al Ministerio',
                icon: 'pi pi-book',
                color: '#9C27B0',
                image: 'https://www.institutoibci.com/wp-content/uploads/2015/06/Homile%CC%81tica-270x283.jpg',
                description:
                    'Inicio del curso con una introducción a los fundamentos del ministerio cristiano.',
            },
            {
                status: 'Módulo 2: Estudio del Antiguo Testamento',
                icon: 'pi pi-book',
                color: '#673AB7',
                image: 'https://www.institutoibci.com/wp-content/uploads/2015/06/Como-estudiar-la-Biblia-270x283.jpg',
                description:
                    'Estudio profundo de los libros del Antiguo Testamento y su contexto histórico.',
            },
            {
                status: 'Módulo 3: Estudio del Nuevo Testamento',
                icon: 'pi pi-book',
                color: '#FF9800',
                image: 'https://www.institutoibci.com/wp-content/uploads/2015/06/Papiro_23_Santiago_115-18-270x283.jpg',
                description:
                    'Exploración de los evangelios, las epístolas y el libro de Apocalipsis.',
            },
            {
                status: 'Módulo 4: Aplicación y Práctica Ministerial',
                icon: 'pi pi-book',
                color: '#607D8B',
                image: 'https://www.institutoibci.com/wp-content/uploads/2015/06/Homile%CC%81tica-270x283.jpg',
                description:
                    'Aplicación práctica de lo aprendido en el ministerio, incluyendo predicación y liderazgo.',
            },
        ];
    }

    // Método para abrir el diálogo
    showHorariosMateria(data: any) {
        this.displayDialog = true;
        // this.getHorarios();
        // this.loadHorarios2();
        this.loadHorariosMateria(data['curmatid'], data['matnombre']);
    }

    // Simula la generación de horas desde las 9:00 am a las 11:00 pm
    generateHours(): string[] {
        const hours = [];
        for (let h = 9; h <= 23; h++) {
            const hourStr = h < 10 ? `0${h}:00` : `${h}:00`;
            hours.push(hourStr);
        }
        return hours;
    }

    // Método para obtener los horarios por día y hora
    getHorario(dia: string, hour: string): string {
        const horario = this.listHorarios.find(
            (h) => h.hordia === dia && h.horini === hour
        );
        return horario ? `${horario.horini} - ${horario.horfin}` : '';
    }

    // Método para obtener los horarios (simulación, puedes reemplazar por la API real)
    getHorarios() {
        this.listHorarios = [
            { hordia: 'Lu', horini: '15:00', horfin: '17:00' },
            { hordia: 'Mi', horini: '15:00', horfin: '21:00' },
            { hordia: 'Vi', horini: '09:00', horfin: '11:00' },
        ];
    }

    /**
     * Inicializa el usuario y carga las materias inscritas.
     */
    private initUsuarioMateria(): void {
        this.spinner.show();
        this.loading = true;
        this.authService.usuario$.subscribe((user) => {
            if (user && Array.isArray(user) && user.length > 0) {
                this.usuario = user[0];
                this.estudianteService
                    .obtenerMateriasInscritas(this.usuario)
                    .subscribe({
                        next: (data) => {
                            this.inscripciones = data;
                            this.spinner.hide();
                            this.loading = false;
                        },
                        error: (error) => {
                            console.error(
                                'Error al obtener materias inscritas:',
                                error
                            );
                            this.spinner.hide();
                            this.loading = false;
                        },
                    });
            }
        });
    }

    /**
     * Carga los horarios y los muestra en el calendario.
     */
    private loadHorarios(): void {
        // Forzar redimensionamiento
        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 1);

        this.horarioService.getHorarios().subscribe({
            next: (data: any[]) => {
                const events = data.map((horario: any) => {
                    const startDate = horario.horfecini; // Fecha de inicio
                    const endDate = horario.horfecfin; // Fecha de fin
                    const startTime = horario.horini; // Hora de inicio
                    const endTime = horario.horfin; // Hora de fin
                    const dayOfWeek = this.getDayOfWeek(horario.hordia);

                    // Genera un color aleatorio para este evento
                    const randomColor = this.generateRandomColor();

                    return {
                        title: 'Bases psicológicas en el ciclo de vida familiar',
                        startTime: startTime,
                        endTime: endTime,
                        startRecur: startDate,
                        endRecur: endDate,
                        daysOfWeek: [dayOfWeek],
                        color: randomColor,
                    };
                });

                this.calendarOptions.events = events;
            },
            error: (err) => {
                console.error('Error al cargar horarios:', err);
            },
        });
    }

    /**
     * Muestra el diálogo de horarios generales.
     */
    showHorarioGeneral(): void {
        this.loadHorarios();
        this.caledarDialog = true;
    }

    /**
     * Muestra el diálogo de horarios con datos específicos.
     * @param data Datos a mostrar.
     */
    showHorarios(data: any): void {
        this.loadHorarios();
        this.caledarDialog = true;
    }

    /**
     * Genera un color hexadecimal aleatorio.
     * @returns Color en formato hexadecimal.
     */
    private generateRandomColor(): string {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    /**
     * Obtiene el número del día de la semana basado en una abreviatura.
     * @param day Abreviatura del día (ej. 'Lu', 'Ma', 'Mi').
     * @returns Número del día de la semana (0=domingo, 1=lunes, etc.).
     */
    private getDayOfWeek(day: string): number {
        const days: { [key: string]: number } = {
            Lu: 1,
            Ma: 2,
            Mi: 3,
            Ju: 4,
            Vi: 5,
            Sa: 6,
            Do: 0,
        };
        return days[day] || 0;
    }

    /**
     * Filtra la tabla globalmente.
     * @param table Tabla a filtrar.
     * @param event Evento de entrada.
     */
    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }

    /**
     * Genera un reporte de materias inscritas.
     */
    rptMateriasInscritas(): void {
        const criterio = {
            perid: this.usuario.perid,
            usuname: this.usuario.usuname,
        };
        this.estudianteService.rptCursoMateriaEstudiante(criterio);
    }

    /**
     * Obtiene las iniciales del nombre.
     * @param name Nombre completo.
     * @returns Iniciales en mayúscula.
     */
    getInitials(name: string): string {
        if (!name) return '';
        return name.charAt(0).toUpperCase();
    }

    /**
     * Maneja el error de carga de imagen.
     */
    onImageError(): void {
        this.isImageLoaded = false;
    }

    /**
     * Maneja la carga exitosa de imagen.
     */
    onImageLoad(): void {
        this.isImageLoaded = true;
    }

    /**
     * Obtiene la severidad del estado para mostrar el color adecuado.
     * @param estado Estado (1=activo, 0=inactivo).
     * @returns Clase de severidad.
     */
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

    /**
     * Obtiene la descripción del estado.
     * @param estado Estado (1=activo, 0=inactivo).
     * @returns Descripción del estado.
     */
    getDescriptionStatus(estado: number): string {
        switch (estado) {
            case 1:
                return 'En curso';
            case 0:
                return 'Terminada';
            default:
                return 'Ninguno';
        }
    }

    showInformacionDocente(data: any) {
        this.informacionDocente = true;

        const criterio = {
            perid: data.periddocente,
        };

        this.materiaService.getInformacionDocente(criterio).subscribe({
            next: (data: any) => {
                this.persona = data['persona'];
                this.infoMinisterial = data['infoMinisterial'];
                this.infoAcademica = data['infoAcademica'];
            },
            error: (err: any) => {
                console.error(
                    'Error al cargar la información del docente:',
                    err
                );
            },
        });
    }

    showDialog() {
        this.displayDialog = true;
    }

    onDialogHide() {
        this.displayDialog = false;
        this.horarios = [];
    }

    loadHorariosMateria(curmatid: number, matnombre: any) {
        this.horarioService.getHorariosByCursoMateria(curmatid).subscribe(
            (data) => {
                this.horarios = this.processHorariosMateria(data, matnombre);
            },
            (error) => {
                console.error('Error al cargar horarios:', error);
            }
        );
    }

    processHorariosMateria(data: any, matnombre: any): any[] {
        // Inicializa una estructura de datos para la tabla
        const horarios = [];
        // Definir los días de la semana en español
        const dias = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];
        // Rango de horas a mostrar
        const horas = Array.from(
            { length: 15 },
            (_, i) => (9 + i).toString().padStart(2, '0') + ':00'
        );

        // Crear una entrada para cada hora
        for (const hora of horas) {
            const entry: any = { hora };
            for (const dia of dias) {
                entry[this.diaToNombre(dia)] = this.getHorarioMateria(
                    data,
                    dia,
                    hora,
                    matnombre
                );
            }
            horarios.push(entry);
        }

        return horarios;
    }

    getHorarioMateria(
        data: any,
        dia: string,
        hora: string,
        matnombre: any
    ): string {
        const horario = data.find(
            (h) => h.hordia === dia && this.isHoraInRange(h, hora)
        );
        return horario ? `${matnombre}` : '';
    }

    isHoraInRange(horario: any, hora: string): boolean {
        const [horaini, horfin] = [horario.horini, horario.horfin].map((h) =>
            new Date(`1970-01-01T${h}Z`).getTime()
        );
        const horaTime = new Date(`1970-01-01T${hora}:00Z`).getTime();
        return horaTime >= horaini && horaTime <= horfin;
    }

    diaToNombre(dia: string): string {
        const nombres: any = {
            Lu: 'lunes',
            Ma: 'martes',
            Mi: 'miercoles',
            Ju: 'jueves',
            Vi: 'viernes',
            Sa: 'sabado',
        };
        return nombres[dia] || dia;
    }
}
