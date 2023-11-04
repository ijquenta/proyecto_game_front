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
    //   eliminarMateriaDialog: boolean = false;
    //   tipoModulo: TipoModulo[] = [];
    //   tipoModuloSeleccionado: TipoModulo;
        fechaInicio: Date;
        fechaFinal: Date;
        tipoEstadoMatricula: TipoEstadoMatricula[] = [];
        tipoEstadoMatriculaSeleccionado: TipoEstadoMatricula;
    //   registroMateria: Materia = {};
    //   pip = new DatePipe('es-BO');
    //   opcionMateria: boolean = false;
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
        this.gestionSeleccionado = new Date().getFullYear();
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
    }

    ocultarDialog() {
        this.matriculaDialog = false;
        // this.opcionMateria = false;
        this.messageService.add({ severity: 'warn', summary: 'Cancelado', detail: 'Proceso Cancelado', life: 3000 });
    }
    // obtenerBody(){
    //     console.log("Obtener Body: ", this.materia);
    //     this.matricula.matrgestion = this.gestionSeleccionado;
    //     this.matricula.matrestadodescripcion = this.tipoEstadoMatriculaSeleccionado.matrestadodescripcion;
    //     this.matricula.matrfchini = this.tipoEstadoSeleccionado.codTipoEstado;
    //     this.matricula.matrfchfin = this.tipoEstadoSeleccionado.codTipoEstado;
    //     this.matricula.matrcos = this.tipoEstadoSeleccionado.desTipoEstado;
    //     this.matricula.matrusureg = 'Usuario Reg';
    //     this.matmatriculaeria.matusumod = 'Usuario Mod';
    //     const body = {...this.materia}
    //     return body;
    // }
    // guardarMatricula(){
    //     this.obtenerBody();
    //     console.log("GuardarNivel", this.materia);
    //     if(this.opcionMateria){
    //         this.materiaService.insertarMateria(this.materia).subscribe(
    //             (result: any) => {
    //                 this.messageService.add({ severity: 'success', summary: 'Exitosamente', detail: 'Materia Agregado', life: 3000 });
    //                 this.listarMaterias();
    //                 this.materiaDialog = false;
    //                 this.opcionMateria = false;
    //             },
    //             error => {
    //             console.log("error",error);
    //                 this.messageService.add({severity:'warn', summary:'Error', detail:'Algo salio mal, al insertar el Nivel'});
    //             }
    //         );
    //     }
    //     else{
    //         this.materiaService.modificarMateria(this.materia).subscribe(
    //             (result: any) => {
    //                 this.messageService.add({ severity: 'success', summary: 'Exitosamente', detail: 'Materia Modificado', life: 3000 });
    //                 this.listarMaterias();
    //                 this.materiaDialog = false;
    //                 this.opcionMateria = false;
    //             },
    //             error => {
    //             console.log("error",error);
    //                 this.messageService.add({severity:'warn', summary:'Error', detail:'Algo salio mal, al modificar la materia'});
    //             }
    //         );
    //     }
    // }
}
