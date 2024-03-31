import { Component, OnInit } from '@angular/core';
import { Materia } from 'src/app/modules/models/materia';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { MateriaService } from 'src/app/modules/service/data/materia.service';
import { ReporteService } from 'src/app/modules/service/data/reporte.service';
import { DatePipe } from '@angular/common';
import { TipoModulo, TipoEstado } from 'src/app/modules/models/diccionario';
// --------------- Importación de Autenticación
import { AuthService } from 'src/app/services/auth.service';

// --------------- Importación para validaciones
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// --------------- Modelo de Usuario
import { Usuario } from 'src/app/modules/models/usuario';

@Component({
    templateUrl: './materia-crud.component.html',
    providers: [MessageService],
    styleUrls: ['./materia-crud.component.css']
})
export class MateriaCrudComponent implements OnInit {


    //-----------------Variables para componente materia-------------------//
    listaMaterias: Materia[] = [];
    materia: Materia = {};
    submitted: boolean = false;
    materiaDialog: boolean = false;
    eliminarMateriaDialog: boolean = false;
    tipoModulo: TipoModulo[] = [];
    tipoModuloSeleccionado: TipoModulo;
    tipoEstado: TipoEstado[] = [];
    tipoEstadoSeleccionado: TipoEstado;
    registroMateria: Materia = {};
    pip = new DatePipe('es-BO');
    opcionMateria: boolean = false;
    loading: boolean = false;
    //-----------------Variables para compoente materia-------------------//

    //----------------Variables para validación----------------//
    materiaForm: FormGroup;
    //----------------Variables para validación----------------//

    usuario: Usuario;

    constructor(private messageService: MessageService,
                private materiaService: MateriaService,
                private formBuilder: FormBuilder,
                public reporte: ReporteService,
                private authService: AuthService,)
                {
                    this.tipoModuloSeleccionado = new TipoModulo(0,"");
                    this.tipoEstadoSeleccionado = new TipoEstado(0,"");
                }

    ngOnInit() {
        this.getPerfilUsuario();
        this.listarMaterias();
        this.tipoModulo = [ new TipoModulo(1, 'PRIMERO'), new TipoModulo(2, 'SEGUNDO'), new TipoModulo(3, 'TERCERO'), new TipoModulo(4, 'OTRO') ];
        this.tipoEstado = [ new TipoEstado(0, 'FINALIZADO'), new TipoEstado(1, 'VIGENTE'), new TipoEstado(2, 'OTRO') ];
        this.asignacionValidaciones();
    }
    // Método para asignar las variables de React Form Valid
    asignacionValidaciones() {
        //----- Asignación de la validaciones
        this.materiaForm = this.formBuilder.group({
            mf_id: [''],
            mf_matnombre: ['', [Validators.required]],
            mf_matdescripcion: ['', [Validators.required]],
            mf_tipoModulo: ['', [Validators.required]]
        });
    }
    // Obtener datos del perfil del usuario logeado
    getPerfilUsuario() {
        this.authService.getPerfil().subscribe(usuario => {
            this.usuario = usuario[0];
        });
    }
    // Método de obtener la lista de materias registradas
    listarMaterias(){
        this.loading = true;
        this.materiaService.listarMateria().subscribe(
            (result: any) => {
                this.listaMaterias = result;
                this.loading = false;
            }
        )
    }
    // Método para abrir p-dialog para el registro de una nueva materia
    abrirNuevo() {
        this.materiaForm.reset();
        this.materia = new Materia();
        this.materiaDialog = true;
        this.opcionMateria = true;
    }
    // Método para ocular el p-dialog
    ocultarDialog() {
        this.materiaDialog = false;
        this.opcionMateria = false;
        this.messageService.add({ severity: 'warn', summary: 'Cancelado', detail: 'Proceso Cancelado', life: 3000 });
    }
    // Método de obtención de datos y setearlos para modificar materia
    editarMateria(data: any) {
        this.materia = { ...data };
        this.setData();
        this.materiaDialog = true;
        this.opcionMateria = false;
    }
    // Obtener datos para eliminar materia
    eliminarMateria(materia: Materia) {
        this.eliminarMateriaDialog = true;
        this.materia = { ...materia };
    }
    // Método de confirmación de eliminación de materia
    confirmarEliminar() {
        const criterio = {
            matid: this.materia.matid
        }
        this.materiaService.eliminarMateria(criterio).subscribe(
            (result: any) => {
                this.messageService.add({ severity: 'success', summary: 'Exitosa!', detail: 'Materia Eliminado', life: 3000 });
                this.listarMaterias();
                this.eliminarMateriaDialog = false;
                this.materia = {};
            },
            error => {
            console.log("error",error);
            const descripcionError = error.error.message;
                this.messageService.add({severity:'warn', summary:'Error', detail: descripcionError, life: 5000});
            }
        );
    }
    // Obtener datos para el p-dialog
    setData(){
        this.materiaForm.reset();
        this.materiaForm.patchValue({
            mf_id: this.materia.matid,
            mf_matnombre: this.materia.matnombre,
            mf_matdescripcion: this.materia.matdescripcion,
            mf_tipoModulo: new TipoModulo(this.materia.matnivel, this.materia.matdesnivel)
        })
    }
    // Obtener datos para insertar ó modificar materia
    obtenerBody(){
        this.materia = new Materia();
        this.materia.matnombre = this.materiaForm.value.mf_matnombre;
        this.materia.matdescripcion = this.materiaForm.value.mf_matdescripcion;
        this.materia.matnivel = this.materiaForm.value.mf_tipoModulo.codTipoModulo;
        this.materia.matdesnivel = this.materiaForm.value.mf_tipoModulo.desTipoModulo;
        this.materia.matestado = 1;
        this.materia.matestadodescripcion = "";
        this.materia.matusureg = this.usuario.usuname;
        this.materia.matusumod = this.usuario.usuname;
        const body = {...this.materia}
        return body;
    }
    // Función para mandar datos de inserción y modificación
    guardarMateria(){
        if(this.materiaForm.invalid){
            this.messageService.add({ severity: 'error', summary: 'Error en el Registro', detail: 'Por favor, verifica la información ingresada e intenta nuevamente.', life: 3000 });
            return Object.values(this.materiaForm.controls).forEach(control=>{
                control.markAllAsTouched();
                control.markAsDirty();
            })
        }
        this.obtenerBody();
        if (this.opcionMateria) {
            this.materiaService.insertarMateria(this.materia).subscribe(
                (result: any) => {
                    this.messageService.add({ severity: 'success', summary: 'Exitosamente', detail: 'Materia Agregado', life: 3000 });
                    this.listarMaterias();
                    this.materiaDialog = false;
                    this.opcionMateria = false;
                },
                error => { console.log("error",error); this.messageService.add({severity:'warn', summary:'Error', detail:'Algo salio mal, al insertar el Nivel'}); }
            );
        }
        else {
            this.materia.matid = this.materiaForm.value.mf_id;
            this.materiaService.modificarMateria(this.materia).subscribe(
                (result: any) => {
                    this.messageService.add({ severity: 'success', summary: 'Exitosamente', detail: 'Materia Modificado', life: 3000 });
                    this.listarMaterias();
                    this.materiaDialog = false;
                    this.opcionMateria = false;
                },
                error => { console.log("error",error); this.messageService.add({severity:'warn', summary:'Error', detail:'Algo salio mal, al modificar la materia'}); }
            );
        }
    }
    // Función para retornar los colores para el tipo de módulo o nivel
    getSeverity(matdesnivel: string): string {
        switch (matdesnivel) {
          case 'PRIMERO':
            return 'danger';
          case 'SEGUNDO':
            return 'info';
          case 'TERCERO':
            return 'warning';
          default:
            return 'success';
        }
    }


}
