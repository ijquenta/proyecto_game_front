import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { MatriculaService } from 'src/app/modules/service/data/matricula.service';
import { Matricula } from 'src/app/modules/models/matricula';
import { TipoEstadoMatricula } from 'src/app/modules/models/diccionario';

@Component({
    templateUrl: './matricula-listar.component.html',
    providers: [MessageService]
})
export class MatriculaListarComponent implements OnInit {


      //-----------------Variables-------------------//
        listaMatriculas: Matricula[] = [];
        matricula: Matricula = {};
        gestiones: number[] = [];
        gestionSeleccionado: number;
    //   submitted: boolean = false;
        matriculaDialog: boolean = false;
        eliminarMatriculaDialog: boolean = false;
    //   tipoModulo: TipoModulo[] = [];
    //   tipoModuloSeleccionado: TipoModulo;
        fechaInicio: Date;
        fechaFinal: Date;
        costo: number;
        tipoEstadoMatricula: TipoEstadoMatricula[] = [];
        tipoEstadoMatriculaSeleccionado: TipoEstadoMatricula;
    //   registroMateria: Materia = {};
    //   pip = new DatePipe('es-BO');
        opcionMatricula: boolean = false;
      //-----------------Variables-------------------//s

    constructor(
                // private productService: ProductService,
                private messageService: MessageService,
                private matriculaService: MatriculaService,
                // private usuarioService: UsuarioService,
                // public reporte: ReporteService,
                ) { }

    ngOnInit() {
        this.listarMatriculas()
        this.gestionSeleccionado = new Date().getFullYear() + 1;
        for (let anio = this.gestionSeleccionado; anio >= 2018; anio--) {
            this.gestiones.push(anio);
        }
        this.tipoEstadoMatricula = [
            new TipoEstadoMatricula(0, 'CERRADO'),
            new TipoEstadoMatricula(1, 'ABIERTO')
        ]
    }

    listarMatriculas(){
        this.matriculaService.listarMatricula().subscribe(
            (result: any) => {
                this.listaMatriculas = result;
                console.log("Matriculas", this.listaMatriculas)
            }
        )
    }

    abrirNuevo() {
        this.matricula = {};
        this.gestionSeleccionado = 0;
        this.matriculaDialog = true;
        this.tipoEstadoMatriculaSeleccionado = new TipoEstadoMatricula(0, "");
        this.opcionMatricula = true;
        this.fechaInicio = null;
        this.fechaFinal = null;
        this.costo = null;
    }

    ocultarDialog() {
        this.matriculaDialog = false;
        this.opcionMatricula = false;
        this.messageService.add({ severity: 'warn', summary: 'Cancelado', detail: 'Proceso Cancelado', life: 3000 });
    }
                // matrgestion?: number = 0;
                // matrestadodescripcion?: string = '';
                // matrfchini?: Date | null;
                // matrfchfin?: Date | null;
                // matrcos?: number = 0;
                // matrusureg?: string = '';
                // matrfecreg?: Date | null;
                // matrusumod?: string = '';
                // matrfecmod?: Date | null;
                // matrestado?: number = 0;
    obtenerBody(){
        // console.log("Obtener Body: ", this.matricula);
        this.matricula.matrgestion = this.gestionSeleccionado;
        this.matricula.matrestado = this.tipoEstadoMatriculaSeleccionado.matrestado;
        this.matricula.matrestadodescripcion = this.tipoEstadoMatriculaSeleccionado.matrestadodescripcion;
        this.matricula.matrfchini = this.fechaInicio;
        this.matricula.matrfchfin = this.fechaFinal;
        this.matricula.matrusureg = 'Usuario Reg';
        this.matricula.matrcos = this.costo;

        // console.log("Matricula LLena: ", this.matricula);
        const body = {...this.matricula}
        return body;
    }
    setData(){
        console.log(this.matricula);
        this.tipoEstadoMatriculaSeleccionado = new TipoEstadoMatricula(this.matricula.matrestado, this.matricula.matrestadodescripcion);
        this.fechaInicio = new Date(this.matricula.matrfchini);
        this.fechaFinal = new Date(this.matricula.matrfchfin);
        this.costo = this.matricula.matrcos;
        this.gestionSeleccionado = this.matricula.matrgestion;
        this.matricula.matrusumod = "Ivan Mod Matricual";
    }
    editarMatricula(data: any) {
        this.matricula = { ...data };
        this.setData();
        this.matriculaDialog = true;
        this.opcionMatricula = false;
    }
    guardarMatricula(){
        this.obtenerBody();
        console.log("GuardarMatricual", this.matricula);
        if(this.opcionMatricula){
            this.matriculaService.insertarMatricula(this.matricula).subscribe(
                (result: any) => {
                    this.messageService.add({ severity: 'success', summary: 'Exitosamente', detail: 'Matricula Agregado', life: 3000 });
                    this.listarMatriculas();
                    this.matriculaDialog = false;
                    this.opcionMatricula = false;
                },
                error => {
                console.log("error",error);
                    this.messageService.add({severity:'warn', summary:'Error', detail:'Algo salio mal, al insertar la matricula', life: 3000});
                }
            );
        }
        else{
            console.log("Editar", this.matricula);
            this.matriculaService.modificarMatricula(this.matricula).subscribe(
                (result: any) => {
                    this.messageService.add({ severity: 'success', summary: 'Exitosamente', detail: 'Matricula Modificado', life: 3000 });
                    this.listarMatriculas();
                    this.matriculaDialog = false;
                    this.opcionMatricula = false;
                },
                error => {
                console.log("error",error);
                    this.messageService.add({severity:'warn', summary:'Error', detail:'Algo salio mal, al modificar la matricula'});
                }
            );
        }
    }

    eliminarMatricula(data: Matricula) {
        this.eliminarMatriculaDialog = true;
        this.matricula = { ...data };
        console.log("Matricula Eliminar:", this.matricula);
    }
    confirmarEliminar() {
        console.log("confirmarEliminar: ", this.matricula)
        const criterio = {
            matrid: this.matricula.matrid
        }
        console.log("criterio: ", criterio)
        this.matriculaService.eliminarMatricula(criterio).subscribe(
            (result: any) => {
                this.messageService.add({ severity: 'success', summary: 'Exitosa!', detail: 'Matricula Eliminado', life: 3000 });
                this.listarMatriculas();
                this.eliminarMatriculaDialog = false;
                this.matricula = {};
            },
            error => {
            console.log("error",error);
            const descripcionError = error.error.message;
                this.messageService.add({severity:'warn', summary:'Error', detail: descripcionError, life: 5000});
            }
        );
    }
}
