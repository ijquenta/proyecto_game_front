import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { forkJoin } from 'rxjs';

// Importación para validaciones
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
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
import { Usuarios } from 'src/app/modules/models/usuarios';
import { TipoMatriculaEstudiante } from 'src/app/modules/models/inscripcion';
import { TipoCurso, TipoRol, TipoPersona, TipoPersona2, TipoEstado, TipoMateria, TipoCursoMateria, TipoMatricula} from 'src/app/modules/models/diccionario';
import { CursoMateria } from 'src/app/modules/models/curso';
import { Inscripcion, InscripcionRegistro } from 'src/app/modules/models/inscripcion';
import { Usuario } from 'src/app/modules/models/usuario';

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
    tipoMateria: TipoMateria[] = [];
    tipoRol: TipoRol[] = [];
    tipoPersona: TipoPersona2[] = [];
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
    constructor(
        private messageService: MessageService,
        private cursoService: CursoService,
        public reporte: ReporteService,
        public diccionarioService: DiccionarioService,
        private usuarioService: UsuarioService,
        private inscripcionService: InscripcionService,
        private authService: AuthService, // auth para recuperar los datos del usuario logueado
        private formBuilder: FormBuilder, // formBuilder para utilzar las validaciones del react form valid
        private spinner: NgxSpinnerService, // spinner para mostrar el spinner de carga
        )
        {
        }

    ngOnInit() {

       this.listarInscripciones(); // Método para listar las inscripciones

       this.obtenerRoles(); // Método para obtener datos para el combo tipo roles

       this.obtenerTipoCursoMateria(); // Método para obtener datos para el combo tipo curso materia

       this.asignacionValidacionesInscripcion(); // Método de asignación de validaciones

       this.getProfileUsuario(); // Método de getProfile() de usuario logeado

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
        const criterio = { peridestudiante: perid }
        this.inscripcionService.listarComboMatriculaEstudiante(criterio).subscribe(
            (result: any) => { this.tipoMatricula = result; console.log("datosTipoMatriculaEstudiante: ", this.tipoMatricula)}
        )
    }

    // Método para asignar las variables de React Form Valid
    asignacionValidacionesInscripcion() {
        this.inscripcionForm = this.formBuilder.group({
            insid: [''],
            tipoMatricula: ['', [Validators.required]],
            tipoCursoMateria: ['', [Validators.required]],
            tipoRol: ['', [Validators.required]],
            tipoPersona: ['', [Validators.required]],
            insdescripcion: ['']
        });
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
        this.inscripcionService.listarInscripcion().subscribe(
            (result: any) => {
              this.linscripciones = result;
            //   console.log("lista de inscripciones: ", this.linscripciones);
              this.spinner.hide();
              this.inscripciones = this.linscripciones.map(item => this.organizarInscripcion(item));
              this.listaInscripcionDuplicated = this.inscripciones;
              this.listaInscripcionDesactivados = this.inscripciones.filter(item => item.insestado == 0);
              this.inscripciones = this.inscripciones.filter(item => item.insestado == 1);
            //   console.log("Lista inscripciones", this.inscripciones);
              this.loading = false;
            }
          );
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

        return inscripcion;
    }

    // Función para editar la inscripción
    editarInscripcion(data: any) {
        this.inscripcion = { ...data }; // obtener los datos en inscripcion
        // console.log("Datos para editar: ",this.inscripcion); // mostramos los datos en console.log
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
                // console.log("Combo roles: ", this.tipoRol);
            }
        )
    }

    // Función para obtener las matriculas de un estudiante x al momento de seleccionar el tipo persona
    onSelectEstudianteMatricula(data: any){
        // console.log("Dato elejido: ", data.value);
        const perid = data.value.perid;
        this.obtenerTipoMatriculaEstudiante(perid);

    }

    onSelectPersona(data: any){
        const nombre = data.value.rolnombre;
        const criterio = {
            rolnombre: nombre
        };
        this.obtenerTipoPersona(criterio);

    }

    // Función obtener el tipo persona este con un criterio
    obtenerTipoPersona(criterio: any) {
        forkJoin([
            this.diccionarioService.getListaPersonaDocenteCombo(criterio),
            this.inscripcionService.obtenerEstudiantesInscritos({ curmatid: this.inscripcionForm.value.tipoCursoMateria.curmatid })
        ]).subscribe(([personas, inscritos]) => {
            // console.log("Personas:", personas);
            // console.log("Estudiantes inscritos:", inscritos);
            const personasFiltradas = this.filtrarPersonasInscritas(personas, inscritos);
            this.tipoPersona = personasFiltradas;
        }, error => {
            console.error("Error:", error);
        });
    }

    // Función para filtrar persona ya inscritas, esto ayuda a no inscribir a las mismas personas a los mismos grupos
    filtrarPersonasInscritas(personas: any, inscritos: any): any[] {
        // Usamos el método filter para filtrar las personas que están inscritas
        return personas.filter(persona => {
            // Comprobamos si el id de la persona está en la lista de inscritos
            return !inscritos.some(inscrito => inscrito.perid === persona.perid);
        });
    }

    // Función para setear los datos en el formulario
    setData(){
        const rolnombre = { rolnombre: 'Estudiante' };
        this.diccionarioService.getListaPersonaDocenteCombo(rolnombre).subscribe(
            (result: any) => { this.tipoPersona = result; }
        )
        this.obtenerTipoMatriculaEstudiante(this.inscripcion.estudiante[0].peridestudiante);

        this.inscripcionForm.patchValue({
            insid:this.inscripcion.insid,
            tipoMatricula: new TipoMatriculaEstudiante(this.inscripcion.matricula[0].matrid, this.inscripcion.matricula[0]?.tipmatrid, this.inscripcion.matricula[0].tipmatrgestion, this.inscripcion.estudiante[0].peridestudiante, this.inscripcion.estudiante[0].pernombrecompletoestudiante, this.inscripcion.perfoto),
            tipoCursoMateria:new TipoCursoMateria(this.inscripcion.curso_materia[0].curmatid, this.inscripcion.curso_materia[0].curnombre + ' - ' + this.inscripcion.curso_materia[0].matnombre + ' - ' +this.inscripcion.curso_materia[0].curmatfecini + ' a ' +this.inscripcion.curso_materia[0].curmatfecfin),
            tipoRol: new TipoRol(4, 'Estudiante'),
            tipoPersona: new TipoPersona(this.inscripcion.estudiante[0].peridestudiante, this.inscripcion.estudiante[0].pernombrecompletoestudiante)
        })
        // console.log("set: ",this.inscripcionForm.value)
        // console.log("Set TipoPersona: ", this.inscripcionForm.value.tipoPersona)
    }

    // FUnción para obtener los datos en la variables incripcionRegistro
    obtenerBody(){
        this.inscripcionRegistro = new InscripcionRegistro();
        this.inscripcionRegistro.insid = this.inscripcionForm.value.insid;
        this.inscripcionRegistro.matrid = this.inscripcionForm.value.tipoMatricula.matrid;
        this.inscripcionRegistro.curmatid = this.inscripcionForm.value.tipoCursoMateria.curmatid;
        this.inscripcionRegistro.peridestudiante = this.inscripcionForm.value.tipoPersona.perid;
        this.inscripcionRegistro.pagid = null;
        this.inscripcionRegistro.insusureg = this.usuario.usuname;
        this.inscripcionRegistro.insestado = 1;
        this.inscripcionRegistro.insestadodescripcion = "";
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
        this.obtenerBody();
        // console.log("Datos a ingresar: ", this.inscripcionRegistro);
        if(this.optionInscripcion){ // Verifica que true o false, para adicionar o editar
            this.inscripcionService.insertarInscripcion(this.inscripcionRegistro).subscribe(
                (result: any) => {
                    this.messageService.add({ severity: 'success', summary: 'Exitosa!', detail: 'Inscripción Insertardo', life: 3000 });
                    this.listarInscripciones();
                    this.inscripcionRegistro = {};
                    this.ocultarDialog();
                },
                (error: any) => {
                    // console.log("error",error);
                    // this.messageService.add({severity: 'warn', summary: 'Error', detail: 'Error, algo salio mal. No puede registrar al mismo estudiante.'})

                    console.log("error: ", error);
                    let errorMessage = 'Se produjo un error al intentar registrar el usuario.';

                    // Verifica si el error contiene el mensaje específico de violación de clave única
                    if (error.error.message.includes('UniqueViolation')) {
                        errorMessage = 'No se puede agregar el registro, porque ya se encuentra registrado.';
                    }

                    this.messageService.add({ severity: 'error', summary: 'Error de registro', detail: errorMessage, life: 7000});
                }
            );

        }
        else{
            this.inscripcionRegistro.insid = this.inscripcion.insid;
            this.inscripcionService.modificarInscripcion(this.inscripcionRegistro).subscribe(
                (result: any) => {
                    this.messageService.add({ severity: 'success', summary: 'Exitosa', detail: 'Modificación Inscripcion Existosamente!', life: 3000 });
                    this.listarInscripciones();
                    this.inscripcionRegistro = {};
                    this.ocultarDialog();
                    this.inscripcionForm.reset();
                },
                error => {
                    this.messageService.add({severity: 'warn', summary: 'Error', detail: 'Error, algo salio mal.'})
                }
            )
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
        this.inscripcion.insusumod = this.usuario.usuname;
        // console.log("criterio: ", this.inscripcion)
        this.inscripcionService.gestionarInscripcionEstado(this.inscripcion).subscribe(
            (result: any) => {
                this.messageService.add({ severity: 'success', summary: 'Exitosa!', detail: 'Estado de Inscripción modificado correctamente', life: 3000 });
                this.listarInscripciones();
                this.eliminarInscripcionDialog = false;
                this.activarInscripcionDialog = false;
                this.desactivarInscripcionDialog = false;
            },
            error => {
            console.log("error",error);
                this.messageService.add({severity:'warn', summary:'Error', detail: 'Ups! Algo salio mal', life: 5000});
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


}
