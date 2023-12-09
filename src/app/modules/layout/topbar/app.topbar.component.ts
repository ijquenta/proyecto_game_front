import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Input } from '@angular/core';
import { Router } from '@angular/router';

// Services
import { MenuService } from "../menu/app.menu.service";
import { LayoutService } from "../service/app.layout.service";
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';

//Models
import { Usuario } from '../../models/usuario';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    styleUrls: ['./app.topbar.component.css']
})
export class AppTopBarComponent {

    // Inicializa usuario con un objeto vacío
    usuario: any = {};


    items!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    @Input() minimal: boolean = false;

    scales: number[] = [12, 13, 14, 15, 16];


    modelOption: any[] | undefined;
    ngOnInit() {
        this.authService.getPerfil().subscribe(
            (result: any) => {

              this.usuario = result[0];
            //   console.log("result get perfil: ", this.usuario);
            },
            (error: any) => {
              console.error("Error al obtener el perfil: ", error);
            }
          );
        this.modelOption = [
            {
                label: 'Perfil',
                icon: 'pi pi-fw pi-user',

                //             icon: 'pi pi-fw pi-pencil',
                //             routerLink: ['/usuario/crud']
                /*items: [
                    {
                        label: 'New',
                        icon: 'pi pi-fw pi-plus',
                        items: [
                            {
                                label: 'Bookmark',
                                icon: 'pi pi-fw pi-bookmark'
                            },
                            {
                                label: 'Video',
                                icon: 'pi pi-fw pi-video'
                            }
                        ]
                    },
                    {
                        label: 'Delete',
                        icon: 'pi pi-fw pi-trash'
                    },
                    {
                        separator: true
                    },
                    {
                        label: 'Export',
                        icon: 'pi pi-fw pi-external-link'
                    }
                ]*/
            },
            /*{
                label: 'Edit',
                icon: 'pi pi-fw pi-pencil',
                items: [
                    {
                        label: 'Left',
                        icon: 'pi pi-fw pi-align-left'
                    },
                    {
                        label: 'Right',
                        icon: 'pi pi-fw pi-align-right'
                    },
                    {
                        label: 'Center',
                        icon: 'pi pi-fw pi-align-center'
                    },
                    {
                        label: 'Justify',
                        icon: 'pi pi-fw pi-align-justify'
                    }
                ]
            },
            {
                label: 'Users',
                icon: 'pi pi-fw pi-user',
                items: [
                    {
                        label: 'New',
                        icon: 'pi pi-fw pi-user-plus'
                    },
                    {
                        label: 'Delete',
                        icon: 'pi pi-fw pi-user-minus'
                    },
                    {
                        label: 'Search',
                        icon: 'pi pi-fw pi-users',
                        items: [
                            {
                                label: 'Filter',
                                icon: 'pi pi-fw pi-filter',
                                items: [
                                    {
                                        label: 'Print',
                                        icon: 'pi pi-fw pi-print'
                                    }
                                ]
                            },
                            {
                                icon: 'pi pi-fw pi-bars',
                                label: 'List'
                            }
                        ]
                    }
                ]
            },
            {
                label: 'Events',
                icon: 'pi pi-fw pi-calendar',
                items: [
                    {
                        label: 'Edit',
                        icon: 'pi pi-fw pi-pencil',
                        items: [
                            {
                                label: 'Save',
                                icon: 'pi pi-fw pi-calendar-plus'
                            },
                            {
                                label: 'Delete',
                                icon: 'pi pi-fw pi-calendar-minus'
                            }
                        ]
                    },
                    {
                        label: 'Archieve',
                        icon: 'pi pi-fw pi-calendar-times',
                        items: [
                            {
                                label: 'Remove',
                                icon: 'pi pi-fw pi-calendar-minus'
                            }
                        ]
                    }
                ]
            },*/
            {
                separator: true
            },
            {
                label: 'Salir',
                icon: 'pi pi-fw pi-power-off',
                command: () => this.logout()
            },
            // {
            //     label: 'IsValidToken',
            //     icon: 'pi pi-fw pi-users',
            //     command: () => this.isValidToken()
            // }
        ];
    }




    constructor(public layoutService: LayoutService, public menuService: MenuService,
                private authService: AuthService, private router: Router, private tokenService: TokenService) { }


    logout(){
        this.authService.logout();
        this.router.navigate(['/login']);
        console.log("logout");
    }

    isValidToken(){
        console.log(this.tokenService.isValidToken())
    }

    get visible(): boolean {
        return this.layoutService.state.configSidebarVisible;
    }

    set visible(_val: boolean) {
        this.layoutService.state.configSidebarVisible = _val;
    }

    get scale(): number {
        return this.layoutService.config.scale;
    }

    set scale(_val: number) {
        this.layoutService.config.scale = _val;
    }

    get menuMode(): string {
        return this.layoutService.config.menuMode;
    }

    set menuMode(_val: string) {
        this.layoutService.config.menuMode = _val;
    }

    get inputStyle(): string {
        return this.layoutService.config.inputStyle;
    }

    set inputStyle(_val: string) {
        this.layoutService.config.inputStyle = _val;
    }

    get ripple(): boolean {
        return this.layoutService.config.ripple;
    }

    set ripple(_val: boolean) {
        this.layoutService.config.ripple = _val;
    }

    onConfigButtonClick() {
        this.layoutService.showConfigSidebar();
    }

    changeTheme(theme: string, colorScheme: string) {
        const themeLink = <HTMLLinkElement>document.getElementById('theme-css');
        const newHref = themeLink.getAttribute('href')!.replace(this.layoutService.config.theme, theme);
        this.layoutService.config.colorScheme
        this.replaceThemeLink(newHref, () => {
            this.layoutService.config.theme = theme;
            this.layoutService.config.colorScheme = colorScheme;
            this.layoutService.onConfigUpdate();
        });
    }

    replaceThemeLink(href: string, onComplete: Function) {
        const id = 'theme-css';
        const themeLink = <HTMLLinkElement>document.getElementById('theme-css');
        const cloneLinkElement = <HTMLLinkElement>themeLink.cloneNode(true);

        cloneLinkElement.setAttribute('href', href);
        cloneLinkElement.setAttribute('id', id + '-clone');

        themeLink.parentNode!.insertBefore(cloneLinkElement, themeLink.nextSibling);

        cloneLinkElement.addEventListener('load', () => {
            themeLink.remove();
            cloneLinkElement.setAttribute('id', id);
            onComplete();
        });
    }

    decrementScale() {
        this.scale--;
        this.applyScale();
    }

    incrementScale() {
        this.scale++;
        this.applyScale();
    }

    applyScale() {
        document.documentElement.style.fontSize = this.scale + 'px';
    }
    cantE: number = 5;  // Asigna un valor inicial para cantE
    cantC: number = 10; // Asigna un valor inicial para cantC
    cantN: number = 7;
    // En tu componente
    onEnvelopeClick() {
        // Lógica que se ejecutará cuando se haga clic en el ícono del sobre
        console.log('Clic en el ícono del sobre');
        this.cantE = this.cantE - 1;
    }

    onCalendarClick() {
        // Lógica que se ejecutará cuando se haga clic en el ícono del calendario
        console.log('Clic en el ícono del calendario');
    }

    onBellClick() {
        // Lógica que se ejecutará cuando se haga clic en el ícono de la campana
        console.log('Clic en el ícono de la campana');
        this.cantN = this.cantN - 1;
    }

}

