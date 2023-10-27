import { Component, OnInit } from '@angular/core';
// import { Product } from 'src/app/release/api/product';
import { Usuarios } from 'src/app/modules/models/usuarios';
import { Usuario } from 'src/app/modules/models/usuario';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
// import { ProductService } from 'src/app/release/service/product.service';
import { UsuarioService } from 'src/app/modules/service/data/usuario.service';
import { CursoService } from 'src/app/modules/service/data/curso.service';
import { ReporteService } from 'src/app/modules/service/data/reporte.service';
// import { Curso } from 'src/app/modules/models/curso';
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


    deleteProductDialog: boolean = false;
    deleteProductsDialog: boolean = false;
    products: Usuario[] = [];
    // product: Product = {};
    product: Usuarios = {};
    selectedProducts: Usuario[] = [];

    cols: any[] = [];
    statuses: any[] = [];
    rowsPerPageOptions = [5, 10, 20];
    listaUsuarios: Usuario[] = [];
    productDialog: boolean = false;
    // listaCursos: Curso[] = [];


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

    //-----------------Variables-Nivel-------------------//
    pip = new DatePipe('en-US');


    constructor(
                // private productService: ProductService,
                private messageService: MessageService,
                private usuarioService: UsuarioService,
                private cursoService: CursoService,
                public reporte: ReporteService,
                public nivelService: NivelService)
                {
                    this.tipoModuloSeleccionado = new TipoModulo(0,"");
                    this.tipoNivelEstadoSeleccionado = new TipoNivelEstado(0,"");
                }

    ngOnInit() {
        // ngOn Init //
        console.log("ngOnInit");
        this.listarNivel();

        this.tipoModulo = [
            new TipoModulo(1, 'PRIMERO'),
            new TipoModulo(2, 'SEGUNDO'),
            new TipoModulo(3, 'TERCERO'),
            new TipoModulo(4, 'OTRO'),
        ];

        this.tipoNivelEstado = [
            new TipoNivelEstado(1, 'VIGENTE'),
            new TipoNivelEstado(0, 'FINALIZADO'),
            new TipoNivelEstado(2, 'OTRO')
        ]

        console.log("TipoModulo-> ",this.tipoModulo);
        console.log("TipoNivelEstado-> ",this.tipoNivelEstado);

        // ngOn Init //
    }
    // ngAfterContentInit() {
    //     this.setData();
    // }

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
    }
    ocultarDialog() {
        this.nivelDialog = false;
    }
    editarNivel(data: any) {
        this.nivel = { ...data };
        this.setData();
        this.nivelDialog = true;
    }
    eliminarNivel(nivel: Nivel) {
        this.eliminarNivelDialog = true;
        this.nivel = { ...nivel };
    }
    confirmarEliminar() {
        this.eliminarNivelDialog = false;
        // this.products = this.products.filter(val => val.id !== this.product.id);
        this.messageService.add({ severity: 'success', summary: 'Exitosa!', detail: 'Nivel Eliminado', life: 3000 });
        this.nivel = {};
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
        this.nivel.curusureg = 'UsuarioIvanPrueba'
        this.nivel.curusumod = 'UsuarioModificar'
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
                return 'info'; // Valor predeterminado si el estado no coincide con 1 o 0
        }
    }
    guardarNivel(){

        this.obtenerBody();
        console.log("GuardarNivel", this.nivel);
        this.nivelService.insertarNivel(this.nivel).subscribe(
            (result: any) => {
                this.messageService.add({ severity: 'success', summary: 'Exitosamente', detail: 'Nivel Agregado', life: 3000 });
                this.listarNivel();
            },
            error => {
            console.log("error",error);
                this.messageService.add({severity:'warn', summary:'Error', detail:'Algo salio mal!'});
            });
        this.nivelDialog = false;
    }
    //---------------Funciones-Nivel---------------//
}
