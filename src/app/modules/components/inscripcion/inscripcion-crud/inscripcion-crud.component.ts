import { Component, OnInit } from '@angular/core';
// import { Product } from 'src/app/release/api/product';
import { Usuarios } from 'src/app/modules/models/usuarios';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
// import { ProductService } from 'src/app/release/service/product.service';
import { UsuarioService } from 'src/app/modules/service/data/usuario.service';
import { ReporteService } from 'src/app/modules/service/data/reporte.service';



// ----------------------- Importaciones ----------------------------
import { TipoCurso, TipoRol, TipoPersona, TipoEstado, TipoMateria, TipoCursoMateria, TipoMatricula} from 'src/app/modules/models/diccionario';
import { CursoMateria } from 'src/app/modules/models/curso';
import { CursoService } from 'src/app/modules/service/data/curso.service';
import { DiccionarioService } from 'src/app/modules/service/data/diccionario.service';

import { InscripcionService } from 'src/app/modules/service/data/inscripcion.service';
import { Inscripcion, InscripcionRegistro } from 'src/app/modules/models/inscripcion';

// --------------- Modelo Usuario
import { Usuario } from 'src/app/modules/models/usuario';

// --------------- Importación de Autenticación
import { AuthService } from 'src/app/services/auth.service';

// --------------- Importación para validaciones
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { NgxSpinnerService } from 'ngx-spinner';
@Component({
    templateUrl: './inscripcion-crud.component.html',
    providers: [MessageService],
    styleUrls: ['../../../../app.component.css']
})
export class InscripcionCrudComponent implements OnInit {

    productDialog: boolean = false;

    deleteProductDialog: boolean = false;

    deleteProductsDialog: boolean = false;

    // products: Usuario[] = [];

    // product: Product = {};
    product: Usuarios = {};

    selectedProducts: Usuario[] = [];

    listaUsuarios: Usuario[] = [];
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
    tipoCursoSeleccionado: TipoCurso;

    tipoMateria: TipoMateria[] = [];
    tipoMateriaSeleccionado: TipoMateria;

    tipoRol: TipoRol[] = [];
    tipoRolSeleccionado: TipoRol;

    tipoPersona: TipoPersona[] = [];
    tipoPersonaSeleccionado: TipoPersona;

    tipoEstado: TipoEstado[] = [];
    tipoEstadoSeleccionado: TipoEstado;


    // Variables ------------------------------------------
    listaInscripcion: Inscripcion[] = [];
    inscripciones: Inscripcion[] = [];
    products: Inscripcion[];
    inscripcionDialog: boolean = false;
    optionInscripcion: boolean = false;
    eliminarInscripcionDialog: boolean = false;
    inscripcion: Inscripcion;
    inscripcionRegistro: InscripcionRegistro = {};

    tipoCursoMateria: TipoCursoMateria[] = [];
    tipoCursoMateriaSeleccionado: TipoCursoMateria;

    // gestiones: number[] = [];
    tipoMatricula: TipoMatricula[] = [];
    // gestionSeleccionado: number;
    gestionSeleccionado: TipoMatricula;
    loading: boolean = false;
    curmatid: any;

     //----------------Variables para validación----------------//
     inscripcionForm: FormGroup;
     //----------------Variables para validación----------------//
     usuario: Usuario;

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
        this.tipoCursoSeleccionado = new TipoCurso(0,"",0);
        this.tipoMateriaSeleccionado = new TipoMateria(0,"",0);
        this.tipoPersonaSeleccionado = new TipoPersona(0,"");
        this.tipoRolSeleccionado = new TipoRol(0,"");
        this.tipoEstadoSeleccionado = new TipoEstado(0, "");
        }

    ngOnInit() {
    //    this.listarCursoMateria();
       this.listarCursoCombo();
       this.listarInscripciones();
    //    this.gestionSeleccionado = new Date().getFullYear() + 1;
    //    for (let anio = this.gestionSeleccionado; anio >= 2018; anio--) {
    //        this.gestiones.push(anio);
    //    }
       this.inscripcionService.listarComboMatricula().subscribe(
        (result: any) => {
            this.tipoMatricula = result;
        }
       )
       this.obtenerRoles();

       this.tipoEstado = [
           new TipoEstado(0, 'FINALIZADO'),
           new TipoEstado(1, 'VIGENTE'),
           new TipoEstado(2, 'OTRO')
       ]
       this.inscripcionService.listarComboCursoMateria().subscribe(
        (result: any) => {
          this.tipoCursoMateria = result;
          console.log("Lista Curso Materia: ", this.tipoCursoMateria);
        }
      );

       // Método de asignación de validaciones
       this.asignacionValidacionesInscripcion();

       // Método de getPerfil() de usuario logeado
       this.getPerfilUsuario();

    }

    // Método para asignar las variables de React Form Valid
    asignacionValidacionesInscripcion() {
        //----- Asignación de la validaciones
        this.inscripcionForm = this.formBuilder.group({
            insid: [''],
            tipoMatricula: ['', [Validators.required]],
            tipoCursoMateria: ['', [Validators.required]],
            tipoRol: ['', [Validators.required]],
            tipoPersona: ['', [Validators.required]],
        });
    }
    // Obtener datos del perfil del usuario logeado
    getPerfilUsuario() {
        this.authService.getPerfil().subscribe(usuario => {
            this.usuario = usuario[0];
        });
    }

    listarInscripciones(){
        this.loading = true;
        this.spinner.show();
        this.inscripcionService.listarInscripcion().subscribe(
            (result: any) => {
              this.products = result;
              this.spinner.hide();
              this.inscripciones = this.products.map(item => this.organizarInscripcion(item));
              console.log("Lista inscripciones", this.inscripciones);
              this.loading = false;
            }
          );
    }
    editarInscripcion(data: any) {
        this.inscripcion = { ...data };
        console.log("Datos para editar: ",this.inscripcion);
        this.setData();
        this.inscripcionDialog = true;
        this.optionInscripcion = false;
    }
    organizarInscripcion(data: any): Inscripcion {
        const inscripcion = new Inscripcion();
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
          matrgestion: data.matrgestion,
          matrestado: data.matrestado,
          matrestadodescripcion: data.matrestadodescripcion,
        });

        inscripcion.estudiante.push({
          peridestudiante: data.peridestudiante,
          pernombrecompletoestudiante: data.pernombrecompletoestudiante,
          peridrol: data.peridrol,
          rolnombre: data.rolnombre
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
        });

        return inscripcion;
      }
    // ---------------------------------- Funciones Curso Materia  ------------------------

    abrirNuevo() {
        this.inscripcionRegistro = new InscripcionRegistro();
        this.inscripcionForm.reset();
        this.inscripcionDialog = true;
        this.optionInscripcion = true;
        // this.gestionSeleccionado = new TipoMatricula(0,0);
        // this.tipoCursoSeleccionado = new TipoCurso(0,"",0);
        // this.tipoMateriaSeleccionado = new TipoMateria(0,"",0);
        // this.tipoPersonaSeleccionado = new TipoPersona(0,"");
        // this.tipoRolSeleccionado = new TipoRol(0,"");
        // this.tipoEstadoSeleccionado = new TipoEstado(0, "");

        // this.tipoCursoMateriaSeleccionado = new TipoCursoMateria(0,"");
    }
    ocultarDialog(){
        this.inscripcionDialog = false;
        // this.optionCursoMateria = false;
    }
    listarCursoCombo(){
        this.cursoService.listaCursoCombo().subscribe(
            (result: any) => {
                this.tipoCurso = result;
                console.log("Combo TipoCurso", this.tipoCurso)
            }
        )
    }

    listarCursoMateria(){
        this.cursoService.listarCursoMateria().subscribe(
            (result: any) => {
                this.listaCursosMaterias = result;
                console.log("Combo Cursos Materia", this.listaCursosMaterias)
            }
        )
    }

    onSelectCurso(data: any){
        // console.log("id nivel curso: ", data.value.curnivel);
        const nivel = parseInt(data.value.curnivel);

        const criterio = {
            curnivel: nivel
        };

        this.obtenerTipoMateria(criterio);
    }

    obtenerTipoMateria(criterio: any){
        this.diccionarioService.getTipoMateria(criterio).subscribe(
            (result: any) => {
                this.tipoMateria = result;
                // console.log("Lista Combo Materia: ", this.tipoMateria)
            }
        )
    }

    obtenerRoles(){
        this.usuarioService.getRoles().subscribe(
            (result: any) => {
                // this.tipoRol = result;
                this.tipoRol = result.filter(rol => rol.rolnombre === "Estudiante");
                console.log("Combo roles: ", this.tipoRol);
            }
        )
    }

    onSelectPersona(data: any){
        // console.log("Datos del rol elejido: ", data.value);
        const nombre = data.value.rolnombre;
        const criterio = {
            rolnombre: nombre
        };
        this.obtenerTipoPersona(criterio);

    }

    seleccionarPersona(data: any){
        // console.log("rol Nombre: ", data);
        const nombre = data;
        const criterio = {
            rolnombre: nombre
        };
        this.obtenerTipoPersona(criterio);

    }

    obtenerTipoPersona(criterio: any){
        this.diccionarioService.getListaPersonaDocenteCombo(criterio).subscribe(

            (result: any) => {
                this.tipoPersona = result;
                // console.log("Tipo Persona: ", this.tipoPersona)

            }
        )
    }

    editarCursoMateria(data: any){
        this.cursoMateria = { ...data };
        this.setData();
        this.cursoMateriaDialog = true;
        this.optionCursoMateria = false;
    }

    setData(){
        // this.tipoCursoSeleccionado = new TipoCurso(this.cursoMateria.curid, this.cursoMateria.curnombre, this.cursoMateria.matnivel);
        console.log("setData:", this.inscripcionForm.value);
        console.log("setData 2:", this.inscripcion);

        const rolnombre = {
            //  rolnombre: this.inscripcion.estudiante[0].rolnombre
             rolnombre: 'Estudiante'
        };
        this.diccionarioService.getListaPersonaDocenteCombo(rolnombre).subscribe(
            (result: any) => {
                this.tipoPersona = result;
            }
        )

        this.inscripcionForm.patchValue({
            insid:this.inscripcion.insid,
            tipoMatricula: new TipoMatricula(this.inscripcion.matricula[0]?.matrid, this.inscripcion.matricula[0].matrgestion),
            tipoCursoMateria:new TipoCursoMateria(this.inscripcion.curso_materia[0].curmatid, this.inscripcion.curso_materia[0].curnombre + ' - ' + this.inscripcion.curso_materia[0].matnombre + ' - ' +this.inscripcion.curso_materia[0].curmatfecini + ' a ' +this.inscripcion.curso_materia[0].curmatfecfin),
            tipoRol: new TipoRol(4, 'Estudiante'),
            tipoPersona: new TipoPersona(this.inscripcion.estudiante[0].peridestudiante, this.inscripcion.estudiante[0].pernombrecompletoestudiante)
        })

        // const curnivel = {
        //     curnivel: this.tipoCursoSeleccionado.curnivel
        // };
        // this.diccionarioService.getTipoMateria(curnivel).subscribe(
        //     (result: any) => {
        //         this.tipoMateria = result;
        //     }
        // )
        // this.tipoMateriaSeleccionado = new TipoMateria(this.cursoMateria.matid, this.cursoMateria.matnombre, this.cursoMateria.matnivel);
        // this.tipoRolSeleccionado = new TipoRol(this.inscripcion.estudiante[0].peridrol, this.inscripcion.estudiante[0].rolnombre);


    }
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

        if(this.inscripcionForm.invalid){
            console.log("inscripcionForm.value: ", this.inscripcionForm.value);
            this.messageService.add({ severity: 'error', summary: 'Error en el Registro', detail: 'Por favor, verifica la información ingresada e intenta nuevamente.', life: 3000 });
            return Object.values(this.inscripcionForm.controls).forEach(control=>{
                control.markAllAsTouched();
                control.markAsDirty();
            })
        }
        this.obtenerBody();
        console.log("Datos a ingresar: ", this.inscripcionRegistro);
        if(this.optionInscripcion){
            this.inscripcionService.insertarInscripcion(this.inscripcionRegistro).subscribe(
                (result: any) => {
                    this.messageService.add({ severity: 'success', summary: 'Exitosa!', detail: 'Inscripción Insertardo', life: 3000 });
                    this.listarInscripciones();
                    this.inscripcionRegistro = {};

                    this.ocultarDialog();
                },
                (error: any) => {
                console.log("error",error);
                    this.messageService.add({severity: 'warn', summary: 'Error', detail: 'Error, algo salio mal. No puede registrar al mismo estudiante.'})
                }
            );

        }
        else{
            console.log("Modificar");
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
    eliminarInscripcion(data: Inscripcion) {
        this.eliminarInscripcionDialog = true;
        this.inscripcion = { ...data };
        // console.log("eliminarInscripcion:", this.inscripcion);
    }
    confirmarEliminar() {
        // console.log("confirmarEliminar: ", this.inscripcion);
        const criterio = {
            insid: this.inscripcion.insid
        }
        console.log("criterio: ", criterio)
        this.inscripcionService.eliminarInscripcion(criterio).subscribe(
            (result: any) => {
                this.messageService.add({ severity: 'success', summary: 'Exitosa!', detail: 'Inscripción Eliminado', life: 3000 });
                this.listarInscripciones();
                this.eliminarInscripcionDialog = false;
                // this.inscripcion = {};
            },
            error => {
            console.log("error",error);
            const descripcionError = error.error.message;
                this.messageService.add({severity:'warn', summary:'Error', detail: descripcionError, life: 5000});
            }
        );
    }
    // getSeverity(status: string) {
    //     switch (status) {
    //         case 'INSTOCK':
    //             return 'success';
    //         case 'LOWSTOCK':
    //             return 'warning';
    //         case 'OUTOFSTOCK':
    //             return 'danger';
    //     }
    // }

    // getStatusSeverity(status: string){
    //     switch (status) {
    //         case 'PENDING':
    //             return 'warning';
    //         case 'DELIVERED':
    //             return 'success';
    //         case 'CANCELLED':
    //             return 'danger'
    //     }
    // }

    // Método de busqueda en la tabla
    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }
    obtenerSeverityEstado(estado: number): string {
        switch (estado) {
            case 1:
                return 'success';
            case 0:
                return 'danger';
            default:
                return 'info';
        }
    }

    obtenerDescripcionEstado(estado: number): string {
        switch (estado) {
            case 1:
                return 'Activo';
            case 0:
                return 'Inactivo';
            default:
                return 'Ninguno';
        }
    }
    // ------------------------------ Funciones Curso Materia -----------------------------

}
