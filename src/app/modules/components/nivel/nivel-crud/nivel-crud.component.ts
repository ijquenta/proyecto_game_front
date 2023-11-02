import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ReporteService } from 'src/app/modules/service/data/reporte.service';
import { Nivel } from 'src/app/modules/models/nivel';
import { NivelService } from 'src/app/modules/service/data/nivel.service';
import { TipoModulo } from 'src/app/modules/models/diccionario';
import { TipoNivelEstado } from 'src/app/modules/models/diccionario';
import { DatePipe } from '@angular/common';
@Component({
    templateUrl: './nivel-crud.component.html',
    providers: [MessageService]
})
export class NivelCrudComponent implements OnInit {


    //-----------------Variables-Nivel-------------------//

    listaNiveles: Nivel[] = [];
    nivel: Nivel = {};
    submitted: boolean = false;
    nivelDialog: boolean = false;
    eliminarNivelDialog: boolean = false;
    tipoModulo: TipoModulo[] = [];
    tipoModuloSeleccionado: TipoModulo;
    tipoNivelEstado: TipoNivelEstado[] = [];
    tipoNivelEstadoSeleccionado: TipoNivelEstado;
    registroNivel: Nivel = {};
    pip = new DatePipe('es-BO');
    opcionNivel: boolean = false;
    //-----------------Variables-Nivel-------------------//



    constructor(
                private messageService: MessageService,
                public reporte: ReporteService,
                public nivelService: NivelService)
                {
                    this.tipoModuloSeleccionado = new TipoModulo(0,"");
                    this.tipoNivelEstadoSeleccionado = new TipoNivelEstado(0,"");
                }

    ngOnInit() {
        this.listarNivel();

        this.tipoModulo = [
            new TipoModulo(1, 'PRIMERO'),
            new TipoModulo(2, 'SEGUNDO'),
            new TipoModulo(3, 'TERCERO'),
            new TipoModulo(4, 'OTRO'),
        ];

        this.tipoNivelEstado = [
            new TipoNivelEstado(0, 'FINALIZADO'),
            new TipoNivelEstado(1, 'VIGENTE'),
            new TipoNivelEstado(2, 'OTRO')
        ]

        // console.log("TipoModulo-> ",this.tipoModulo);
        // console.log("TipoNivelEstado-> ",this.tipoNivelEstado);
    }

   //---------------Funciones-Nivel---------------//

    listarNivel(){
        this.nivelService.listarNivel().subscribe(
            (result: any) => {
                this.listaNiveles = result;
                console.log("Lista de niveles:", this.listaNiveles)
            }
        )
    }
    abrirNuevo() {
        this.nivel = {};
        this.tipoModuloSeleccionado = new TipoModulo(0,"");
        this.tipoNivelEstadoSeleccionado = new TipoNivelEstado(0,"");
        this.nivelDialog = true;
        this.opcionNivel = true;
    }
    ocultarDialog() {
        this.nivelDialog = false;
        this.opcionNivel = false;
    }
    editarNivel(data: any) {
        this.nivel = { ...data };
        this.setData();
        this.nivelDialog = true;
        this.opcionNivel = false;
    }
    eliminarNivel(nivel: Nivel) {
        this.eliminarNivelDialog = true;
        this.nivel = { ...nivel };
    }
    confirmarEliminar() {
        console.log("confirmarEliminar: ", this.nivel)
        const criterio = {
            curid: this.nivel.curid
        }
        console.log("criterio: ", criterio)
        this.nivelService.eliminarNivel(criterio).subscribe(
            (result: any) => {
                this.messageService.add({ severity: 'success', summary: 'Exitosa!', detail: 'Nivel Eliminado', life: 3000 });
                this.listarNivel();
                this.eliminarNivelDialog = false;
                this.nivel = {};
            },
            error => {
            console.log("error",error);
            const descripcionError = error.error.message;
                this.messageService.add({severity:'warn', summary:'Error', detail: descripcionError, life: 5000});
            }
        );
    }
    curfechaini: any
    curfechafin: any
    setData(){
        this.nivel.curfchini! = new Date(this.nivel.curfchini);
        this.nivel.curfchfin! = new Date(this.nivel.curfchfin);
        this.tipoModuloSeleccionado = new TipoModulo(this.nivel.curnivel, this.nivel.curdesnivel);
        this.tipoNivelEstadoSeleccionado = new TipoNivelEstado(this.nivel.curestado, this.nivel.curestadodescripcion);
        console.log(this.tipoModuloSeleccionado);
        console.log(this.tipoNivelEstadoSeleccionado);
        console.log(this.nivel);
    }
    obtenerBody(){
        console.log("Obtener Body: ", this.nivel);
        this.nivel.curnivel = this.tipoModuloSeleccionado.codTipoModulo;
        this.nivel.curdesnivel = this.tipoModuloSeleccionado.desTipoModulo;
        this.nivel.curestado = this.tipoNivelEstadoSeleccionado.codTipoNivelEstado;
        this.nivel.curestadodescripcion = this.tipoNivelEstadoSeleccionado.desTipoNivelEstado;
        this.nivel.curusureg = 'Usuario Reg';
        this.nivel.curusumod = 'Usuario Mod';
        const body = {...this.nivel}
        return body;
    }
    obtenerEstadoSeverity(estado: number): string {
        switch (estado) {
            case 0:
                return 'danger';
            case 1:
                return 'success';
            default:
                return 'info';
        }
    }
    obtenerNivelSeverity(estado: number): string {
        switch (estado) {
            case 1:
                return 'warning';
            case 2:
                return 'info';
            case 3:
                return 'danger';
            default:
                return 'info';
        }
    }
    guardarNivel(){
        this.obtenerBody();
        console.log("GuardarNivel", this.nivel);
        if(this.opcionNivel){
            this.nivelService.insertarNivel(this.nivel).subscribe(
                (result: any) => {
                    this.messageService.add({ severity: 'success', summary: 'Exitosamente', detail: 'Nivel Agregado', life: 3000 });
                    this.listarNivel();
                    this.nivelDialog = false;
                    this.opcionNivel = false;
                },
                error => {
                console.log("error",error);
                    this.messageService.add({severity:'warn', summary:'Error', detail:'Algo salio mal, al insertar el Nivel'});
                }
            );
        }
        else{
            this.nivelService.modificarNivel(this.nivel).subscribe(
                (result: any) => {
                    this.messageService.add({ severity: 'success', summary: 'Exitosamente', detail: 'Nivel Modificado', life: 3000 });
                    this.listarNivel();
                    this.nivelDialog = false;
                    this.opcionNivel = false;
                },
                error => {
                console.log("error",error);
                    this.messageService.add({severity:'warn', summary:'Error', detail:'Algo salio mal, al modificar el Nivel'});
                }
            );
        }
    }
    formatFecha(fechaString: string): Date {
        return new Date(fechaString); // Convierte la cadena de fecha en un objeto Date
    }
    //---------------Funciones-Nivel---------------//
}
