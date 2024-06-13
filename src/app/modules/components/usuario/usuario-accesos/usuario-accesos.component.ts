// Imports
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, forkJoin, of } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
// Models
import { Usuario } from 'src/app/modules/models/usuario';
import { Rol } from 'src/app/modules/models/rol';
import { MenuItem } from 'primeng/api';
import { Acceso } from 'src/app/modules/models/acceso';
import { TipoIcono, TipoRol, TipoSubMenu, TipoMenu } from 'src/app/modules/models/diccionario';
import { Menu } from 'src/app/modules/models/menu';
import { SubMenu } from 'src/app/modules/models/submenu';
// Serivices
import { AuthService } from 'src/app/services/auth.service';
import { RolService } from 'src/app/modules/service/data/rol.service';
import { UsuarioService } from 'src/app/modules/service/data/usuario.service';
import { AccesoService } from 'src/app/modules/service/data/acceso.service';
import { PermisoService } from 'src/app/modules/service/data/permiso.service';
import { MenuService } from 'src/app/modules/service/data/menu.service';
import { TipoIconoService } from 'src/app/modules/service/data/tipoIcono.service';
import { SubMenuService } from 'src/app/modules/service/data/submenu.service';
@Component({
    selector: 'usuario-accesos-component', // This is for called in other component
    templateUrl: './usuario-accesos.component.html',
    providers: [MessageService],
    styleUrls: ['./usuario-accesos.component.css'],

})
export class UsuarioAccesosComponent implements OnInit {

    items: MenuItem[] | undefined;
    home: MenuItem | undefined;
    accesses: Acceso[] = [];
    access: Acceso;
    deleteAccessDialog: boolean = false;
    addAccessdialog: boolean = false;
    roles: any[];
    // submenus: any[];
    activeIndex: number = 0;
    scrollableTabs: any[];
    usuario = new Usuario;
    accessForm: FormGroup;
    tipoRol: TipoRol[] = [];
    tipoSubMenu: TipoSubMenu[] = [];
    stateOptionsEstado: any[];
    count: any;

    // Menu Variables
    manageMenuDialog: boolean = false;
    deleteMenuDialog: boolean = false;
    menus : Menu[] = [];;
    menu: Menu;
    loading: boolean = false;
    menuForm: FormGroup;
    dialogMenu: boolean = false;
    optionMenu: boolean = false;
    tipoIcono: TipoIcono[] = [];
    icoid: number;


    // SubMenu Variables
    manageSubMenuDialog: boolean = false;
    deleteSubMenuDialog: boolean = false;
    submenus : SubMenu[] = [];;
    submenu: SubMenu;
    submenuForm: FormGroup;
    dialogSubMenu: boolean = false;
    optionSubMenu: boolean = false;
    tipoMenu: TipoMenu[] = [];


    constructor(
        public usuarioService: UsuarioService,
        private messageService: MessageService,
        public rolService: RolService,
        private authService: AuthService,
        private accesoService: AccesoService,
        private permisoService: PermisoService,
        private formBuilder: FormBuilder,
        private menuService: MenuService,
        private tipoIconoService: TipoIconoService,
        private spinner: NgxSpinnerService,
        private subMenService: SubMenuService
    ) {}

    ngOnInit() {

        this.items = [{ label: 'Usuarios'}, { label: 'Gestionar Accesos', routerLink:''},];
        this.home = { icon: 'pi pi-home', routerLink: '/' };
        this.stateOptionsEstado = [ { label: 'Activo', value: 1 }, { label: 'Inactivo', value: 0 } ]
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

        this.menuForm = this.formBuilder.group({
            menid: [''],
            mennombre: ['', [Validators.required]],
            tipoIcono: ['', [Validators.required]],
            menusureg: [''],
            menusumod: [''],
            mendescripcion: [''],
            menestado: ['', [Validators.required]]
        })

        this.submenuForm = this.formBuilder.group({
            submenid: [''],
            submennombre: ['', [Validators.required]],
            tipoMenu: ['', [Validators.required]],
            submenusureg: [''],
            submenusumod: [''],
            submendescripcion: [''],
            submenestado: ['', [Validators.required]]
        })

        this.getUser();

        this.getSubMenus();

        this.listAccesses();

        this.getDataRoles();

        this.getDataTipoRol();

        this.getDataAccessType();
    }

    // Important Functions
    // get User
    getUser() {
        this.authService.usuario$.subscribe((user => {
            if (user) {
                if (Array.isArray(user) && user.length > 0) {
                    this.usuario = user[0];
                }
            }
        }));
    }
    // Access ------------------------------------------------------------------------------------------------------------------
    // List
    listAccesses() {
        this.spinner.show();
        this.accesoService.getAccesses().subscribe({ 
            next: (data: any) => {
            this.accesses = data;
            this.spinner.hide();
            // console.log('list accesses: ', this.accesses);
            },
            error: (error) => {
            console.error('Error al listar accesos:', error);
            this.spinner.hide();
            }, 
            complete: () => {
            // console.log('Listado de accesos completado.');
            this.spinner.hide();
            }
        });
    }
    // Delete
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
    // Add
    addAcceso(){
        this.addAccessdialog = true;
        this.accessForm.reset();
    }
    // Get Roles
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
    // Get Operation by Id
    getOperacionPorId(submenId: number) {
        return this.submenus.find(submenu => submenu?.submenid === submenId);
    }
    // Get Sub Menus
    getSubMenus() {
        this.accesoService.getSubMenus().subscribe(
            (data) => {
                this.submenus = data as any[];
                // console.log("getSubMenus: ", this.submenus)
            },
            (error) => {
                console.error('Error in recupered submenus', error);
            }
        );
    }
    // Get Tipo Rol
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
    // Get Access Type
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
    // Send Form Access Create Multiples
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
    // toggle Access Update
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
    // Get Acesses Order by rolid
    getAccessesByRolId(rolId: number) {
        if (this.accesses) {
            // Filtra los accesos por rolId
            let filteredAccesses = this.accesses.filter(access => access.rolid === rolId);

            // Ordena los accesos por mennombre
            // filteredAccesses.sort((a, b) => {
            //     const submenA = this.getOperacionPorId(a.submenid)?.submennombre || '';
            //     const submenB = this.getOperacionPorId(b.submenid)?.submennombre || '';
            //     return submenA.localeCompare(submenB);
            // });

            return filteredAccesses;
        } else {
            return [];
        }
    }
    // Option dialog delete
    handleClickAccess(access: any) {
        // console.log('handleClickAccess!', access);
        this.access = access;
        this.deleteAccessDialog = true;
    }
    // Option dialog Access
    hideDialogAccess() {
        this.addAccessdialog = false;
    }
   

    // Menu ------------------------------------------------------------------------------------------------------------------
    // Get Menus
    getDataMenus(){
        this.spinner.show();
        this.menuService.getMenus().subscribe({
            next: (data) => {
                this.menus = data as Menu[];
                this.spinner.hide();
                // console.log("Menus: ", this.menus)
            },
            error: (error) => {
                this.spinner.hide();
                console.error('Error when listing getDatamenus', error);
            }
            ,complete: () => {
            }
        })
    }
    // button manage Menus
    manageMenus(){
        this.getDataMenus();
        this.getDataTipoIcono();
        this.manageMenuDialog = true;
    }
    // Create
    MenuCreate() {
        this.menuForm.reset();
        this.dialogMenu = true;
        this.optionMenu = true;
        // this.getDataTipoIcono();
    }
    // Delete
    MenuDelete(menu: Menu){
        console.log("MenuDelete: ", menu)
        this.menu = {...menu};
        this.deleteMenuDialog = true;
    }
    // Send Delete Menu
    sendDeleteMenu(){
        this.loading = true;
        this.menuService.deleteMenu(this.menu.menid).subscribe({
            next: (data) => {
                this.messageService.add({ severity: 'success', summary: 'Menu', detail: 'Eliminado, correcto.', life: 3000 });
                this.deleteMenuDialog = false;
                this.loading = false;
                this.getDataMenus();
            },
            error: (error) => {
                console.error('Error when listing deleteMenu', error);
                this.loading = false;
            }
            ,complete: () => {
            }
        })
    }   
    // Update
    MenuUpdate(menu: Menu){
        // console.log("MenuUpdate: ", menu);
        this.menuForm.reset();
        this.dialogMenu = true;
        this.optionMenu = false;

        const criterio = {
            menicono: menu.menicono
        }
        // console.log("findIdIcono: ", criterio)
        this.spinner.show();
        this.tipoIconoService.findIdIcono(criterio).subscribe({
            next: (data) => {
                // console.log("idIcono: ", data)
                this.icoid = data['icoid'] as number;
                this.spinner.hide();
            },
            error: (error) => {
                console.error('Error when listing findIdIcono', error);
                this.spinner.hide();
            }
            ,complete: () => {
                this.menuForm.patchValue({
                    menid: menu.menid,
                    mennombre: menu.mennombre,
                    tipoIcono: new TipoIcono(this.icoid, menu.menicono),
                    menusureg: menu.menusureg,
                    menusumod: menu.menusumod,
                    mendescripcion: menu.mendescripcion,
                    menestado: menu.menestado
                });
                // console.log("menuForm: ", this.menuForm.value);
            }
        })

        
    }
    // Hialog dialog menu
    hideDialogMenu(){
        this.dialogMenu = false;
        this.menuForm.reset();
    }
    // Send from menu for create or update
    sendFormMenu(){
        // console.log("optionMenuForm: ", this.optionMenu);
        // console.log("Send Data: ", this.menuForm);

        if (this.menuForm.invalid) {
            Object.values(this.menuForm.controls).forEach( control => {
                control.markAsTouched();
                control.markAsDirty();
            });
            return;
        }

        this.menu = new Menu();
        this.menu.menicono = this.menuForm.value.tipoIcono.iconombre;
        this.menu.mennombre = this.menuForm.value.mennombre;
        this.menu.menestado = this.menuForm.value.menestado;
        this.menu.menusureg = this.usuario.usuname;
        this.menu.mendescripcion = this.menuForm.value.mendescripcion;
        this.loading = true;

        if(this.optionMenu){
            // console.log("Send Data Create Menu: ", this.menu);
            this.menuService.createMenu(this.menu).subscribe({
                next: (data) => {
                    console.log("createMenu: ",data);
                },
                error: (error) => {
                    this.messageService.add({ severity: 'error', summary: 'Menu', detail: 'Creación incorrecta, intente nuevamente mas tarde.', life: 3000 });
                    console.error('Error in createMenu: ', error);
                    this.loading = false;
                },
                complete: () => {
                    this.messageService.add({ severity: 'success', summary: 'Menu', detail: 'Creación correcta.', life: 3000 });
                    this.loading = false;
                    this.dialogMenu = false;
                    this.optionMenu = false;
                    this.getDataMenus();
                }
            })
        }
        else{
            this.menu.menid = this.menuForm.value.menid;
            this.menu.menusumod = this.usuario.usuname;
            console.log("Send Data Update Menu: ", this.menu);
            this.menuService.updateMenu(this.menu.menid, this.menu).subscribe({
                next: (data) => {
                    console.log("updateMenu: ", data);
                },
                error: (error) => {
                    this.messageService.add({ severity: 'error', summary: 'Menu', detail: 'Actualización incorrecta, intente nuevamente mas tarde.', life: 3000 });
                    console.error('Error in updateMenu: ', error);
                    this.loading = false;
                },
                complete: () => {
                    this.messageService.add({ severity: 'success', summary: 'Menu', detail: 'Actualización correcta.', life: 3000 });
                    this.loading = false;
                    this.dialogMenu = false;
                    this.optionMenu = false;
                    this.getDataMenus();
                }
            })
        }

    }
    // get Tipo Icono
    getDataTipoIcono(){
        this.tipoIconoService.getTipoIcono().subscribe({

            next: (data) => {
                this.tipoIcono = data as TipoIcono[];
                console.log("TipoIcono: ", this.tipoIcono)
            },

            error: (error) => {
                console.error('Error when listing getDataTipoIcono', error);
            },

            complete: () => {

            }
        })
    }
    // get Status Description
    getStatusDescription(status: number): string {
        switch (status) {
            case 1:
                return 'Activo';
            case 0:
                return 'Inactivo';
            default:
                return 'info'
        }
    }
    // get Status Severity
    getStatusSeverity(status: number): string{
        switch (status) {
            case 1:
                return 'success';
            case 0:
                return 'danger';
            default:
                return 'info'
        }
    }

    // Sub Menu -------------------------------------------------------------------------------------------------------------
    // Get Menus
    getListSubMenu() {
        this.spinner.show();
        this.subMenService.getListSubMenu().subscribe({
          next: (data) => {
            // Merge mennombre into each submenu
            this.submenus = data.map((item: any) => {
              return {
                ...item.submenu,
                mennombre: item.mennombre
              } as SubMenu;
            });
    
            this.spinner.hide();
            console.log("SubMenus: ", this.submenus);
          },
          error: (error) => {
            this.spinner.hide();
            console.error('Error when listing getDatamenus', error);
          },
          complete: () => {}
        });
    }
    // button manage SubMenu
    manageSubMenu(){
        this.getListSubMenu();
        this.getTipoMenu();
        // this.getDataTipoIcono();
        this.manageSubMenuDialog = true;
    }
     // Create
    SubMenuCreate() {
        this.submenuForm.reset();
        this.dialogSubMenu = true;
        this.optionSubMenu = true;
        this.getTipoMenu();
        // this.getDataTipoIcono();
    }
    // Get Tipo Menu
    getTipoMenu(){
        this.spinner.show();
        this.subMenService.getTipoMenu().subscribe({
            next: (data) => {
                this.tipoMenu = data as TipoMenu[];
                this.spinner.hide();
                // console.log("Menus: ", this.menus)
            },
            error: (error) => {
                this.spinner.hide();
                console.error('Error when listing getDatamenus', error);
            }
            ,complete: () => {
            }
        })
    }
    // Update
    SubMenuUpdate(submenu: SubMenu){
        console.log("SubMenuUpdate: ", submenu);
        this.submenuForm.reset();
        this.dialogSubMenu = true;
        this.submenu = {...submenu}
        this.optionSubMenu = false;
        console.log("this.submenu", this.submenu)
        this.submenuForm.patchValue({
            submenid: this.submenu.submenid,
            submennombre: this.submenu.submennombre,
            tipoMenu: new TipoMenu(this.submenu.menid, this.submenu.mennombre),
            submendescripcion: this.submenu.submendescripcion,
            submenusureg: this.submenu.submenusureg,
            submenumod: this.submenu.submenusureg,
            submenestado: this.submenu.submenestado
        });

        console.log("submenuForm: ", this.submenuForm.value);
    }
     // Hialog dialog menu
    hideDialogSubMenu(){
        this.dialogSubMenu = false;
        this.submenuForm.reset();
    }
    // Send from menu for create or update
    sendFormSubMenu(){
        // console.log("optionMenuForm: ", this.optionMenu);
        // console.log("Send Data: ", this.menuForm);

        if (this.submenuForm.invalid) {
            Object.values(this.submenuForm.controls).forEach( control => {
                control.markAsTouched();
                control.markAsDirty();
            });
            return;
        }
        this.submenu = new SubMenu();
        this.submenu.menid = this.submenuForm.value.tipoMenu.menid;
        this.submenu.submennombre = this.submenuForm.value.submennombre;
        this.submenu.submenestado = this.submenuForm.value.submenestado;
        this.submenu.submenusureg = this.usuario.usuname;
        this.submenu.submendescripcion = this.submenuForm.value.submendescripcion;
        this.loading = true;

        if(this.optionSubMenu){

            console.log("Send Data Create SubMenu: ", this.submenu);
            this.subMenService.createSubMenu(this.submenu).subscribe({
                next: (data) => {
                    console.log("createSubMenu: ",data);
                },
                error: (error) => {
                    this.messageService.add({ severity: 'error', summary: 'SubMenu', detail: 'Creación incorrecta, intente nuevamente mas tarde.', life: 3000 });
                    console.error('Error in createSubMenu: ', error);
                    this.loading = false;
                },
                complete: () => {
                    this.messageService.add({ severity: 'success', summary: 'SubMenu', detail: 'Creación correcta.', life: 3000 });
                    this.loading = false;
                    this.dialogSubMenu = false;
                    this.optionSubMenu = false;
                    this.getListSubMenu();
                }
            })
        }
        else{
            this.submenu.submenid = this.submenuForm.value.submenid;
            this.submenu.submenusumod = this.usuario.usuname;
            console.log("Data Update SubMenu: ", this.submenu);
            this.subMenService.updateSubMenu(this.submenu.submenid, this.submenu).subscribe({
                next: (data) => {
                    console.log("updateSubMenu: ", data);
                },
                error: (error) => {
                    this.messageService.add({ severity: 'error', summary: 'SubMenu', detail: 'Actualización incorrecta, intente nuevamente mas tarde.', life: 3000 });
                    console.error('Error in updateSubMenu: ', error);
                    this.loading = false;
                },
                complete: () => {
                    this.messageService.add({ severity: 'success', summary: 'SubMenu', detail: 'Actualización correcta.', life: 3000 });
                    this.loading = false;
                    this.dialogSubMenu = false;
                    this.optionSubMenu = false;
                    this.getListSubMenu();
                }
            })
        }

    }
    // Delete
    SubMenuDelete(submenu: SubMenu){
        console.log("SubMenuDelete: ", submenu)
        this.submenu = {...submenu};
        this.deleteSubMenuDialog = true;
    }
     // Send Delete Menu
    sendDeleteSubMenu(){
        this.loading = true;
        this.subMenService.deleteSubMenu(this.submenu.submenid).subscribe({
            next: (data) => {
                this.messageService.add({ severity: 'success', summary: 'SubMenu', detail: 'Eliminado, correcto.', life: 3000 });
                this.deleteSubMenuDialog = false;
                this.loading = false;
                this.getListSubMenu();
            },
            error: (error) => {
                console.error('Error when listing deleteMenu', error);
                this.loading = false;
            }
            ,complete: () => {
            }
        })
    }
  
}
