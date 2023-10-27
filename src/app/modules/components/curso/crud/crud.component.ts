import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/modules/models/usuario';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { CursoService } from 'src/app/modules/service/data/curso.service';
import { ReporteService } from 'src/app/modules/service/data/reporte.service';
import { CursoMateria } from 'src/app/modules/models/curso';
import { TipoCurso } from 'src/app/modules/models/diccionario';
import { TipoMateria } from 'src/app/modules/models/diccionario';
import { DiccionarioService } from 'src/app/modules/service/data/diccionario.service';
import { C } from '@fullcalendar/core/internal-common';
import { Rol } from 'src/app/modules/models/rol';
import { UsuarioService } from 'src/app/modules/service/data/usuario.service';
import { TipoRol } from 'src/app/modules/models/diccionario';

// import { CursoCombo } from 'src/app/modules/models/curso';

@Component({
    templateUrl: './crud.component.html',
    providers: [MessageService]
})
export class CursoCrudComponent implements OnInit {

    productDialog: boolean = false;
    deleteProductDialog: boolean = false;
    deleteProductsDialog: boolean = false;
    products: Usuario[] = [];
    // ComboCursoSeleced: CursoCombo;
    // product: Product = {};
    // product: Usuarios = {};
    selectedProducts: Usuario[] = [];
    submitted: boolean = false;
    cols: any[] = [];
    statuses: any[] = [];
    rowsPerPageOptions = [5, 10, 20];


    // -------------------------- Cursos Materias -------------------------- //
    listaCursosMaterias: CursoMateria[] = [];
    registroCursoMateria: CursoMateria;

    tipoCurso: TipoCurso[] = [];
    tipoCursoSeleccionado: TipoCurso;

    tipoMateria: TipoMateria[] = [];
    tipoMateriaSeleccionado: TipoMateria;

    tipoRol: TipoRol[] = [];
    tipoRolSeleccionado: TipoRol;



    constructor(// private productService: ProductService,
                private messageService: MessageService,
                private cursoService: CursoService,
                public reporte: ReporteService,
                public diccionarioService: DiccionarioService,
                private usuarioServicie: UsuarioService)
               {
                this.tipoCursoSeleccionado = new TipoCurso(0,"");
                }

    ngOnInit() {
        console.log("ngOnInit")
        this.cursoService.listarCursoMateria().subscribe(
            (result: any) => {
                this.listaCursosMaterias = result;
                console.log("Lista Cursos Materia", this.listaCursosMaterias)
            }
        )
        this.cursoService.listaCursoCombo().subscribe(
            (result: any) => {
                this.tipoCurso = result;
                console.log("Combo Cursos", this.tipoCurso)
            }
        )
        this.obtenerRoles();

    }
    obtenerRoles(){
        this.usuarioServicie.getRoles().subscribe(
            (result: any) => {
                this.tipoRol = result;
                console.log("Combo roles: ", this.tipoRol);
            }
        )
    }
    getTipoMateria(criterio: any){
        this.diccionarioService.getTipoMateria(criterio).subscribe(
            (result: any) => {
                this.tipoMateria = result;
                console.log("Combo Materia", this.tipoMateria)
            }
        )
    }
    getTipoRol(criterio: any){
        this.diccionarioService.getListaPersonaDocenteCombo(criterio).subscribe(
            (result: any) => {
                // this.tipoRol = result;
                console.log("Persona--->", result)
            }
        )
    }
    onSelect(data: any){
        console.log("idNivel-> ", data.value.curnivel);
        const nivel = parseInt(data.value.curnivel);

        const criterio = {  // Define criterio como un objeto
            curnivel: nivel
        };

        this.getTipoMateria(criterio);
    }
    onSelectRol(data: any){
        console.log("rolNombre-> ", data.value.rolnombre);
        const nombre = data.value.rolnombre;

        const criterio = {  // Define criterio como un objeto
            rolnombre: nombre
        };

        this.getTipoRol(criterio);

    }


    // ngAfterContentInit() {

    // }
    setData(){
        this.tipoCursoSeleccionado = new TipoCurso(this.registroCursoMateria.curid, this.registroCursoMateria.curnombre);
        console.log(this.tipoCursoSeleccionado)
    }
    obtenerBody(){
        this.registroCursoMateria.curid = this.tipoCursoSeleccionado.codTipoCurso;
        this.registroCursoMateria.curnombre = this.tipoCursoSeleccionado.desTipoCurso;
        // this.designacionData.idUsuario = this.idUsuario;
        // console.log(this.designacionData.idUsuario);

        const body = {...this.registroCursoMateria}
        return body;

    }
    openNew() {
        this.registroCursoMateria = {};
        this.submitted = false;
        this.productDialog = true;
    }

    deleteSelectedProducts() {
        this.deleteProductsDialog = true;
    }

    editProduct(registroCursoMateria: CursoMateria) {
        this.registroCursoMateria = { ...registroCursoMateria };
        this.setData();
        this.productDialog = true;
    }

    deleteProduct(registroCursoMateria: CursoMateria) {
        this.deleteProductDialog = true;
        this.registroCursoMateria = { ...registroCursoMateria };
    }

    confirmDeleteSelected() {
        this.deleteProductsDialog = false;
        this.products = this.products.filter(val => !this.selectedProducts.includes(val));
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
        this.selectedProducts = [];
    }

    confirmDelete() {
        this.deleteProductDialog = false;
        // this.products = this.products.filter(val => val.id !== this.registroCurso.id);
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
        this.registroCursoMateria = {};
    }

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }
    enviarFormulario(){
        const data = this.obtenerBody();
    }
    guardar(){
        this.submitted = true;

        this.listaCursosMaterias = [...this.listaCursosMaterias];
        this.productDialog = false;
        this.registroCursoMateria = {};
    }
    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
    // saveProduct() {
    //     this.submitted = true;

    //     if (this.product.name?.trim()) {
    //         if (this.product.id) {
    //             // @ts-ignore
    //             this.product.inventoryStatus = this.product.inventoryStatus.value ? this.product.inventoryStatus.value : this.product.inventoryStatus;
    //             this.products[this.findIndexById(this.product.id)] = this.product;
    //             this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
    //         } else {
    //             this.product.id = this.createId();
    //             this.product.code = this.createId();
    //             this.product.image = 'product-placeholder.svg';
    //             // @ts-ignore
    //             this.product.inventoryStatus = this.product.inventoryStatus ? this.product.inventoryStatus.value : 'INSTOCK';
    //             this.products.push(this.product);
    //             this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
    //         }

    //         this.products = [...this.products];
    //         this.productDialog = false;
    //         this.product = {};
    //     }
    // }

    // findIndexById(id: string): number {
    //     let index = -1;
    //     for (let i = 0; i < this.products.length; i++) {
    //         if (this.products[i].id === id) {
    //             index = i;
    //             break;
    //         }
    //     }

    //     return index;
    // }

    // createId(): string {
    //     let id = '';
    //     const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    //     for (let i = 0; i < 5; i++) {
    //         id += chars.charAt(Math.floor(Math.random() * chars.length));
    //     }
    //     return id;
    // }

    // onGlobalFilter(table: Table, event: Event) {
    //     table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    // }
}
