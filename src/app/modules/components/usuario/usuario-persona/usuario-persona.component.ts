import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/modules/service/data/usuario.service';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

// Modelos
import { Persona } from 'src/app/modules/models/persona';

@Component({
    templateUrl: './usuario-persona.component.html',
    providers: [MessageService],
})
export class UsuarioPersonaComponent implements OnInit {
    lista_personas: Persona[] = [];
    persona_nueva: Persona[] = [];
    persona_eliminar: Persona[] = [];
    persona: {};
    // lRol: Rol[] = [];
    // role: {};
    // rol_nuevo: Rol[] = [];
    // role_eli: {};
    errors: any;
    personaDialog: boolean = false;
    rolModificarDialog: boolean = false;
    deleteProductDialog: boolean = false;
    deleteProductsDialog: boolean = false;
    submitted: boolean = false;
    submittedMod: boolean = false;
    cols: any[] = [];
    statuses: any[] = [];
    rowsPerPageOptions = [5, 10, 20];
    camposVacios: boolean = false;

    value!: string;
    constructor(
        public usuarioService: UsuarioService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        console.log('ngOnInit-->');
        this.ListarPersonas();

        this.statuses = [
            { label: 'Activo', value: 0 },
            { label: 'Inactivo', value: 1 },
        ];
    }

    ListarPersonas() {
        this.usuarioService.ListarPersona().subscribe((data: any) => {
            this.lista_personas = data;
            console.log('Personas->', this.lista_personas);
        });
    }
    /*
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
            registroRol.rolNombre = rol_nombre;
            registroRol.rolDescripcion = rol_descripcion;
            registroRol.rolUsuReg = 'Administrador';
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
    */


    modificarPersona(datosPersona: Persona) {
        this.persona = { ...datosPersona };
        this.personaDialog = true;
    }



    enviarFormulario(datosPersona: Persona) {
        console.log("Enviar Formulario: ", datosPersona);
        // if (!datosRolMod.rolnombre || !datosRolMod.roldescripcion) {
        //     this.camposVacios = true;
        //     return;
        // }
        // this.camposVacios = false;
        // let registroModRol = new Rol();
        // registroModRol.rolId = datosRolMod.rolid;
        // registroModRol.rolNombre = datosRolMod.rolnombre;
        // registroModRol.rolDescripcion = datosRolMod.roldescripcion;
        // registroModRol.rolUsuReg = 'Usu Modddd';

        // this.usuarioService
        //     .modificarRol(datosRolMod)
        //     .subscribe((result: any) => {
        //         this.messageService.add({
        //             severity: 'success',
        //             summary: 'Modificación Exitosa',
        //             detail: 'El rol se modificó correctamente en el sistema.',
        //             life: 3000,
        //         });
        //         console.log(result);
        //         this.hideDialog();
        //         this.ListarRoles();
        //     });
        this.hideDialog();
    }

    obtenerSeverity(estado: number): string {
        switch (estado) {
            case 1:
                return 'danger';
            case 2:
                return 'success';
            case 3:
                return 'warning';
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

    NuevoPersona() {
        this.persona = [];
        this.submitted = false;
        this.personaDialog = true;
    }
    /*
    deleteProduct(regRol: Rol) {
        console.log('eli>', regRol);
        this.deleteProductDialog = true;
        this.role_eli = { ...regRol };
        console.log('eli->', this.role_eli);
    }
    confirmarEliminar(datosEliminar: any) {
        this.deleteProductDialog = false;
        console.log('Datos eli', datosEliminar);
        this.usuarioService
            .eliminarRol(datosEliminar)
            .subscribe((result: any) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Eliminación Exitosa',
                    detail: 'El rol se eliminó correctamente del sistema.',
                    life: 3000,
                });
                console.log(result);
                // this.hideDialog();
                this.ListarRoles();
            });
        this.role_eli = {};
    }*/
    hideDialog() {
        this.personaDialog = false;
        // this.rolModificarDialog = false;
        this.submitted = false;
        this.deleteProductDialog = false;
        this.persona_nueva = [];
    }
    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }
}
