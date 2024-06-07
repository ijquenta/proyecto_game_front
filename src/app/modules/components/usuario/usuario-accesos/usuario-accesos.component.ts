// Imports
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, forkJoin, of } from 'rxjs';
// Models
import { Usuario } from 'src/app/modules/models/usuario';
import { Rol } from 'src/app/modules/models/rol';
import { MenuItem } from 'primeng/api';
import { Acceso } from 'src/app/modules/models/acceso';
import { TipoRol, TipoSubMenu } from 'src/app/modules/models/diccionario';
// Serivices
import { AuthService } from 'src/app/services/auth.service';
import { RolService } from 'src/app/modules/service/data/rol.service';
import { UsuarioService } from 'src/app/modules/service/data/usuario.service';
import { AccesoService } from 'src/app/modules/service/data/acceso.service';
import { PermisoService } from 'src/app/modules/service/data/permiso.service';


@Component({
    selector: 'usuario-accesos-component', // This is for called in other component
    templateUrl: './usuario-accesos.component.html',
    providers: [MessageService],
})
export class UsuarioAccesosComponent implements OnInit {
    
    items: MenuItem[] | undefined;
    home: MenuItem | undefined;
    accesses: Acceso[] = [];
    access: Acceso;
    deleteAccessDialog: boolean = false;
    addAccessdialog: boolean = false;
    roles: any[];
    submenus: any[];
    activeIndex: number = 0;
    scrollableTabs: any[];
    usuario = new Usuario;
    accessForm: FormGroup;
    tipoRol: TipoRol[] = [];
    tipoSubMenu: TipoSubMenu[] = [];
    stateOptionsEstado: any[];
    count: any;

    constructor(
        public usuarioService: UsuarioService,
        private messageService: MessageService,
        public rolService: RolService,
        private authService: AuthService,
        private accesoService: AccesoService,
        private permisoService: PermisoService,
        private formBuilder: FormBuilder,
    ) {}

    ngOnInit() {
        
        this.items = [{ label: 'Usuarios'}, { label: 'Gestionar Accesos', routerLink:''},];
        
        this.home = { icon: 'pi pi-home', routerLink: '/' };

        this.stateOptionsEstado = [ { label: 'Habilitado', value: 1 }, { label: 'Inabilitado', value: 0 } ]

        this.getUser();

        this.getSubMenus();

        this.listAccesses();

        this.getDataRoles();

        this.getDataTipoRol();

        this.getDataAccessType();

        this.scrollableTabs = this.roles;

        this.accessForm = this.formBuilder.group({
            accid: [''],
            tipoRol: ['', [Validators.required]],
            tipoSubMenu: ['', [Validators.required]],
            accactivo: ['', [Validators.required]],
            accusureg: [''],
            accdescripcion: [''],
            accestado: ['', [Validators.required]]
        })
    }

    // Important Functions
    
    getUser() {
        this.authService.usuario$.subscribe((user => {
            if (user) {
                if (Array.isArray(user) && user.length > 0) {
                    this.usuario = user[0];
                }
            }
        }));
    }

    // Access Functions 
    listAccesses() {
        this.accesoService.getAccesses().subscribe((data: any) => {
            this.accesses = data;
            console.log('list accesses: ', this.accesses);
        });
    }

    deleteAccess(){
        this.accesoService.deleteAccess(this.access.accid).subscribe(
            response => {
                this.messageService.add({ severity: 'success', summary: 'Acceso', detail: 'Eliminado, correcto.', life: 3000 });
                this.deleteAccessDialog = false;
                this.getDataTipoRol();
                this.listAccesses();
                this.getDataRoles();
            },
            error => {
                console.error('Error eliminando acceso:', error);
            }
        );
    }

    addAcceso(){
        this.addAccessdialog = true;
        this.accessForm.reset();
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

    getOperacionPorId(submenId: number) {
        return this.submenus.find(submenu => submenu?.submenid === submenId);
    }

    getSubMenus() {
        this.accesoService.getSubMenus().subscribe(
            (data) => {
                this.submenus = data as any[];
                console.log("getSubMenus: ", this.submenus)
            },
            (error) => {
                console.error('Error in recupered submenus', error);
            }
        );
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

    getDataAccessType(){
        this.accesoService.getSubMenuType().subscribe(
            (data) => {
                this.tipoSubMenu = data as TipoSubMenu[];
            },
            (error) => {
                console.error('Error al getAccessType', error)
            }
        )
    }

    sendFormAccess(){
        if(this.accessForm.invalid){
            Object.values(this.accessForm.controls).forEach(control => {
                control.markAsTouched();
                control.markAsDirty();
            });
            return;
        }

        this.access = new Acceso();
        this.access.rolid = this.accessForm.value.tipoRol.rolid;
        this.access.accactivo = this.accessForm.value.accactivo? 1 : 0;
        this.access.accestado = this.accessForm.value.accestado;
        this.access.accusureg = this.usuario.usuname;
        this.access.accdescripcion = this.accessForm.value.accdescripcion;

        const submenus = this.accessForm.value.tipoSubMenu;

        if(!Array.isArray(submenus) || submenus.length === 0){
            console.error('tipoSubMenu no es un array o está vacío');
            return;
        }

        const requests = submenus.map(submenu => {
            const accessData: Acceso = {
                ...this.access,
                submenid: submenu.submenid
            };
            return this.accesoService.createAccess(accessData).pipe(
                catchError(error => {
                    if (error.error && error.error.message.includes('UniqueViolation')) {
                        // Si hay un error de violación de unicidad, retornar un objeto indicando el error
                        return of({ error: true, message: 'Error de duplicado' });
                    } else {
                        // Si el error no es una violación de unicidad, lanzar el error
                        throw error;
                    }
                })
            );
        });
        
        forkJoin(requests).subscribe(
            (responses: any[]) => {
                let count = 0;
                responses.forEach(response => {
                    if (response.error) {
                        count++;
                    }
                });
                this.count = count;
                this.addAccessdialog = false;
                if(count > 0){
                    this.messageService.add({ severity: 'info', summary: 'Acceso', detail: 'Ya se encuentra registrados: ' + count + ' registros', life: 3000 });
                }
                this.messageService.add({ severity: 'success', summary: 'Acceso', detail: 'Adicionados correctamente.', life: 3000 });
                this.getSubMenus();
                this.listAccesses();
                this.getDataRoles();
            },
            (error: any) => {
                console.error('Error adicionando accesos:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error adicionando accesos.', life: 3000 });
            }
        );
        
        
    }

    toggleAccess(access: Acceso): void {
        access.accusumod = this.usuario.usuname;
        this.accesoService.updateAccess(access.accid, access).subscribe(
            response => {
                this.messageService.add({ severity: 'success', summary: 'Acceso', detail: 'Actualizado correcto.', life: 3000 });
            },
            error => {
                console.error('Error actualizando acceso:', error);
            }
        );
    }


    // Other Fuctions
   
    getAccessesByRolId(rolId: number) {
        if (this.accesses) {
            // Filtra los accesos por rolId
            let filteredAccesses = this.accesses.filter(access => access.rolid === rolId);
            
            // Ordena los accesos por submennombre
            filteredAccesses.sort((a, b) => {
                const submenA = this.getOperacionPorId(a.submenid)?.submennombre || '';
                const submenB = this.getOperacionPorId(b.submenid)?.submennombre || '';
                return submenA.localeCompare(submenB);
            });
            
            return filteredAccesses;
        } else {
            return [];
        }
    }

    handleClickAccess(access: any) {
        console.log('handleClickAccess!', access);
        this.access = access;
        this.deleteAccessDialog = true;
    }

    hideDialogAccess() {
        this.addAccessdialog = false;
    }
    

   
}
