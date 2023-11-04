import { Component, OnInit } from '@angular/core';
import { Materia } from 'src/app/modules/models/materia';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { MateriaService } from 'src/app/modules/service/data/materia.service';
import { ReporteService } from 'src/app/modules/service/data/reporte.service';
import { DatePipe } from '@angular/common';
import { TipoModulo, TipoEstado } from 'src/app/modules/models/diccionario';

@Component({
    templateUrl: './materia-crud.component.html',
    providers: [MessageService]
})
export class MateriaCrudComponent implements OnInit {


    //-----------------Variables-------------------//
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
    //-----------------Variables-------------------//s


    constructor(
                private messageService: MessageService,
                private materiaService: MateriaService,
                public reporte: ReporteService,)
                {
                    this.tipoModuloSeleccionado = new TipoModulo(0,"");
                    this.tipoEstadoSeleccionado = new TipoEstado(0,"");
                }

    ngOnInit() {
        // console.log("ngOnInit");
        this.listarMaterias();
        this.tipoModulo = [
            new TipoModulo(1, 'PRIMERO'),
            new TipoModulo(2, 'SEGUNDO'),
            new TipoModulo(3, 'TERCERO'),
            new TipoModulo(4, 'OTRO'),
        ];

        this.tipoEstado = [
            new TipoEstado(0, 'FINALIZADO'),
            new TipoEstado(1, 'VIGENTE'),
            new TipoEstado(2, 'OTRO')
        ]
    }
    listarMaterias(){
        this.materiaService.listarMateria().subscribe(
            (result: any) => {
                this.listaMaterias = result;
                console.log("Materias", this.listaMaterias)
            }
        )
    }

    abrirNuevo() {
        this.materia = {};
        this.tipoModuloSeleccionado = new TipoModulo(0,"");
        this.tipoEstadoSeleccionado = new TipoEstado(0,"");
        this.materiaDialog = true;
        this.opcionMateria = true;
    }
    ocultarDialog() {
        this.materiaDialog = false;
        this.opcionMateria = false;
        this.messageService.add({ severity: 'warn', summary: 'Cancelado', detail: 'Proceso Cancelado', life: 3000 });
    }
    editarMateria(data: any) {
        this.materia = { ...data };
        this.setData();
        this.materiaDialog = true;
        this.opcionMateria = false;
    }
    eliminarMateria(materia: Materia) {
        this.eliminarMateriaDialog = true;
        this.materia = { ...materia };
    }
    confirmarEliminar() {
        console.log("confirmarEliminar: ", this.materia)
        const criterio = {
            matid: this.materia.matid
        }
        console.log("criterio: ", criterio)
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
    setData(){
        this.tipoModuloSeleccionado = new TipoModulo(this.materia.matnivel, this.materia.matdesnivel);
        this.tipoEstadoSeleccionado = new TipoEstado(this.materia.matestado, this.materia.matestadodescripcion);
        console.log(this.tipoModuloSeleccionado);
        console.log(this.tipoEstadoSeleccionado);
        console.log(this.materia);
    }
    obtenerBody(){
        console.log("Obtener Body: ", this.materia);
        this.materia.matnivel = this.tipoModuloSeleccionado.codTipoModulo;
        this.materia.matdesnivel = this.tipoModuloSeleccionado.desTipoModulo;
        this.materia.matestado = this.tipoEstadoSeleccionado.codTipoEstado;
        this.materia.matestadodescripcion = this.tipoEstadoSeleccionado.desTipoEstado;
        this.materia.matusureg = 'Usuario Reg';
        this.materia.matusumod = 'Usuario Mod';
        const body = {...this.materia}
        return body;
    }
    guardarMateria(){
        this.obtenerBody();
        console.log("GuardarNivel", this.materia);
        if(this.opcionMateria){
            this.materiaService.insertarMateria(this.materia).subscribe(
                (result: any) => {
                    this.messageService.add({ severity: 'success', summary: 'Exitosamente', detail: 'Materia Agregado', life: 3000 });
                    this.listarMaterias();
                    this.materiaDialog = false;
                    this.opcionMateria = false;
                },
                error => {
                console.log("error",error);
                    this.messageService.add({severity:'warn', summary:'Error', detail:'Algo salio mal, al insertar el Nivel'});
                }
            );
        }
        else{
            this.materiaService.modificarMateria(this.materia).subscribe(
                (result: any) => {
                    this.messageService.add({ severity: 'success', summary: 'Exitosamente', detail: 'Materia Modificado', life: 3000 });
                    this.listarMaterias();
                    this.materiaDialog = false;
                    this.opcionMateria = false;
                },
                error => {
                console.log("error",error);
                    this.messageService.add({severity:'warn', summary:'Error', detail:'Algo salio mal, al modificar la materia'});
                }
            );
        }
    }
}
