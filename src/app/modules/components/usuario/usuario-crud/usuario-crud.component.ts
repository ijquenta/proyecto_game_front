import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
// Services
import { UsuarioService } from 'src/app/modules/service/data/usuario.service';
import { ReporteService } from 'src/app/modules/service/data/reporte.service';
// Models
import { Usuarios } from 'src/app/modules/models/usuarios';
import { Usuario,  } from 'src/app/modules/models/usuario';
import { TipoPersona, TipoPersona2, TipoRol } from 'src/app/modules/models/diccionario';
import { AuthService } from 'src/app/services/auth.service';


interface FileWithUrl extends File {
    url: string;
}
interface UploadEvent {
    originalEvent: Event;
    files: FileWithUrl[];
}


@Component({
    templateUrl: './usuario-crud.component.html',
    providers: [MessageService],
    styleUrls: ['./usuario-crud.component.css']
})
export class UsuarioCrudComponent implements OnInit {

    // Variables
    uploadedFiles: FileWithUrl[] = [];
    // Tipo Persona
    tipoPersona: TipoPersona2[] = [];
    tipoPersonaSeleccionada:  TipoPersona2;
    loading: boolean = false;
    // Usuario
    usuarios: Usuario[] = [];
    usuario: Usuario;
    datosUsurio: Usuario;
    usuarioRegistro: Usuario;
    usuarioEditar: Usuario;
    usuarioDialog: boolean = false;
    optionDialog: boolean = false;
    // Tipo Rol
    tipoRol: TipoRol[] = [];
    tipoRolSeleccionada: TipoRol;
    // Variables any
    errors: any;

    eliminarUsuarioDialog: boolean = false;



    productDialog: boolean = false;

    deleteProductDialog: boolean = false;

    deleteProductsDialog: boolean = false;

    products: Usuario[] = [];

    // product: Product = {};
    product: Usuarios = {};



    selectedProducts: Usuario[] = [];

    submitted: boolean = false;

    cols: any[] = [];

    statuses: any[] = [];

    rowsPerPageOptions = [5, 10, 20];



    layout: string = 'list';
    customers!: any[];
    constructor(
                // private productService: ProductService,
                private messageService: MessageService,
                private usuarioService: UsuarioService,
                private authService: AuthService,
                public reporte: ReporteService,)
                {
                    // this.tipoPersonaSeleccionada = new TipoPersona2(0,'',0);
                }

                // onUpload(event:UploadEvent) {
                //     for(let file of event.files) {
                //         this.uploadedFiles.push(file);
                //     }

                //     this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: ''});
                // }
    ngOnInit() {

        // console.log("ngOnInit")Roles
        // this.usuarioService.getUsuario().then(data => this.listaUsuarios = data);
        // console.log(this.listaUsuarios);
        this.loading = true;
        this.listarUsuarios();
        this.usuarioService.getTipoPersona().subscribe(
            (result: any) => {
                this.tipoPersona = result;
                // console.log("Tipo Persona: ", this.tipoPersona)
            }
        )
        this.usuarioService.getRoles().subscribe(
            (result: any) => {
                this.tipoRol = result;
                // console.log("Tipo Rol: ", this.tipoRol);
            }
        )
        this.cols = [
            { field: 'product', header: 'Product' },
            { field: 'price', header: 'Price' },
            { field: 'category', header: 'Category' },
            { field: 'rating', header: 'Reviews' },
            { field: 'inventoryStatus', header: 'Status' }
        ];

        this.statuses = [
            { label: 'INSTOCK', value: 'instock' },
            { label: 'LOWSTOCK', value: 'lowstock' },
            { label: 'OUTOFSTOCK', value: 'outofstock' }
        ];

        this.authService.usuario$.subscribe((user => {
            if (user) {
                if (Array.isArray(user) && user.length > 0) {
                    this.datosUsurio = user[0];
                    // console.log("PRUEBA USUARIO IVANNN$: ", this.datosUsurio);
                } else {
                    // Manejar el caso en que user no es un array o es un array vacío
                    // console.error("El objeto 'user' no es un array o es un array vacío.");
                }
            } else {
                // Manejar el caso en que user es null
                // console.error("El objeto 'user' es nulo.");
            }
        }));
    }
    listarUsuarios(){

        this.usuarioService.listaUsuario().subscribe(
            (result: any) => {
                this.usuarios = result;
                this.loading = false;
                // console.log("Lista Usuarios", this.usuarios)
                // setTimeout(() => {

                //   }, 1000);
                // console.log("spinner: ", this.loading);

            }
        )
    }
    openNew() {
        this.product = {};
        this.usuario = new Usuario();
        this.submitted = false;
        this.usuarioDialog = true;
        this.optionDialog = true;
    }

    deleteSelectedProducts() {
        this.deleteProductsDialog = true;
    }

    editProduct(product: Usuarios) {
        this.product = { ...product };
        this.productDialog = true;
    }

    editarUsuario(data: Usuario){
        this.usuario = { ...data };
        this.usuarioEditar = { ...this.usuario };
        // console.log("editarUsuario: ",this.usuarioEditar);
        this.tipoPersonaSeleccionada = new TipoPersona2(this.usuario.perid, this.usuario.pernomcompleto, this.usuario.pernrodoc)
        this.tipoRolSeleccionada = new TipoRol(this.usuario.rolid, this.usuario.rolnombre);
        this.usuarioDialog = true;
        this.optionDialog = false;
    }


    deleteProduct(product: Usuarios) {
        this.deleteProductDialog = true;
        this.product = { ...product };
    }

    eliminarUsuario(data: Usuario){
        this.eliminarUsuarioDialog = true;
        this.usuario = { ...data };
    }

    confirmDeleteSelected() {
        this.deleteProductsDialog = false;
        this.products = this.products.filter(val => !this.selectedProducts.includes(val));
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
        this.selectedProducts = [];
    }

    confirmDelete() {
        // this.deleteProductDialog = false;
        // this.products = this.products.filter(val => val.id !== this.product.id);
        // this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
        // this.product = {};
    }
    confirmarEliminar() {

        this.usuarioRegistro = { ...this.usuario};
        // console.log("EnviarFormulario: ", this.usuarioRegistro);
        // console.log("tipoPersona: ",this.tipoPersonaSeleccionada);
        // console.log("tipoRol: ", this.tipoRolSeleccionada);
        this.usuarioRegistro.tipo = 3;
        // this.usuarioRegistro.perid = this.tipoPersonaSeleccionada.perid;
        // this.usuarioRegistro.rolid = this.tipoRolSeleccionada.rolid;
        this.usuarioRegistro.usuimagen = null;
        // this.usuarioRegistro.usuestado = 1;
        this.usuarioRegistro.usuusureg = this.datosUsurio.usuname;
        // console.log("usuarioRegistro: ", this.usuarioRegistro);
        this.usuarioService.gestionarUsuario(this.usuarioRegistro).subscribe(
            (result: any) => {
                // console.log("gestionarUsuario: ", result);
                this.messageService.add({ severity: 'success', summary: 'Proceso realizado correctamente', detail: 'Usuario Eliminado.', life: 3000});
                this.eliminarUsuarioDialog = false;
                this.listarUsuarios();
            },
            (error) => {
                this.errors = error;
                // console.log('error', error);
                this.messageService.add({ severity: 'error', summary: 'Error de proceso', detail: 'Se produjo un error al intentar eliminar el usuario.', life: 3000});
            }
        )
    }

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }
    ocultarDialog(){
        this.usuarioDialog = false;
    }

    enviarFormulario(){
        if(this.optionDialog){
            this.usuarioRegistro = { ...this.usuario};
            // console.log("EnviarFormulario: ", this.usuarioRegistro);
            // console.log("tipoPersona: ",this.tipoPersonaSeleccionada);
            // console.log("tipoRol: ", this.tipoRolSeleccionada);
            this.usuarioRegistro.tipo = 1;
            this.usuarioRegistro.usuid = null;
            this.usuarioRegistro.perid = this.tipoPersonaSeleccionada.perid;
            this.usuarioRegistro.rolid = this.tipoRolSeleccionada.rolid;
            this.usuarioRegistro.usuimagen = null;
            this.usuarioRegistro.usuestado = 1;
            this.usuarioRegistro.usuusureg = this.datosUsurio.usuname;
            // console.log("usuarioRegistro: ", this.usuarioRegistro);
            this.usuarioService.gestionarUsuario(this.usuarioRegistro).subscribe(
                (result: any) => {
                    // console.log("gestionarUsuario: ", result);
                    this.messageService.add({ severity: 'success', summary: 'Exitosamente', detail: 'Proceso realizado correctamente.', life: 3000});
                    this.optionDialog = false;
                    this.usuarioDialog = false;
                    this.listarUsuarios();
                },
                (error) => {
                    this.errors = error;
                    // console.log('error', error);
                    this.messageService.add({ severity: 'error', summary: 'Error en el Registro', detail: 'Se produjo un error al intentar registrar el usuario.', life: 3000});
                }
            )
        }
        else{
            this.usuarioRegistro = { ...this.usuario};
            // console.log("EnviarFormulario: ", this.usuarioRegistro);
            // console.log("tipoPersona: ",this.tipoPersonaSeleccionada);
            // console.log("tipoRol: ", this.tipoRolSeleccionada);
            this.usuarioRegistro.tipo = 2;
            // this.usuarioRegistro.usuid = ;
            this.usuarioRegistro.perid = this.tipoPersonaSeleccionada.perid;
            this.usuarioRegistro.rolid = this.tipoRolSeleccionada.rolid;
            this.usuarioRegistro.usuimagen = null;
            this.usuarioRegistro.usuestado = 1;
            this.usuarioRegistro.usuusureg = this.datosUsurio.usuname;
            // console.log("usuarioRegistro: ", this.usuarioRegistro);
            this.usuarioService.gestionarUsuario(this.usuarioRegistro).subscribe(
                (result: any) => {
                    // console.log("gestionarUsuario: ", result);
                    this.messageService.add({ severity: 'success', summary: 'Exitosamente', detail: 'Proceso de modificado realizado correctamente.', life: 3000});
                    this.optionDialog = false;
                    this.usuarioDialog = false;
                    this.listarUsuarios();
                },
                (error) => {
                    this.errors = error;
                    // console.log('error', error);
                    this.messageService.add({ severity: 'error', summary: 'Error en el Registro', detail: 'Se produjo un error al intentar modificar el usuario.', life: 3000});
                }
            )
        }
    }
}
