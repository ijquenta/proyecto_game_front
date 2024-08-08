import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Input } from '@angular/core';
import { Router } from '@angular/router';

// Services
import { MenuService } from "../menu/app.menu.service";
import { LayoutService } from "../service/app.layout.service";
import { AuthService } from 'src/app/modules/service/core/auth.service';
import { TokenService } from 'src/app/modules/service/core/token.service';

//Models
import { Usuario } from '../../models/usuario';
import { environment } from 'src/environments/environment';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';
@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    styleUrls: ['./app.topbar.component.css']
})
export class AppTopBarComponent {

    // Inicializa usuario con un objeto vacío
    usuario = new Usuario();
    userProfilePhoto = environment.API_URL_PROFILE_PHOTO;

    items!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    @Input() minimal: boolean = false;

    scales: number[] = [12, 13, 14, 15, 16];


    modelOption: any[] | undefined;
    ngOnInit() {
        this.authService.getProfile().subscribe(
            (result: any) => {
              this.usuario = result[0];
            },
            (error: any) => {
              console.error("Error al obtener el perfil: ", error);
            }
          );
        this.modelOption = [
            {
                label: 'Perfil',
                icon: 'pi pi-fw pi-user',
            },
            {
                separator: true
            },
            {
                label: 'Salir',
                icon: 'pi pi-fw pi-power-off',
                command: () => this.logout()
            },
        ];
    }

    constructor(public layoutService: LayoutService, public menuService: MenuService,
                private authService: AuthService, private router: Router, private tokenService: TokenService,
                private confirmationService: ConfirmationService, private messageService: MessageService
                ) { }


    logout(){
        this.authService.logout();
        this.router.navigate(['/login']);
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

    confirm1() {
        this.confirmationService.confirm({
            message: '¿Estás seguro de cerrar sesión?',
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.messageService.add({ severity: 'info', summary: 'Confirmado', detail: 'Cerrando sessión' });
                this.logout();
            },
            reject: (type: ConfirmEventType) => {
                switch (type) {
                    case ConfirmEventType.REJECT:
                        this.messageService.add({ severity: 'warn', summary: 'Cancelo', detail: 'Cancelaste la operación' });
                        break;
                    case ConfirmEventType.CANCEL:
                        this.messageService.add({ severity: 'warn', summary: 'Cancelo', detail: 'Cancelaste la operación' });
                        break;
                }
            }
        });
    }
}



