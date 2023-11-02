import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CursoService } from 'src/app/modules/service/data/curso.service';
import { ReporteService } from 'src/app/modules/service/data/reporte.service';
import { TipoMateria } from 'src/app/modules/models/diccionario';
import { DiccionarioService } from 'src/app/modules/service/data/diccionario.service';
import { UsuarioService } from 'src/app/modules/service/data/usuario.service';

import { TipoCurso, TipoRol, TipoPersona, TipoEstado} from 'src/app/modules/models/diccionario';
import { CursoMateria } from 'src/app/modules/models/curso';


@Component({
    templateUrl: './curso-crud.component.html',
    providers: [MessageService]
})
export class CursoCrudComponent implements OnInit {

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
    // -------------------------- Variables Cursos_Materias -------------------------- //



    constructor(
                private messageService: MessageService,
                private cursoService: CursoService,
                public reporte: ReporteService,
                public diccionarioService: DiccionarioService,
                private usuarioServicie: UsuarioService)
                {
                this.tipoCursoSeleccionado = new TipoCurso(0,"",0);
                this.tipoMateriaSeleccionado = new TipoMateria(0,"",0);
                this.tipoPersonaSeleccionado = new TipoPersona(0,"");
                this.tipoRolSeleccionado = new TipoRol(0,"");
                this.tipoEstadoSeleccionado = new TipoEstado(0, "");
                }

    ngOnInit() {
        // console.log("ngOnInit");
        this.listarCursoMateria();
        this.listarCursoCombo();
        this.obtenerRoles();

        this.tipoEstado = [
            new TipoEstado(0, 'FINALIZADO'),
            new TipoEstado(1, 'VIGENTE'),
            new TipoEstado(2, 'OTRO')
        ]
    }
    // ---------------------------------- Funciones Curso Materia  ------------------------
    abrirNuevo() {
        this.cursoMateria = {};
        this.cursoMateriaDialog = true;
        this.optionCursoMateria = true;
        this.tipoCursoSeleccionado = new TipoCurso(0,"",0);
        this.tipoMateriaSeleccionado = new TipoMateria(0,"",0);
        this.tipoPersonaSeleccionado = new TipoPersona(0,"");
        this.tipoRolSeleccionado = new TipoRol(0,"");
        this.tipoEstadoSeleccionado = new TipoEstado(0, "");
    }
    ocultarDialog(){
        this.cursoMateriaDialog = false;
        this.optionCursoMateria = false;
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
                // console.log("Lista Cursos Materia", this.listaCursosMaterias)
            }
        )
    }

    onSelectCurso(data: any){
        console.log("id nivel curso: ", data.value.curnivel);
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
        this.usuarioServicie.getRoles().subscribe(
            (result: any) => {
                this.tipoRol = result;
                console.log("Combo roles: ", this.tipoRol);
            }
        )
    }
    onSelectPersona(data: any){
        console.log("Datos del rol elejido: ", data.value);
        const nombre = data.value.rolnombre;
        const criterio = {
            rolnombre: nombre
        };
        this.obtenerTipoPersona(criterio);

    }
    seleccionarPersona(data: any){
        console.log("rol Nombre: ", data);
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
        this.cursoMateria.curmatfecini = new Date(this.cursoMateria.curmatfecini);
        this.cursoMateria.curmatfecfin = new Date(this.cursoMateria.curmatfecfin);
        this.tipoCursoSeleccionado = new TipoCurso(this.cursoMateria.curid, this.cursoMateria.curnombre, this.cursoMateria.matnivel);

        const curnivel = {
            curnivel: this.tipoCursoSeleccionado.curnivel
        };
        this.diccionarioService.getTipoMateria(curnivel).subscribe(
            (result: any) => {
                this.tipoMateria = result;
            }
        )
        this.tipoMateriaSeleccionado = new TipoMateria(this.cursoMateria.matid, this.cursoMateria.matnombre, this.cursoMateria.matnivel);
        this.tipoRolSeleccionado = new TipoRol(this.cursoMateria.curmatidrol, this.cursoMateria.curmatidroldes);

        const rolnombre = {
            rolnombre: this.tipoRolSeleccionado.rolnombre
        };
        this.diccionarioService.getListaPersonaDocenteCombo(rolnombre).subscribe(
            (result: any) => {
                this.tipoPersona = result;
            }
        )
        this.tipoPersonaSeleccionado = new TipoPersona(this.cursoMateria.periddocente, this.cursoMateria.pernombrecompleto);
        this.tipoEstadoSeleccionado = new TipoEstado(this.cursoMateria.curmatestado, this.cursoMateria.curmatestadodescripcion);
    }
    obtenerBody(){
        // console.log("Obtener Body: ", this.cursoMateria);
        this.cursoMateria.curid = this.tipoCursoSeleccionado.curid;
        this.cursoMateria.matid = this.tipoMateriaSeleccionado.matid;
        this.cursoMateria.periddocente = this.tipoPersonaSeleccionado.perid;
        this.cursoMateria.curmatidrol = this.tipoRolSeleccionado.rolid;
        this.cursoMateria.curmatidroldes = this.tipoRolSeleccionado.rolnombre;
        this.cursoMateria.curmatestado = this.tipoEstadoSeleccionado.codTipoEstado;
        this.cursoMateria.curmatusureg = "Ivan Reg";
        this.cursoMateria.curmatusumod = "Ivan Mod";
        this.cursoMateria.curmatestadodescripcion = this.tipoEstadoSeleccionado.desTipoEstado;

        const body = { ...this.cursoMateria }
        // console.log("body: ", body);
        return body;
    }
    guardarCursoMateria(){
        this.obtenerBody();
        if(this.optionCursoMateria){
            this.cursoService.insertarCursoMateria(this.cursoMateria).subscribe(
                (result: any) => {
                    this.messageService.add({ severity: 'success', summary: 'Exitosa!', detail: 'Curso-Materia Insertardo', life: 3000 });
                    this.listarCursoMateria();
                    this.cursoMateria = {};
                    this.ocultarDialog();
                },
                error => {
                console.log("error",error);
                const descripcionError = error.error.message;
                    this.messageService.add({severity:'warn', summary:'Error', detail: descripcionError, life: 5000});
                }
            );
        }
        else{
            console.log("Datos cursoMateria: ", this.cursoMateria);
            console.log("Modificar es aqui!")
            this.cursoService.modificarCursoMateria(this.cursoMateria).subscribe(
                (result: any) => {
                    this.messageService.add({ severity: 'success', summary: 'Exitosa', detail: 'Modificación Curso-Materia Existosamente!', life: 3000 });
                    this.listarCursoMateria();
                    this.cursoMateria = {};
                    this.ocultarDialog();
                },
                error => {
                    const descripcionError = error.erro.message;
                    this.messageService.add({severity: 'warn', summary: 'Error', detail: 'Error, algo salio mal.'})
                }

            )
        }
    }
    eliminarCursoMateria(data: CursoMateria) {
        this.eliminarCursoMateriaDialog = true;
        this.cursoMateria = { ...data };
        console.log("CursoMateria:", this.cursoMateria);
    }
    confirmarEliminar() {
        console.log("confirmarEliminar: ", this.cursoMateria)
        const criterio = {
            curmatid: this.cursoMateria.curmatid
        }
        console.log("criterio: ", criterio)
        this.cursoService.eliminarCursoMateria(criterio).subscribe(
            (result: any) => {
                this.messageService.add({ severity: 'success', summary: 'Exitosa!', detail: 'Curso-Materia Eliminado', life: 3000 });
                this.listarCursoMateria();
                this.eliminarCursoMateriaDialog = false;
                this.cursoMateria = {};
            },
            error => {
            console.log("error",error);
            const descripcionError = error.error.message;
                this.messageService.add({severity:'warn', summary:'Error', detail: descripcionError, life: 5000});
            }
        );
    }

    // ------------------------------ Funciones Curso Materia -----------------------------
}
