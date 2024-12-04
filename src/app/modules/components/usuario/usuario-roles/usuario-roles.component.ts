// Modelos
import { Usuario } from 'src/app/modules/models/usuario';

// Validation
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Services
import { AuthService } from 'src/app/modules/service/core/auth.service';

// Others
import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { getSeverityStatus, getDescriptionStatus } from '../../../utils/severityDescriptionStatus';
import { Table } from 'primeng/table';

interface ColumsTable {
    field: string;
    header: string;
}

@Component({
    templateUrl: './usuario-roles.component.html',
    providers: [MessageService],
    styleUrls: ['./usuario-roles.component.css']
})

export class UsuarioRolesComponent implements OnInit {

    // user
    usuario: Usuario;

    role: any;

    doctores: any[] = [];

    // validation
    rolForm: FormGroup;

    // boolean
    optionRole: boolean = false;
    roleDialog: boolean = false;
    deactivateRoleDialog: boolean = false;
    activateRoleDialog: boolean = false;
    loading: boolean = false;

    // Others
    errors: any;
    rowsPerPageOptions = [5, 10, 20];
    items: MenuItem[] | undefined;
    home: MenuItem | undefined;
    deleteRoleDialog: boolean;

    // Columns selected
    colsColumsTable!: ColumsTable[];

    selectedColumns: { field: string; header: string}[]  = [
        { field: 'rolnombre', header: 'Nombre' },
        { field: 'roldescripcion', header: 'Descripción' },
        { field: 'rolusureg', header: 'Registrado' },
        { field: 'rolusumod', header: 'Modificado' },
        { field: 'rolestado', header: 'Estado' },
    ];

    // Options status
    statusOptions = [
        { label: 'Activo', value: 1 },
        { label: 'Inactivo', value: 0 }
    ];

    constructor(
        private messageService: MessageService,
        private authService: AuthService,
        private formBuilder: FormBuilder,
        private spinner: NgxSpinnerService
    ) {
        this.rolForm = this.formBuilder.group({
            rolid: [''],
            rolnombre: ['', [Validators.required, Validators.minLength(5)]],
            roldescripcion: ['', Validators.required],
        });

        this.items = [{ label: 'Administrar'}, { label: 'Doctores', routerLink:''},];
        this.home = { icon: 'pi pi-home', routerLink: '/' };

        this.colsColumsTable = [
            { field: 'rolnombre', header: 'Nombre' },
            { field: 'roldescripcion', header: 'Descripción' },
            { field: 'rolfecreg', header: 'Fecha registrado'},
            { field: 'rolusumod', header: 'Modificado' },
            { field: 'rolfecmod', header: 'Fecha modificado'},
            { field: 'rolestado', header: 'Estado' }
        ];

        this.selectedColumns = [
            { field: 'rolnombre', header: 'Nombre' },
            { field: 'roldescripcion', header: 'Descripción' },
            { field: 'rolusureg', header: 'Registrado' },
            { field: 'rolusumod', header: 'Modificado' },
            { field: 'rolestado', header: 'Estado' }
        ];
    }

    ngOnInit() {
        // this.getDataUser();
        // this.getDataRoles();
    }

    // get user, roles
    getDataUser(){
        this.spinner.show();
        this.authService.getProfile().subscribe({
            next: (data: any) => {
                this.usuario = data[0];
            },
            error: (error) => {
                console.error(error)
            },
            complete: () => {
                this.spinner.hide();
            }
        });
    }

    getDataRoles() {
        // this.spinner.show();
        // this.rolService.getRoles().subscribe({
        //     next: (data: any) => {
        //         this.roles = Array.isArray(data["data"]) ? data["data"] : [];
        //     },
        //     error: (error) => {
        //         console.error(error)
        //     },
        //     complete: () => {
        //         this.spinner.hide();
        //     }
        // });
    }

    // manage role

    newRole() {
        // this.role = new Rol();
        this.roleDialog = true;
        this.optionRole = true;
        this.rolForm.reset();
    }

    createRole(){
        if(this.rolForm.invalid){
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Verifica los datos ingresados.',
                life: 5000
            });
            return Object.values(this.rolForm.controls).forEach(control=>{
                control.markAllAsTouched();
                control.markAsDirty();
            })
        }
        if(this.optionRole){

            // this.role = new Rol();

            this.role.tipo = 1;
            this.role.rolid = null;
            this.role.rolestado = 1;
            this.role.rolusureg = this.usuario.usuname;
            this.role.rolnombre = this.rolForm.value.rolnombre;
            this.role.roldescripcion = this.rolForm.value.roldescripcion;

            this.loading = true;
            // this.rolService.manageRole(this.role).subscribe({
            //     next: (result: any) => {
            //         this.messageService.add({
            //             severity: 'success',
            //             summary: 'Éxito',
            //             detail: 'Registro completado.',
            //             life: 3000
            //         });
            //     },
            //     error: (error) => {
            //         console.error(error)
            //         this.messageService.add({
            //             severity: 'error',
            //             summary: 'Error',
            //             detail: 'Ocurrió un error. Contacta al soporte.',
            //             life: 5000
            //         });
            //         this.loading = false;
            //     },
            //     complete: () => {
            //         this.roleDialog = false;
            //         this.optionRole = false;
            //         this.getDataRoles();
            //         this.loading = false;
            //         this.rolForm.reset();
            //     }
            // });
        }
        if(!this.optionRole) {
            // this.role = new Rol();
            this.role.tipo = 2;
            this.role.rolestado = 1;
            this.role.rolusumod = this.usuario.usuname;
            this.role.rolnombre = this.rolForm.value.rolnombre;
            this.role.roldescripcion = this.rolForm.value.roldescripcion;
            this.role.rolid = this.rolForm.value.rolid;
            this.loading = true;

            // this.rolService.manageRole(this.role).subscribe({
            //     next: (result: any) => {
            //         this.messageService.add({
            //             severity: 'success',
            //             summary: 'Éxito',
            //             detail: 'Registro completado.',
            //             life: 3000
            //         });
            //     },
            //     error: (error) => {
            //         console.error(error)
            //         this.messageService.add({
            //             severity: 'error',
            //             summary: 'Error',
            //             detail: 'Ocurrió un error. Contacta al soporte.',
            //             life: 5000
            //         });
            //         this.loading = false;
            //     },
            //     complete: () => {
            //         this.roleDialog = false;
            //         this.optionRole = false;
            //         this.getDataRoles();
            //         this.loading = false;
            //         this.rolForm.reset();
            //     }
            // });
        }
    }

    updateRole(data: any) {
        this.role = { ...data };

        this.rolForm.patchValue({
            rolid: this.role.rolid,
            rolnombre: this.role.rolnombre,
            roldescripcion: this.role.roldescripcion
        });

        this.roleDialog = true;
        this.optionRole = false;
    }


    // manage role status

    deactivateRole(data: any){
        this.role = { ...data };
        this.role.tipo = 2;
        this.deactivateRoleDialog = true;
    }

    activateRole(data: any){
        this.role = { ...data };
        this.role.tipo = 3;
        this.activateRoleDialog = true;
    }

    confirmActivateDeactivate() {
        this.loading = true;
        // this.rolService.manageRoleStatus(this.role).subscribe({
        //     next: (result: any) => {
        //         this.messageService.add({
        //             severity: 'success',
        //             summary: 'Éxito',
        //             detail: 'Registro completado.',
        //             life: 3000
        //         });
        //     },
        //     error: (error) => {
        //         console.error(error)
        //         this.messageService.add({
        //             severity: 'error',
        //             summary: 'Error',
        //             detail: 'Ocurrió un error. Contacta al soporte.',
        //             life: 5000
        //         });
        //         this.loading = false;
        //     },
        //     complete: () => {
        //         this.deactivateRoleDialog = false;
        //         this.activateRoleDialog = false;
        //         this.getDataRoles();
        //         this.loading = false;
        //     }
        // });
    }

    // Delete
    deleteRole(role: any){
        this.role = {...role};
        this.deleteRoleDialog = true;
    }
    // Send Delete Role
    sendDeleteRole(){
        this.loading = true;
        // this.rolService.deleteRole(this.role.rolid).subscribe({
        //     next: (data) => {
        //         this.messageService.add({ severity: 'success', summary: 'Rol', detail: 'Eliminado correctamente.', life: 3000 });
        //         this.deleteRoleDialog = false;
        //         this.loading = false;
        //         this.getDataRoles();
        //     },
        //     error: (error) => {
        //         console.error('Error when listing deleteMenu', error);
        //         this.loading = false;
        //     }
        //     ,complete: () => {
        //     }
        // })
    }

    // others

    hideDialog() {
        this.roleDialog = false;
        this.deactivateRoleDialog = false;
        this.activateRoleDialog = false;
        // this.role = new Rol();
        this.rolForm.reset();
    }

    getDescription(status: any){
        return getDescriptionStatus(status);
    }

    getSeverity(status: any){
        return getSeverityStatus(status);
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }

    // Obtiene el color del estado
    getSeverityStatus(estado: number): string {
        switch (estado) {
            case 1:
                return 'success';
            case 0:
                return 'danger';
            default:
                return 'info';
        }
    }
    // Obtiene la descripción del estado
    getDescriptionStatus(estado: number): string {
        switch (estado) {
            case 1:
                return 'Activo';
            case 0:
                return 'Inactivo';
            default:
                return 'Ninguno';
        }
    }

}
