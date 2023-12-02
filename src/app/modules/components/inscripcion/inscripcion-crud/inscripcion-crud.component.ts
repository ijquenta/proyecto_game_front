import { Component, OnInit } from '@angular/core';
// import { Product } from 'src/app/release/api/product';
import { Usuarios } from 'src/app/modules/models/usuarios';
import { Usuario } from 'src/app/modules/models/usuario';
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

@Component({
    templateUrl: './inscripcion-crud.component.html',
    providers: [MessageService]
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
    gestiones: TipoMatricula[] = [];
    // gestionSeleccionado: number;
    gestionSeleccionado: TipoMatricula;

    curmatid: any;

    constructor(
        private messageService: MessageService,
        private cursoService: CursoService,
        public reporte: ReporteService,
        public diccionarioService: DiccionarioService,
        private usuarioService: UsuarioService,
        private inscripcionService: InscripcionService)
        {
        this.tipoCursoSeleccionado = new TipoCurso(0,"",0);
        this.tipoMateriaSeleccionado = new TipoMateria(0,"",0);
        this.tipoPersonaSeleccionado = new TipoPersona(0,"");
        this.tipoRolSeleccionado = new TipoRol(0,"");
        this.tipoEstadoSeleccionado = new TipoEstado(0, "");
        }

    ngOnInit() {
       this.listarCursoMateria();
       this.listarCursoCombo();
       this.listarInscripciones();
    //    this.gestionSeleccionado = new Date().getFullYear() + 1;
    //    for (let anio = this.gestionSeleccionado; anio >= 2018; anio--) {
    //        this.gestiones.push(anio);
    //    }
       this.inscripcionService.listarComboMatricula().subscribe(
        (result: any) => {
            this.gestiones = result;
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

    }
    listarInscripciones(){
        this.inscripcionService.listarInscripcion().subscribe(
            (result: any) => {
              this.products = result;
              this.inscripciones = this.products.map(item => this.organizarInscripcion(item));
              console.log("Lista inscripciones", this.inscripciones);
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
        });

        inscripcion.docente.push({
          periddocente: data.periddocente,
          pernombrecompletodocente: data.pernombrecompletodocente,
        });

        return inscripcion;
      }
    // ---------------------------------- Funciones Curso Materia  ------------------------

    abrirNuevo() {
        this.inscripcionRegistro = {};
        this.inscripcionDialog = true;
        this.optionInscripcion = true;
        this.gestionSeleccionado = new TipoMatricula(0,0);
        this.tipoCursoSeleccionado = new TipoCurso(0,"",0);
        this.tipoMateriaSeleccionado = new TipoMateria(0,"",0);
        this.tipoPersonaSeleccionado = new TipoPersona(0,"");
        this.tipoRolSeleccionado = new TipoRol(0,"");
        this.tipoEstadoSeleccionado = new TipoEstado(0, "");

        this.tipoCursoMateriaSeleccionado = new TipoCursoMateria(0,"");
    }
    ocultarDialog(){
        this.inscripcionDialog = false;
        // this.optionCursoMateria = false;
    }
    listarCursoCombo(){
        this.cursoService.listaCursoCombo().subscribe(
            (result: any) => {
                this.tipoCurso = result;
                // console.log("Combo TipoCurso", this.tipoCurso)
            }
        )
    }

    listarCursoMateria(){
        this.cursoService.listarCursoMateria().subscribe(
            (result: any) => {
                this.listaCursosMaterias = result;
                // console.log("Combo Cursos Materia", this.listaCursosMaterias)
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
        // console.log("setData:", this.inscripcion);
        this.gestionSeleccionado = new TipoMatricula(this.inscripcion.matricula[0].matrid, this.inscripcion.matricula[0].matrgestion);
        // console.log("Gestion: ",this.gestionSeleccionado);

        this.tipoCursoMateriaSeleccionado = new TipoCursoMateria(this.inscripcion.curso_materia[0].curmatid, this.inscripcion.curso_materia[0].curnombre + ' - ' + this.inscripcion.curso_materia[0].matnombre);
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
        this.tipoRolSeleccionado = new TipoRol(4, 'Estudiante');

        const rolnombre = {
            //  rolnombre: this.inscripcion.estudiante[0].rolnombre
             rolnombre: 'Estudiante'
        };
        this.diccionarioService.getListaPersonaDocenteCombo(rolnombre).subscribe(
            (result: any) => {
                this.tipoPersona = result;
            }
        )
        this.tipoPersonaSeleccionado = new TipoPersona(this.inscripcion.estudiante[0].peridestudiante, this.inscripcion.estudiante[0].pernombrecompletoestudiante);
        this.tipoEstadoSeleccionado = new TipoEstado(this.inscripcion.insestado, this.inscripcion.insestadodescripcion);
    }
    obtenerBody(){
        /*
        this.cursoMateria.curid = this.tipoCursoSeleccionado.curid;
        this.cursoMateria.matid = this.tipoMateriaSeleccionado.matid;
        this.cursoMateria.periddocente = this.tipoPersonaSeleccionado.perid;
        this.cursoMateria.curmatidrol = this.tipoRolSeleccionado.rolid;
        this.cursoMateria.curmatidroldes = this.tipoRolSeleccionado.rolnombre;
        this.cursoMateria.curmatestado = this.tipoEstadoSeleccionado.codTipoEstado;
        this.cursoMateria.curmatusureg = "Ivan Reg";
        this.cursoMateria.curmatusumod = "Ivan Mod";
        this.cursoMateria.curmatestadodescripcion = this.tipoEstadoSeleccionado.desTipoEstado;

        this.matricula.matrgestion = this.gestionSeleccionado;
        this.matricula.matrestado = this.tipoEstadoMatriculaSeleccionado.matrestado;
        this.matricula.matrestadodescripcion = this.tipoEstadoMatriculaSeleccionado.matrestadodescripcion;
        this.matricula.matrfchini = this.fechaInicio;
        this.matricula.matrfchfin = this.fechaFinal;
        this.matricula.matrusureg = 'Usuario Reg';
        this.matricula.matrcos = this.costo;
        */
        // this.inscripcionRegistro.ins = this.gestionSeleccionado;
        // const criterio = {
        //     curid: this.tipoCursoSeleccionado.curnivel,
        //     matid: this.tipoCursoSeleccionado.curnivel
        // };

        // console.log("Criterio", criterio);
        // const curmatid = 0;
        // this.inscripcionService.obtenerCursoMateria(criterio).subscribe((result: any) => {
        //     this.curmatid = result;
        //     console.log("Número de CursoMateria", this.curmatid);

        //     if (this.curmatid && this.curmatid.length > 0) {
        //         const primerElemento = this.curmatid[0]; // Accede al primer elemento del arreglo
        //         this.inscripcionRegistro.curmatid = primerElemento.curmatid; // Accede a la propiedad curmatid del primer elemento
        //         console.log("NUMERO CURSOMATERIA:", this.inscripcionRegistro.curmatid);
        //     } else {
        //         console.log("El arreglo curmatid está vacío o no está definido.");
        //         this.messageService.add({ severity: 'warn', summary: 'Error!', detail: 'Error no se encuentra el curso_materia', life: 3000 });

        //     }
        // });

        this.inscripcionRegistro.matrid = this.gestionSeleccionado.matrid;
        this.inscripcionRegistro.curmatid = this.tipoCursoMateriaSeleccionado.curmatid;
        this.inscripcionRegistro.peridestudiante = this.tipoPersonaSeleccionado.perid;
        this.inscripcionRegistro.pagid = null;
        this.inscripcionRegistro.insusureg = "ijquenta";
        this.inscripcionRegistro.insestado = this.tipoEstadoSeleccionado.codTipoEstado;
        this.inscripcionRegistro.insestadodescripcion = this.tipoEstadoSeleccionado.desTipoEstado;
        this.inscripcionRegistro.insusumod = "ijquenta";
        console.log("BODY", this.inscripcion);
        const body = { ...this.inscripcionRegistro }
        return body;
    }
    guardarInscripcion(){
        this.obtenerBody();
        console.log("Datos a ingresar: ", this.inscripcionRegistro);
        if(this.optionInscripcion){
            this.inscripcionRegistro.insid = null;
            console.log("Insertar");
            this.inscripcionService.insertarInscripcion(this.inscripcionRegistro).subscribe(
                (result: any) => {
                    this.messageService.add({ severity: 'success', summary: 'Exitosa!', detail: 'Inscripción Insertardo', life: 3000 });
                    this.listarInscripciones();
                    this.inscripcionRegistro = {};
                    this.ocultarDialog();
                },
                error => {
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

    // ------------------------------ Funciones Curso Materia -----------------------------

}
