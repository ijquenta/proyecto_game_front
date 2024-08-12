import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { forkJoin } from 'rxjs';

// Importación para validaciones
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// Spinner
import { NgxSpinnerService } from 'ngx-spinner';

// Importación de services
import { UsuarioService } from 'src/app/modules/service/data/usuario.service';
import { ReporteService } from 'src/app/modules/service/data/reporte.service';
import { DiccionarioService } from 'src/app/modules/service/data/diccionario.service';
import { CursoService } from 'src/app/modules/service/data/curso.service';
import { InscripcionService } from 'src/app/modules/service/data/inscripcion.service';
import { AuthService } from 'src/app/modules/service/core/auth.service';
// Importacion de modelos
import { TipoMatriculaEstudiante } from 'src/app/modules/models/inscripcion';
import { TipoCurso, TipoRol, TipoPersona, TipoPersona2, TipoEstado, TipoMateria, TipoCursoMateria, TipoMatricula, TipoMateriaCombo, TipoMateria2} from 'src/app/modules/models/diccionario';
import { CursoMateria } from 'src/app/modules/models/curso';
import { Inscripcion, InscripcionRegistro } from 'src/app/modules/models/inscripcion';
import { Usuario } from 'src/app/modules/models/usuario';

interface ColumsTable {
    field: string;
    header: string;
}

@Component({
    templateUrl: './inscripcion-crud.component.html',
    providers: [MessageService],
    styleUrls: ['../../../../app.component.css']
})
export class InscripcionCrudComponent implements OnInit {

    // ------------------ Variables Inscripción -------------------------
    cols: any[] = [];
    statuses: any[] = [];
    rowsPerPageOptions = [5, 10, 20];

    // -------------------------- Variables Cursos_Materias -------------------------- //
    listaCursosMaterias: CursoMateria[] = [];
    cursoMateria: CursoMateria;
    submitted: boolean = false;
    cursoMateriaDialog: boolean = false;
    optionCursoMateria: boolean = false;
    eliminarCursoMateriaDialog: boolean = false;

    registroCursoMateria: CursoMateria = {};

    tipoCurso: TipoCurso[] = [];
    tipoMateria: TipoMateriaCombo[] = [];
    tipoRol: TipoRol[] = [];
    tipoPersona: any[] = [];
    tipoEstado: TipoEstado[] = [];

    // Variables ------------------------------------------
    listaInscripcion: Inscripcion[] = [];
    listaInscripcionDuplicated: Inscripcion[] = [];
    listaInscripcionDesactivados: Inscripcion[] = [];
    inscripciones: Inscripcion[] = [];
    linscripciones: Inscripcion[];
    inscripcionDialog: boolean = false;
    optionInscripcion: boolean = false;
    eliminarInscripcionDialog: boolean = false;
    activarInscripcionDialog: boolean = false;
    desactivarInscripcionDialog: boolean = false;

    inscripcion: Inscripcion;
    inscripcionRegistro: InscripcionRegistro = {};

    tipoCursoMateria: TipoCursoMateria[] = [];
    tipoCursoMateriaSeleccionado: TipoCursoMateria;

    // tipoCurso: TipoCurso[] = [];

    tipoMatricula: TipoMatriculaEstudiante[] = [];
    gestionSeleccionado: TipoMatricula;
    loading: boolean = false;
    curmatid: any;

     //----------------Variables para validación----------------//
    inscripcionForm: FormGroup;
     //----------------Variables para validación----------------//
    usuario: Usuario;

    userProfilePhoto = environment.API_URL_PROFILE_PHOTO;
    obtenerInscritos: any;

    items: MenuItem[];
    home: MenuItem | undefined;

    selectedColumns: { field: string; header: string }[];
    colsColumsTable!: ColumsTable[];
    personOptions: TipoPersona2[] = [];

    statusOptions = [
        { label: 'Activo', value: 1 },
        { label: 'Inactivo', value: 0 },
    ];
    
    constructor(
        private messageService: MessageService,
        public reporte: ReporteService,
        public diccionarioService: DiccionarioService,
        private usuarioService: UsuarioService,
        private inscripcionService: InscripcionService,
        private authService: AuthService, // auth para recuperar los datos del usuario logueado
        private formBuilder: FormBuilder, // formBuilder para utilzar las validaciones del react form valid
        private spinner: NgxSpinnerService, // spinner para mostrar el spinner de carga
        private cursoService: CursoService
    ) {
        this.items = [
            { label: 'Inscripción' },
            { label: 'Inscribir estudiante', routerLink: '' },
        ];

        this.home = { icon: 'pi pi-home', routerLink: '/principal' };

        // <th style="min-width:50px text-center">#</th>
        // <th style="min-width:150px text-center">Acciones</th>
        // <th style="min-width:400px">Curso</th>
        // <th style="min-width:200px">Materia</th>
        // <th style="min-width:120px">Fecha Inicio</th>
        // <th style="min-width:120px">Fecha Final</th>
        // <th style="min-width:200px">Docente</th>
        // <th style="min-width:150px">Matricula</th>
        // <th style="min-width:200px">Pago</th>
        // <th style="min-width:100px">Monto (Bs)</th>
        // <th style="min-width:200px">Registrado por</th>
        // <th style="min-width:200px">Modificado por</th>
        // <th style="min-width:100px">Estado</th>

        this.selectedColumns = [
            { field: 'curnombre', header: 'Curso' },
            { field: 'matnombre', header: 'Materia' },            
            { field: 'curmatfecini', header: 'Fecha Inicio (Año/Mes/Dia)' },
            { field: 'curmatfecfin', header: 'Fecha Fin (Año/Mes/Dia)' },
            { field: 'pernombre', header: 'Docente' },
            { field: 'curmatmatricula', header: 'Matricula' },
            { field: 'curmatpago', header: 'Pago' },
            { field: 'curmatcosto', header: 'Costo (Bs)' },
            { field: 'curmatusureg', header: 'Registrado por' },
            { field: 'curmatusumod', header: 'Modificado por' },
            { field: 'insestadodescripcion', header: 'Observación' },
            { field: 'insestado', header: 'Estado' }
        ];
    }

    ngOnInit() {
       this.listarCursoCombo();
       
       this.listarInscripciones(); // Método para listar las inscripciones

       this.obtenerRoles(); // Método para obtener datos para el combo tipo roles

       this.obtenerTipoCursoMateria(); // Método para obtener datos para el combo tipo curso materia

       this.obtenerTipoCurso(); // Método para obtener datos para el combo tipo curso materia

       this.asignacionValidacionesInscripcion(); // Método de asignación de validaciones

       this.getProfileUsuario(); // Método de getProfile() de usuario logeado

    }
    // Método para obtener los tipos de cursos 
    obtenerTipoCurso(){
        this.cursoService.getTipoCurso().subscribe(
            (result: any) => {
            this.tipoCurso = result;
            }
        );
    }

    // Método para obtener los tipos de cursos y materias
    obtenerTipoCursoMateria(){
        this.inscripcionService.listarComboCursoMateria().subscribe(
            (result: any) => {
              this.tipoCursoMateria = result;
            }
          );
    }

    // Función para obtener los tipos de matricula por estudiante
    obtenerTipoMatriculaEstudiante(perid: any){
        this.spinner.show();
        const criterio = { peridestudiante: perid }
        this.inscripcionService.listarComboMatriculaEstudiante(criterio).subscribe(
            (result: any) => {
                this.spinner.hide();
                this.tipoMatricula = result;
            }
        )
    }

    // Método para asignar las variables de React Form Valid
    asignacionValidacionesInscripcion() {
        this.inscripcionForm = this.formBuilder.group({
            insid: [''],
            tipoCurso: ['', [Validators.required]],
            tipoMateria: ['', [Validators.required]],
            tipoMatricula: ['', [Validators.required]],
            tipoRol: ['', [Validators.required]],
            tipoPersona: ['', [Validators.required]],
            insdescripcion: [''],
            insestado: ['', [Validators.required]],
            insestadodescripcion: ['']
        });
    }

    listarCursoCombo(){
        this.cursoService.listaCursoCombo().subscribe(
            (result: any) => {
                this.tipoCurso = result;
            }
        )
    }

    onSelectCurso(data: any){
        const curid = parseInt(data.value.curid);
        this.obtenerTipoMateria(curid);
    }

    obtenerTipoMateria(criterio: any){
        this.spinner.show();
        this.cursoService.getTipoMateriaByCursoId(criterio).subscribe({
            next: (result: any) => { 
                this.spinner.hide();
                this.tipoMateria = result['data']; 
            },
            error: (error: any) => {
                this.loading = false;
                this.spinner.hide();
                console.error(error);
            }
        })
    }

    // Obtener datos del perfil del usuario logeado
    getProfileUsuario() {
        this.authService.getProfile().subscribe(usuario => {
            this.usuario = usuario[0];
        });
    }

    // Función para listar las inscripciones
    listarInscripciones(){
        this.loading = true;
        this.spinner.show();
        this.inscripcionService.listarInscripcion().subscribe({
            next: (result: any) => {
              this.inscripciones = result['data'];
              this.listaInscripcionDuplicated = this.inscripciones;
              this.loading = false;
              this.spinner.hide();
            },
            error: (error: any) => {
                this.loading = false;
                this.spinner.show();
                console.error(error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al recuperar la información de las inscripciones', life: 4000});
            }
        });
    }

    // Función para asignar los valores y sub-valores
    organizarInscripcion(data: any): Inscripcion {
        const inscripcion = new Inscripcion(); // Creamos un variable de tipo Inscripcion
        // Se asignana todas las variables
        inscripcion.insid = data.insid;
        inscripcion.insusureg = data.insusureg;
        inscripcion.insfecreg = data.insfecreg;
        inscripcion.insusumod = data.insusumod;
        inscripcion.insfecmod = data.insfecmod;
        inscripcion.insestado = data.insestado;
        inscripcion.insestadodescripcion = data.insestadodescripcion;
        inscripcion.perfoto = data.perfoto;
        inscripcion.pernombrecompleto = data.pernombrecompletoestudiante;
        /*
        inscripcion.matricula.push({
          matrid: data.matrid,
          tipmatrid: data.tipmatrid,
          tipmatrgestion: data.tipmatrgestion,
          matrestado: data.matrestado,
          matrdescripcion: data.matrdescripcion,
        });

        inscripcion.estudiante.push({
          peridestudiante: data.peridestudiante,
          pernombrecompletoestudiante: data.pernombrecompletoestudiante,
        });

        inscripcion.pago.push({
          pagid: data.pagid,
          pagdescripcion: data.pagdescripcion,
          pagestado: data.pagestado,
          pagestadodescripcion: data.pagestadodescripcion,
          pagmonto: data.pagmonto,
        });

        inscripcion.curso_materia.push({
          curmatid: data.curmatid,
          curmatdescripcion: data.curmatdescripcion,
          curid: data.curid,
          curnombre: data.curnombre,
          matid: data.matid,
          matnombre: data.matnombre,
          curmatfecini: data.curmatfecini,
          curmatfecfin: data.curmatfecfin,
        });

        inscripcion.docente.push({
          periddocente: data.periddocente,
          pernombrecompletodocente: data.pernombrecompletodocente,
          perfoto: data.perfotodocente
        });
        */
        return inscripcion;
    }

    // Función para editar la inscripción
    editarInscripcion(data: any) {
        this.inscripcion = { ...data }; // obtener los datos en inscripcion
        console.log("editar: ", this.inscripcion)
        this.setData(); // se setea los datos en el formulario
        this.inscripcionDialog = true; // abrimos el formulario
        this.optionInscripcion = false; // optioneInscripcion=FALSE por que se va a editar para ocultar algunas partes del formulario
    }

    // Función para abrir nuevo formulario de inscripcion
    abrirNuevo() {
        this.inscripcionRegistro = new InscripcionRegistro(); // se crea una nueva inscripción
        this.inscripcionForm.reset(); // se resetan los datos en la variables inscripcionForm para vaciar los datos
        this.inscripcionDialog = true; // abrimos el formulario
        this.optionInscripcion = true; // la opción optionInscripcion=TRUE por que se realizara un nuevo registro
    }

    // Función para ocultar el formulario
    ocultarDialog(){
        this.inscripcionDialog = false;
        this.inscripcionForm.reset();
    }

    // Función para obtener tipo rol
    obtenerRoles(){
        this.usuarioService.getRoles().subscribe(
            (result: any) => {
                this.tipoRol = result.filter(rol => rol.rolnombre === "Estudiante"); // filtrar solo los roles estudiante y docente
            }
        )
    }

    // Función para obtener las matriculas de un estudiante x al momento de seleccionar el tipo persona
    onSelectEstudianteMatricula(data: any){
        if(data.value.perid){
            const perid = data.value.perid;
            this.obtenerTipoMatriculaEstudiante(perid);
        }
    }

    onSelectPersona(data: any){
        const rolnombre = data.value.rolnombre;
        const criterio = {
            rolnombre: rolnombre
        };
        this.obtenerTipoPersona(criterio);

    }

    obtenerTipoPersona(criterio: any) {
    
        const criterioConsulta = {
            curid: this.inscripcionForm.value.tipoCurso.curid,
            matid: this.inscripcionForm.value.tipoMateria.matid,
            curmatfecini: this.inscripcionForm.value.tipoMateria.curmatfecini,
            curmatfecfin: this.inscripcionForm.value.tipoMateria.curmatfecfin
        };
    
        forkJoin([
            this.diccionarioService.getListaPersonaDocenteCombo(criterio),
            this.inscripcionService.obtenerEstudiantesInscritos(criterioConsulta),
            this.inscripcionService.getCursoMateriaByIds(criterioConsulta)
        ]).subscribe({
            next: ([personas, inscritos, curmatid]: [any[], any, any]) => {
    
                // Verificar curmatid y asignarlo si es válido
                this.curmatid = curmatid?.curmatid || inscritos?.data?.[0]?.curmatid;
                if (!this.curmatid) {
                    console.error("Error: curmatid no está disponible o no es válido.");
                    this.messageService.add({severity: 'error', summary: 'Error', detail: 'Debe elegir un número curmatid válido.', life: 5000});
                    return;
                }
    
                if (!Array.isArray(inscritos['data']) || inscritos['data'].length === 0) {
                    this.messageService.add({severity: 'info', summary: 'Mensaje', detail: 'No hay estudiantes inscritos, se listarán todos los estudiantes.', life: 5000});
                    // Si no hay inscritos, asignar todos los docentes
                    this.tipoPersona = this.mapearEstudiantesAClaseTipoPersona(personas);
                } else {
                    // Filtrar docentes que ya están inscritos
                    this.messageService.add({severity: 'info', summary: 'Mensaje', detail: 'Si hay estudiantes inscritos.', life: 5000});
                    this.tipoPersona = this.filtrarPersonasInscritas(personas, inscritos['data']);
                }
            },
            error: (error: any) => {
                console.error("Error en la solicitud:", error);
                this.messageService.add({severity: 'error', summary: 'Error', detail: 'Ocurrió un error al obtener los datos. Por favor, intente de nuevo.', life: 5000});
            }
        });
    }
    
    mapearEstudiantesAClaseTipoPersona(estudiantes: any[]): TipoPersona2[] {
        return estudiantes.map(estudiante => new TipoPersona2(
            estudiante.perid,
            estudiante.pernomcompleto || '',  // Manejar posibles valores nulos
            estudiante.pernrodoc || 0,        // Manejar posibles valores nulos
            estudiante.perfoto || ''          // Manejar posibles valores nulos
        ));
    }
    
    // Función para filtrar persona ya inscritas, esto ayuda a no inscribir a las mismas personas a los mismos grupos
    filtrarPersonasInscritas(personas: any[], inscritos: any[]): any[] {
        // Asegúrate de que inscritos sea un array de objetos con perid
        const inscritosIds = new Set(inscritos.map(inscrito => inscrito.peridestudiante));
        // Usamos el método filter para filtrar las personas que están inscritas
        const personasFiltradas = personas.filter(persona => {
            // Comprobamos si el id de la persona no está en la lista de inscritos
            const isInscrito = inscritosIds.has(persona.perid);
            return !isInscrito;
        });
        return personasFiltradas;
    }

    // Función para setear los datos en el formulario
    setData(){

        this.obtenerTipoMateria(this.inscripcion.curid);
        const rolnombre = { rolnombre: 'Estudiante' };
        this.diccionarioService.getListaPersonaDocenteCombo(rolnombre).subscribe(
            (result: any) => { this.tipoPersona = result; }
        )
        
        this.obtenerTipoMatriculaEstudiante(this.inscripcion.peridestudiante);

        const criterio = {
            curid: this.inscripcion.curid,
            matid: this.inscripcion.matid,
            curmatfecini: this.inscripcion.curmatfecini,
            curmatfecfin: this.inscripcion.curmatfecfin
        };
        this.inscripcionService.getCursoMateriaByIds(criterio).subscribe(
            (result: any) => {
                this.curmatid = result['curmatid'];
            }
        )

        this.inscripcionForm.patchValue({
            insid: this.inscripcion.insid,
            tipoMatricula: new TipoMatriculaEstudiante(this.inscripcion.matrid, this.inscripcion.tipmatrid, this.inscripcion.tipmatrgestion, this.inscripcion.peridestudiante, this.inscripcion.pernombrecompletoestudiante, this.inscripcion.perfotoestudiante),
            tipoCurso: new TipoCurso(this.inscripcion.curid, this.inscripcion.curnombre),
            tipoMateria: new TipoMateriaCombo(this.inscripcion.matid, this.inscripcion.matnombre, this.inscripcion.curmatfecini, this.inscripcion.curmatfecfin),
            tipoRol: new TipoRol(4, 'Estudiante'),
            tipoPersona: new TipoPersona(this.inscripcion.peridestudiante, this.inscripcion.pernombrecompletoestudiante),
            insestadodescripcion: this.inscripcion.insestadodescripcion,
            insestado: this.inscripcion.insestado
        })
    }

    // FUnción para obtener los datos en la variables incripcionRegistro
    obtenerBody(){
        this.inscripcionRegistro = new InscripcionRegistro();
        this.inscripcionRegistro.insid = this.inscripcionForm.value.insid;
        this.inscripcionRegistro.matrid = this.inscripcionForm.value.tipoMatricula.matrid;
        this.inscripcionRegistro.curmatid = this.curmatid;
        this.inscripcionRegistro.peridestudiante = this.inscripcionForm.value.tipoPersona.perid;        
        this.inscripcionRegistro.insusureg = this.usuario.usuname;
        this.inscripcionRegistro.insestado = this.inscripcionForm.value.insestado;
        this.inscripcionRegistro.insestadodescripcion = this.inscripcionForm.value.insestadodescripcion;
        this.inscripcionRegistro.insusumod = this.usuario.usuname;
        const body = { ...this.inscripcionRegistro }
        return body;
    }

    guardarInscripcion(){
        // Se valida cumplan las validaciones
        if(this.inscripcionForm.invalid){
            this.messageService.add({ severity: 'error', summary: 'Error en el Registro', detail: 'Por favor, verifica la información ingresada e intenta nuevamente.', life: 3000 });
            return Object.values(this.inscripcionForm.controls).forEach(control=>{
                control.markAllAsTouched();
                control.markAsDirty();
            })
        }
        // Obtener todos los campos del registro para enviar al servicio.
        this.obtenerBody();
        // Verifica que true o false, para adicionar o editar
        // Insertar inscripción
        if(this.optionInscripcion){ 
            this.inscripcionRegistro.pagid = null;
            this.inscripcionService.insertarInscripcion(this.inscripcionRegistro).subscribe({
                next: (result: any) => {
                    this.messageService.add({ severity: 'success', summary: 'Exitosa!', detail: 'Inscripción Insertardo', life: 3000 });
                    this.listarInscripciones();
                    this.inscripcionRegistro = {};
                    this.ocultarDialog();
                },
                error: (error: any) => {
                    console.error("error: ", error);
                    let errorMessage = 'Se produjo un error al intentar registrar el usuario.';

                    // Verifica si el error contiene el mensaje específico de violación de clave única
                    if (error.error.message.includes('UniqueViolation')) {
                        errorMessage = 'No se puede agregar el registro, porque ya se encuentra registrado.';
                    }
                    this.messageService.add({ severity: 'error', summary: 'Error de registro', detail: errorMessage, life: 7000});
                }
            });

        }
        // Modificar inscripción
        if(!this.optionInscripcion){
            this.inscripcionRegistro.pagid = this.inscripcion.pagid; 
            this.inscripcionRegistro.insid = this.inscripcion.insid;
            this.inscripcionRegistro.curmatid = this.curmatid;
            console.log("this.inscripcion:modificar:", this.inscripcionRegistro)
            this.inscripcionService.modificarInscripcion(this.inscripcionRegistro).subscribe({
                next: (result: any) => {
                    this.messageService.add({ severity: 'success', summary: 'Exitosa', detail: 'Modificación Inscripcion Existosamente!', life: 3000 });
                    this.listarInscripciones();
                    this.inscripcionRegistro = {};
                    this.ocultarDialog();
                    this.inscripcionForm.reset();
                },
                error: error => {
                    this.messageService.add({severity: 'warn', summary: 'Error', detail: 'Error, algo salio mal.'})
                }
            });
        }
    }

    desactivarInscripcion(data: Inscripcion) {
        this.desactivarInscripcionDialog = true;
        this.inscripcion = { ...data };
        this.inscripcion.tipo = 2;
    }

    activarInscripcion(data: Inscripcion) {
        this.activarInscripcionDialog = true;
        this.inscripcion = { ...data };
        this.inscripcion.tipo = 3;
    }

    confirmarActivarDesactivar() {        
        this.inscripcionRegistro.insusumod = this.usuario.usuname;
        this.inscripcionService.gestionarInscripcionEstado(this.inscripcion).subscribe({
            next: (result: any) => {
                this.messageService.add({ severity: 'success', summary: 'Exitosa!', detail: 'Estado de Inscripción modificado correctamente', life: 3000 });
                this.listarInscripciones();
                this.eliminarInscripcionDialog = false;
                this.activarInscripcionDialog = false;
                this.desactivarInscripcionDialog = false;
            },
            error: error => {
                console.error("error",error);
                this.messageService.add({severity:'warn', summary:'Error', detail: 'Ups! Algo salio mal', life: 5000});
            }
        });
    }

    // Método de busqueda en la tabla
    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }

    // Funciones para obtener el color de la barra de estado
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

    isImageLoaded: boolean = true;

    getInitials(name: string): string {
        if (!name) return '';
        return name.charAt(0).toUpperCase();
    }

    onImageError(): void {
        this.isImageLoaded = false;
    }

    onImageLoad(): void {
        this.isImageLoaded = true;
    }


}
