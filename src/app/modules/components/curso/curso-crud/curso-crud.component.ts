import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CursoService } from 'src/app/modules/service/data/curso.service';
import { ReporteService } from 'src/app/modules/service/data/reporte.service';
import { TipoMateria } from 'src/app/modules/models/diccionario';
import { DiccionarioService } from 'src/app/modules/service/data/diccionario.service';
import { UsuarioService } from 'src/app/modules/service/data/usuario.service';

import { TipoCurso, TipoRol, TipoPersona, TipoEstado} from 'src/app/modules/models/diccionario';
import { CursoMateria } from 'src/app/modules/models/curso';

// --------------- Modelo Usuario
import { Usuario } from 'src/app/modules/models/usuario';

// --------------- Importación de Autenticación
import { AuthService } from 'src/app/services/auth.service';

// --------------- Importación para validaciones
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
    templateUrl: './curso-crud.component.html',
    providers: [MessageService],
    styleUrls: ['../../../../app.component.css']
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

    loading: boolean = false;
    // -------------------------- Variables Cursos_Materias -------------------------- //

    //----------------Variables para validación----------------//
    cursoForm: FormGroup;
    //----------------Variables para validación----------------//
    usuario: Usuario;

    constructor(
                private messageService: MessageService,
                private cursoService: CursoService,
                public reporte: ReporteService,
                public diccionarioService: DiccionarioService,
                private usuarioServicie: UsuarioService,
                private authService: AuthService, // auth para recuperar los datos del usuario logueado
                private formBuilder: FormBuilder, // formBuilder para utilzar las validaciones del react form valid
                )
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
        this.obtenerRoles();

        this.tipoEstado = [
            new TipoEstado(0, 'FINALIZADO'),
            new TipoEstado(1, 'VIGENTE'),
            new TipoEstado(2, 'OTRO')
        ];

        // Método de asignación de validaciones
        this.asignacionValidacionesCurso();

        // Método de getPerfil() de usuario logeado
        this.getPerfilUsuario();
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
        });
    }
    // Obtener datos del perfil del usuario logeado
    getPerfilUsuario() {
        this.authService.getPerfil().subscribe(usuario => {
            this.usuario = usuario[0];
        });
    }

    // ---------------------------------- Funciones Curso Materia  ------------------------
    abrirNuevo() {
        this.cursoForm.reset();
        this.cursoMateria = new CursoMateria();
        this.cursoMateriaDialog = true;
        this.optionCursoMateria = true;
        // this.tipoCursoSeleccionado = new TipoCurso(0,"",0);
        // this.tipoMateriaSeleccionado = new TipoMateria(0,"",0);
        // this.tipoPersonaSeleccionado = new TipoPersona(0,"");
        // this.tipoRolSeleccionado = new TipoRol(0,"");
        // this.tipoEstadoSeleccionado = new TipoEstado(0, "");
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
                // console.log("Combo TipoCurso", this.tipoCurso)
            }
        )
    }

    listarCursoMateria(){
        this.loading = true;
        this.cursoService.listarCursoMateria().subscribe(
            (result: any) => {
                this.listaCursosMaterias = result;
                this.loading = false;
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
                // console.log("Combo roles: ", this.tipoRol);
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
        // this.cursoForm.reset();
        this.cursoMateria = { ...data };
        console.log("edi: ", this.cursoMateria)
        this.setData();
        this.cursoMateriaDialog = true;
        this.optionCursoMateria = false;
    }

    setData(){
        console.log("set1: ", this.cursoForm.value)

        const curnivel = {
            curnivel: this.cursoMateria.curnivel
        };

        this.diccionarioService.getTipoMateria(curnivel).subscribe(
            (result: any) => {
                this.tipoMateria = result;
            }
        )

        const rolnombre = {
            rolnombre: this.cursoMateria.rolnombre
        };

        this.diccionarioService.getListaPersonaDocenteCombo(rolnombre).subscribe(
            (result: any) => {
                this.tipoPersona = result;
            }
        )

        this.cursoForm.patchValue({
            curmatid: this.cursoMateria.curmatid,
            tipoCurso: new TipoCurso(this.cursoMateria.curid, this.cursoMateria.curnombre, this.cursoMateria.matnivel),
            tipoMateria: new TipoMateria(this.cursoMateria.matid, this.cursoMateria.matnombre, this.cursoMateria.matnivel),
            tipoRol: new TipoRol(this.cursoMateria.curmatidrol, this.cursoMateria.curmatidroldes),
            tipoPersona: new TipoPersona(this.cursoMateria.periddocente, this.cursoMateria.pernomcompleto),
            curmatfecini: this.cursoMateria.curmatfecini,
            curmatfecfin: this.cursoMateria.curmatfecfin,
        })

        console.log("set: ", this.cursoForm.value)
    }
    obtenerBody(){
        this.cursoMateria = new CursoMateria();
        console.log("cursoForm body: ", this.cursoForm.value);
        this.cursoMateria.curmatid = this.cursoForm.value.curmatid;
        this.cursoMateria.curid = this.cursoForm.value.tipoCurso.curid;
        this.cursoMateria.matid = this.cursoForm.value.tipoMateria.matid;
        this.cursoMateria.periddocente = this.cursoForm.value.tipoPersona.perid;
        this.cursoMateria.curmatidrol = this.cursoForm.value.tipoRol.rolid;
        this.cursoMateria.curmatidroldes = this.cursoForm.value.tipoRol.rolnombre;
        this.cursoMateria.curmatfecini = this.cursoForm.value.curmatfecini;
        this.cursoMateria.curmatfecfin = this.cursoForm.value.curmatfecfin;
        this.cursoMateria.curmatestado = 1;
        this.cursoMateria.curmatestadodescripcion="";
        this.cursoMateria.curmatusureg = this.usuario.usuname;
        this.cursoMateria.curmatusumod = this.usuario.usuname;
        const body = { ...this.cursoMateria }
        return body;
    }
    guardarCursoMateria(){
        this.obtenerBody();
        if(this.cursoForm.invalid){
            console.log("cursoForm.value: ", this.cursoForm.value);
            this.messageService.add({ severity: 'error', summary: 'Error en el Registro', detail: 'Por favor, verifica la información ingresada e intenta nuevamente.', life: 3000 });
            return Object.values(this.cursoForm.controls).forEach(control=>{
                control.markAllAsTouched();
                control.markAsDirty();
            })
        }

        if(this.optionCursoMateria){
            console.log("casi new: ", this.cursoMateria)
            this.cursoService.insertarCursoMateria(this.cursoMateria).subscribe(
                (result: any) => {
                    this.messageService.add({ severity: 'success', summary: 'Exitosa!', detail: 'Curso-Materia Insertardo', life: 3000 });
                    this.listarCursoMateria();
                    this.cursoMateria = new CursoMateria();
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
            console.log("casi mod: ", this.cursoMateria)
            this.cursoService.modificarCursoMateria(this.cursoMateria).subscribe(
                (result: any) => {
                    this.messageService.add({ severity: 'success', summary: 'Exitosa', detail: 'Modificación Curso-Materia Existosamente!', life: 3000 });
                    this.listarCursoMateria();
                    this.cursoMateria = new CursoMateria();
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
