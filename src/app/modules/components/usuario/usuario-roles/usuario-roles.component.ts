import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/modules/service/data/usuario.service';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

// Modelos
import { Rol } from 'src/app/modules/models/rol';

// Serivices
import { RolService } from 'src/app/modules/service/data/rol.service';

@Component({
    // selector: './usuario-accesos.component',
    templateUrl: './usuario-roles.component.html',
    providers: [MessageService],
})
export class UsuarioRolesComponent implements OnInit {
    roles: Rol[] = [];
    rol: Rol;
    rolRegistro: Rol;
    optionRol: boolean = false;
    roldialog: boolean = false;
    eliminarRolDialog: boolean = false;

    lRol: Rol[] = [];
    role: {};
    rol_nuevo: Rol[] = [];
    role_eli: {};
    errors: any;
    rolNuevoDialog: boolean = false;
    rolModificarDialog: boolean = false;
    deleteProductDialog: boolean = false;
    deleteProductsDialog: boolean = false;
    submitted: boolean = false;
    submittedMod: boolean = false;
    cols: any[] = [];
    statuses: any[] = [];
    rowsPerPageOptions = [5, 10, 20];
    camposVacios: boolean = false;
    constructor(
        public usuarioService: UsuarioService,
        private messageService: MessageService,
        public rolService: RolService
    ) {}

    ngOnInit() {
        // console.log('ngOnInit: ');
        this.ListarRoles();

        this.statuses = [
            { label: 'Activo', value: 0 },
            { label: 'Inactivo', value: 1 },
        ];
    }

    ListarRoles() {
        this.rolService.getListarRoles().subscribe((data: any) => {
            this.roles = data;
            // console.log('Lista Roles: ', this.roles);
        });
    }
    registroRol(){
        if(this.optionRol){
            console.log("registroRol: ", this.rol);
            this.rolRegistro = { ...this.rol };
            this.rolRegistro.tipo = 1;
            this.rolRegistro.rolid = null;
            this.rolRegistro.rolestado = 1;
            this.rolRegistro.rolusureg = 'ijquenta';
            this.rolService.gestionarRol(this.rolRegistro).subscribe(
                (result: any) => {
                    this.messageService.add({ severity: 'success', summary: 'Registro Exitoso', detail: 'El rol se registró correctamente en el sistema.', life: 3000 });
                    this.roldialog = false;
                    this.optionRol = false;
                    this.ListarRoles();
                },
                (error) => {
                    this.errors = error;
                    console.log('error', error);
                    this.messageService.add({ severity: 'error', summary: 'Error en el Registro', detail: 'Se produjo un error al intentar registrar el rol. Por favor, inténtalo de nuevo.', life: 5000
                    });
                }
            );
        }else{
            console.log("registroRol: ", this.rol);
            this.rolRegistro = { ...this.rol };
            this.rolRegistro.tipo = 2;
            // this.rolRegistro.rolid = null;
            this.rolRegistro.rolestado = 1;
            this.rolRegistro.rolusureg = 'ijquenta';
            this.rolService.gestionarRol(this.rolRegistro).subscribe(
                (result: any) => {
                    this.messageService.add({ severity: 'success', summary: 'Registro Exitoso', detail: 'El rol se modificó correctamente en el sistema.', life: 3000 });
                    this.roldialog = false;
                    this.optionRol = false;
                    this.ListarRoles();
                },
                (error) => {
                    this.errors = error;
                    console.log('error', error);
                    this.messageService.add({ severity: 'error', summary: 'Error en el Registro', detail: 'Se produjo un error al intentar modificar el rol. Por favor, inténtalo de nuevo.', life: 5000
                    });
                }
            );
        }
    }
    CrearRol(rol_nombre: any, rol_descripcion: any) {
        if (
            !rol_nombre ||
            !rol_descripcion ||
            !rol_nombre.trim() ||
            !rol_descripcion.trim()
        ) {
            this.submitted = true;
            console.log(this.submitted, 'VOOL.-->', rol_nombre.trim().length);
            return;
        } else {
            this.submitted = false;
            let registroRol = new Rol();
            // registroRol.rolNombre = rol_nombre;
            // registroRol.rolDescripcion = rol_descripcion;
            // registroRol.rolUsuReg = 'Administrador';
            this.usuarioService.crearRol(registroRol).subscribe(
                (result: any) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Registro Exitoso',
                        detail: 'El rol se registró correctamente en el sistema.',
                        life: 3000,
                    });
                    console.log(result);
                    this.hideDialog();
                    this.ListarRoles();
                },
                (error) => {
                    this.errors = error;
                    console.log('error', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error en el Registro',
                        detail: 'Se produjo un error al intentar registrar el rol. Por favor, inténtalo de nuevo.',
                        life: 5000,
                    });
                }
            );
        }
    }

    modificarRol(data: Rol) {
        this.rol = { ...data };
        this.roldialog = true;
        this.optionRol = false;
    }

    enviarFormulario(datosRolMod: any) {
        if (!datosRolMod.rolnombre || !datosRolMod.roldescripcion) {
            this.camposVacios = true;
            return;
        }
        this.camposVacios = false;
        let registroModRol = new Rol();
        // registroModRol.rolId = datosRolMod.rolid;
        // registroModRol.rolNombre = datosRolMod.rolnombre;
        // registroModRol.rolDescripcion = datosRolMod.roldescripcion;
        // registroModRol.rolUsuReg = 'Usu Modddd';

        this.usuarioService
            .modificarRol(datosRolMod)
            .subscribe((result: any) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Modificación Exitosa',
                    detail: 'El rol se modificó correctamente en el sistema.',
                    life: 3000,
                });
                console.log(result);
                this.hideDialog();
                this.ListarRoles();
            });
    }
    obtenerSeverity(estado: number): string {
        switch (estado) {
            case 1:
                return 'warning';
            case 0:
                return 'danger';
            default:
                return 'info'; // Valor predeterminado si el estado no coincide con 1 o 0
        }
    }
    obtenerDescripcion(estado: number): string {
        switch (estado) {
            case 1:
                return 'Activo';
            case 0:
                return 'Desactivo';
            default:
                return 'Ninguno'; // Valor predeterminado si el estado no coincide con 1 o 0
        }
    }
    NuevoRol() {
        this.rol = new Rol();
        this.submitted = false;
        this.roldialog = true;
        this.optionRol = true;
    }
    deleteProduct(regRol: Rol) {
        console.log('eli>', regRol);
        this.deleteProductDialog = true;
        this.role_eli = { ...regRol };
        console.log('eli->', this.role_eli);
    }
    eliminarRol(data: Rol){
        this.rolRegistro = { ...data };
        console.log("registroRol: ", this.rolRegistro);
        this.rolRegistro.tipo = 3;
        this.eliminarRolDialog = true;

    }
    confirmarEliminar() {
      this.rolService.gestionarRol(this.rolRegistro).subscribe(
          (result: any) => {
              this.messageService.add({ severity: 'success', summary: 'Registro Exitoso', detail: 'El rol se eliminó correctamente en el sistema.', life: 3000 });
              this.eliminarRolDialog = false;
              this.ListarRoles();
          },
          (error) => {
              this.errors = error;
              console.log('error', error);
              this.messageService.add({ severity: 'error', summary: 'Error en el Registro', detail: 'Se produjo un error al intentar eliminar el rol. Por favor, inténtalo de nuevo.', life: 5000
              });
          }
      );
    }
    hideDialog() {
        this.rolNuevoDialog = false;
        this.rolModificarDialog = false;
        this.submitted = false;
        this.deleteProductDialog = false;
        this.rol_nuevo = [];
    }
    ocultarDialog() {
        this.rolNuevoDialog = false;
        this.roldialog = false;
        this.rolModificarDialog = false;
        this.submitted = false;
        this.deleteProductDialog = false;
        this.eliminarRolDialog = false;
        this.rol = new Rol();
    }
    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }
}
