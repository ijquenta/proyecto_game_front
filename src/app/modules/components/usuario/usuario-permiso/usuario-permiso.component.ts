import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';

// Models
import { Usuario } from 'src/app/modules/models/usuario';
import { Permiso } from 'src/app/modules/models/permiso';
import { Rol } from 'src/app/modules/models/rol';
import { TipoRol, TipoOperacion } from 'src/app/modules/models/diccionario';

// Serivices
import { UsuarioService } from 'src/app/modules/service/data/usuario.service';
import { AuthService } from 'src/app/services/auth.service';
import { PermisoService } from 'src/app/modules/service/data/permiso.service';
import { RolService } from 'src/app/modules/service/data/rol.service';
import { OperacionService } from 'src/app/modules/service/data/operacion.service';
import { forkJoin } from 'rxjs';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'usuario-permiso-component',
    templateUrl: './usuario-permiso.component.html',
    providers: [MessageService],
    styleUrls: ['./usuario-permiso.component.css']
})
export class UsuarioPermisoComponent implements OnInit {

    items: MenuItem[] | undefined;

    home: MenuItem | undefined;

    // Auth
    usuario = new Usuario;

    // modal
    dialogPermiso: boolean;
    visible: boolean = false;
    deletePermisoDialog: boolean = false;

    // Variables
    operaciones: any[];
    roles: any[];
    permisos: Permiso[] = [];
    permiso: Permiso;
    tipoRol: TipoRol[] = [];
    tipoOperacion: TipoOperacion[] = [];
    tipoOperacionRespaldo: TipoOperacion[] = [];
    response: any[];
    count: any;
    position: any;

    // Validation
    permisoForm: FormGroup;

    stateOptionsEstado: any[] = [
        { label: 'Habilitado', value: 1 },
        { label: 'Inabilitado', value: 0 }
    ];

    stateOptionsActivo: any[] = [
        { label: 'Activo', value: 1 },
        { label: 'Inactivo', value: 0 }
    ]

    constructor(
        public usuarioService: UsuarioService,
        private messageService: MessageService,
        public rolService: RolService,
        private authService: AuthService,
        public permisoService: PermisoService,
        private formBuilder: FormBuilder,
        private operacionService: OperacionService,
        private confirmationService: ConfirmationService
    ) { }

    ngOnInit() {

        this.items = [{ label: 'Usuarios'}, { label: 'Gestionar Permisos', routerLink:''},];

        this.home = { icon: 'pi pi-home', routerLink: '/' };

        this.authService.usuario$.subscribe((user => {
            if (user) {
                if (Array.isArray(user) && user.length > 0) {
                    this.usuario = user[0];
                }
            }
        }));

        this.getDataOperaciones();

        this.getDataRoles();

        this.getDataPermisos();

        this.getDataTipoRol();

        this.getDataTipoOperacion();

        this.permisoForm = this.formBuilder.group({
            permid: [''],
            tipoRol: ['', [Validators.required]],
            tipoOperacion: ['', [Validators.required]],
            permactivo: ['', [Validators.required]],
            permusureg: [''],
            permdescripcion: [''],
            permestado: ['', [Validators.required]]
        })

    }

    getDataTipoOperacion() {
        this.operacionService.getTipoOperacion().subscribe(
            (data) => {
                this.tipoOperacion = data as TipoOperacion[];
            },
            (error) => {
                console.error('Erro al getTipoOperacion', error)
            }
        )
    }

    getDataTipoRol() {
        this.rolService.getTipoRol().subscribe(
            (data) => {
                this.tipoRol = data as TipoRol[];
            },
            (error) => {
                console.error('Error al getTipoRol', error)
            }
        )
    }

    getDataPermisos() {
        this.permisoService.getPermisos().subscribe(
            (data) => {
                this.permisos = data as any[];
                // console.log("Permisos: ", this.permisos)
            },
            (error) => {
                console.error('Error al listar permisos', error);
            }
        );
    }

    getDataRoles() {
        this.permisoService.getRoles().subscribe(
            (data) => {
                this.roles = data as any[];
            },
            (error) => {
                console.error('Error al listar roles', error);
            }
        );
    }

    getDataOperaciones() {
        this.permisoService.getOperaciones().subscribe(
            (data) => {
                this.operaciones = data as any[];
            },
            (error) => {
                console.error('Error al listar operaciones', error);
            }
        );
    }

    getPermisosPorRol(rolId: number) {
        if (this.permisos) {
            return this.permisos.filter(permiso => permiso.rolid === rolId);
        } else {
            return [];
        }
    }

    togglePermiso(permiso: Permiso): void {
        permiso.permusumod = this.usuario.usuname;
        this.permisoService.updatePermiso(permiso).subscribe(
            response => {
                this.messageService.add({ severity: 'success', summary: 'Permiso', detail: 'Actualizado correcto.', life: 3000 });
            },
            error => {
                console.error('Error actualizando permiso:', error);
            }
        );
    }

    getOperacionPorId(opeId: number) {
        return this.operaciones.find(operacion => operacion?.opeid === opeId);
    }

    ListarRoles() {
        this.rolService.getListarRoles().subscribe((data: any) => {
            this.roles = data;
        });
    }

    addPermiso() {
        this.permisoForm.reset();
        this.dialogPermiso = true;

    }

    hideDialogPermiso() {
        this.permisoForm.reset();
        this.dialogPermiso = false;
    }

    sendFormPermiso() {
        if (this.permisoForm.invalid) {
            Object.values(this.permisoForm.controls).forEach(control => {
                control.markAsTouched();
                control.markAsDirty();
            });
            return;
        }

        this.permiso = new Permiso();
        this.permiso.rolid = this.permisoForm.value.tipoRol.rolid;
        this.permiso.permactivo = this.permisoForm.value.permactivo ? 1 : 0;
        this.permiso.permestado = this.permisoForm.value.permestado;
        this.permiso.permusureg = this.usuario.usuname;
        this.permiso.permdescripcion = this.permisoForm.value.permdescripcion;

        const operaciones = this.permisoForm.value.tipoOperacion;

        if (!Array.isArray(operaciones) || operaciones.length === 0) {
            console.error('tipoOperacion no es un array o está vacío');
            return;
        }

        const requests = operaciones.map(operacion => {
            const permisoData: Permiso = {
                ...this.permiso,
                opeid: operacion.opeid
            };
            return this.permisoService.addPermiso(permisoData);
        });

        forkJoin(requests).subscribe(
            (responses: any[]) => {

                let count = 0;
                responses.forEach(resp => {
                    if (resp.message && resp.message.includes('UniqueViolation')) {
                        count++;
                    }
                });
                this.count = count;

                this.visible = false;
                this.dialogPermiso = false;
                if (count > 0) {
                    this.messageService.add({ severity: 'info', summary: 'Permiso', detail: 'Ya registrados ' + count + ' registros', life: 3000 });
                }
                this.messageService.add({ severity: 'success', summary: 'Permiso', detail: 'Adicionados correctamente.', life: 3000 });
                this.getDataOperaciones();
                this.getDataPermisos();
                this.getDataRoles();
            },
            (error: any) => {
                console.error('Error adicionando permisos:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error adicionando permisos.', life: 3000 });
            }
        );
    }

    handleClickPermiso(permiso: any) {
        console.log('clicked!', permiso);
        this.permiso = permiso;
        this.deletePermisoDialog = true;
    }

    confirm(event: Event) {
        console.log('Confirmado', event);
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Estas seguro de continuar con este proceso?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.messageService.add({ severity: 'info', summary: 'Permiso', detail: 'Eliminado' });
            },
            reject: () => {
                this.messageService.add({ severity: 'error', summary: 'Operación', detail: 'Cancelado' });
            }
        });
    }

    confirmPosition(position: string) {
        this.position = position;

        this.confirmationService.confirm({
            message: 'Do you want to delete this record?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            accept: () => {
                this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted' });
            },
            reject: (type: ConfirmEventType) => {
                switch (type) {
                    case ConfirmEventType.REJECT:
                        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
                        break;
                    case ConfirmEventType.CANCEL:
                        this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
                        break;
                }
            },
            key: 'positionDialog'
        });
    }

    deletePermiso(){
        this.permisoService.deletePermiso(this.permiso).subscribe(
            response => {
                this.messageService.add({ severity: 'success', summary: 'Permiso', detail: 'Eliminado correcto.', life: 3000 });
                this.deletePermisoDialog = false;
                this.getDataOperaciones();
                this.getDataPermisos();
                this.getDataRoles();
            },
            error => {
                console.error('Error eliminando permiso:', error);
            }
        );
    }
}
