import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
// Services
import { UsuarioService } from 'src/app/modules/service/data/usuario.service';
import { ReporteService } from 'src/app/modules/service/data/reporte.service';
// Models
import { Usuarios } from 'src/app/modules/models/usuarios';
import { Usuario,  } from 'src/app/modules/models/usuario';
import { TipoPersona, TipoPersona2, TipoRol } from 'src/app/modules/models/diccionario';
import { AuthService } from 'src/app/services/auth.service';
// For validations
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    templateUrl: './usuario-crud.component.html',
    providers: [MessageService],
    styleUrls: ['./usuario-crud.component.css']
})
export class UsuarioCrudComponent implements OnInit {

    layout: string = 'list';
    // Tipo Persona
    tipoPersona: TipoPersona2[] = [];
    tipoPersonaSeleccionada:  TipoPersona2;
    loading: boolean = false;
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
    product: Usuarios = {};
    selectedProducts: Usuario[] = [];
    submitted: boolean = false;
    cols: any[] = [];
    statuses: any[] = [];
    rowsPerPageOptions = [5, 10, 20];
    customers!: any[];
    // Variables for Dataview
    sortOrder: number = 0;
    sortField: string = '';
    filteredUsuarios: any[] = [];
    searchText: string = '';
    items: MenuItem[];
    // --------- Variables para validaciones ---------
    usuarioForm: FormGroup;

    constructor(
                private messageService: MessageService,
                private usuarioService: UsuarioService,
                private authService: AuthService,
                public reporte: ReporteService,
                private formBuilder: FormBuilder
                )
                {}
    ngOnInit() {
        this.loading = true;
        this.listarUsuarios();

        this.usuarioService.getTipoPersona().subscribe(
            (result: any) => {
                this.tipoPersona = result;
            }
        )
        this.usuarioService.getRoles().subscribe(
            (result: any) => {
                this.tipoRol = result;
            }
        )

        this.authService.usuario$.subscribe((user => {
            if (user) {
                if (Array.isArray(user) && user.length > 0) {
                    this.datosUsurio = user[0];
                } 
            }
        }));

        this.usuarioForm = this.formBuilder.group({
            uf_id: [''],
            uf_usuname: ['', Validators.required],
            uf_tipPerSel: ['', Validators.required],
            uf_tipRolSel: ['', Validators.required],
            uf_email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
            uf_descripcion: ['']
        })
    }

    filterUsuarios(){
        this.filteredUsuarios = this.usuarios.filter(usuario => usuario.pernomcompleto.toLowerCase().includes(this.searchText.toLowerCase()));
    }

    listarUsuarios(){
        this.usuarioService.listaUsuario().subscribe(
            (result: any) => {
                this.usuarios = result;
                this.filteredUsuarios = this.usuarios;
                this.loading = false;
            }
        )
    }
  
    openNew() {
        this.product = {};
        this.usuario = new Usuario();
        this.usuarioRegistro = new Usuario();
        this.tipoPersonaSeleccionada = null;
        this.tipoRolSeleccionada = null;
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

    confirmarEliminar() {

        this.usuarioRegistro = { ...this.usuario};
        this.usuarioRegistro.tipo = 3;
        this.usuarioRegistro.usuimagen = null;
        this.usuarioRegistro.usuusureg = this.datosUsurio.usuname;
        this.usuarioService.gestionarUsuario(this.usuarioRegistro).subscribe(
            (result: any) => {
                this.messageService.add({ severity: 'success', summary: 'Proceso realizado correctamente', detail: 'Usuario Eliminado.', life: 3000});
                this.eliminarUsuarioDialog = false;
                this.listarUsuarios();
            },
            (error) => {
                this.errors = error;
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
            this.usuarioRegistro.tipo = 1;
            this.usuarioRegistro.usuid = null;
            this.usuarioRegistro.perid = this.tipoPersonaSeleccionada.perid;
            this.usuarioRegistro.rolid = this.tipoRolSeleccionada.rolid;
            this.usuarioRegistro.usuimagen = null;
            this.usuarioRegistro.usuestado = 1;
            this.usuarioRegistro.usuusureg = this.datosUsurio.usuname;
            this.usuarioService.gestionarUsuario(this.usuarioRegistro).subscribe(
                (result: any) => {
                    this.messageService.add({ severity: 'success', summary: 'Exitosamente', detail: 'Proceso realizado correctamente.', life: 3000});
                    this.optionDialog = false;
                    this.usuarioDialog = false;
                    this.listarUsuarios();
                },
                (error) => {
                    this.errors = error;
                    this.messageService.add({ severity: 'error', summary: 'Error en el Registro', detail: 'Se produjo un error al intentar registrar el usuario.', life: 3000});
                }
            )
        }
        else{
            this.usuarioRegistro = { ...this.usuario};
            this.usuarioRegistro.tipo = 2;
            this.usuarioRegistro.perid = this.tipoPersonaSeleccionada.perid;
            this.usuarioRegistro.rolid = this.tipoRolSeleccionada.rolid;
            this.usuarioRegistro.usuimagen = null;
            this.usuarioRegistro.usuestado = 1;
            this.usuarioRegistro.usuusureg = this.datosUsurio.usuname;
            this.usuarioService.gestionarUsuario(this.usuarioRegistro).subscribe(
                (result: any) => {
                    this.messageService.add({ severity: 'success', summary: 'Exitosamente', detail: 'Proceso de modificado realizado correctamente.', life: 3000});
                    this.optionDialog = false;
                    this.usuarioDialog = false;
                    this.listarUsuarios();
                },
                (error) => {
                    this.errors = error;
                    this.messageService.add({ severity: 'error', summary: 'Error en el Registro', detail: 'Se produjo un error al intentar modificar el usuario.', life: 3000});
                }
            )
        }
    }
}
