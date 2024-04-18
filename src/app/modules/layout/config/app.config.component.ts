import { Component, Input } from '@angular/core';
import { LayoutService } from "../service/app.layout.service";
import { MenuService } from "../menu/app.menu.service";
// Services
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';
import { Router } from '@angular/router';
//Models
import { Usuario } from '../../models/usuario';
import { environment } from 'src/environments/environment';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';
@Component({
    selector: 'app-config',
    templateUrl: './app.config.component.html'
})
export class AppConfigComponent {

    // Inicializa usuario con un objeto vacío
    usuario: any = {};
    apiUrl = environment.API_URL_FOTO_PERFIL;

    @Input() minimal: boolean = false;

    scales: number[] = [12, 13, 14, 15, 16];

    isDarkTheme: boolean = false;

    constructor(public layoutService: LayoutService, public menuService: MenuService, private authService: AuthService,
                private confirmationService: ConfirmationService, private messageService: MessageService,  private router: Router
        ) { }


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

          this.initializeTheme();
    }

    initializeTheme() {
        const theme = localStorage.getItem('theme');
        const colorScheme = localStorage.getItem('colorScheme');
        if (theme && colorScheme) {
            this.changeTheme(theme, colorScheme);
        }
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

    replaceThemeLink(href: string, onComplete: Function) {
        const id = 'theme-css';
        const themeLink = document.getElementById(id) as HTMLLinkElement; // Obtener el elemento de enlace actual
        // Clonar el elemento de enlace existente
        const cloneLinkElement = themeLink.cloneNode(true) as HTMLLinkElement;
        // Establecer el nuevo href para cargar el nuevo tema
        cloneLinkElement.setAttribute('href', href);
        // Temporalmente asignar un id nuevo para evitar conflictos
        cloneLinkElement.setAttribute('id', id + '-clone');
        // Insertar el elemento clonado justo después del original en el DOM
        themeLink.parentNode!.insertBefore(cloneLinkElement, themeLink.nextSibling);
        // Escuchar el evento de carga para asegurarse de que el tema está completamente cargado
        cloneLinkElement.addEventListener('load', () => {
            // Eliminar el enlace original del DOM
            themeLink.remove();
            // Restablecer el id al clon para mantener la consistencia del DOM
            cloneLinkElement.setAttribute('id', id);
            // Ejecutar la función de callback para señalar que el cambio de tema está completo
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

    toggleTheme() {
        this.isDarkTheme = !this.isDarkTheme; // Toggle the state
        const theme = this.isDarkTheme ? 'theme-dark' : 'theme-light';
        const colorScheme = this.isDarkTheme ? 'dark' : 'light';
        // localStorage.setItem('isDarkTheme', JSON.stringify(this.isDarkTheme)); // Save the state in localStorage
        localStorage.setItem('theme', theme);
        localStorage.setItem('colorScheme', colorScheme);
        this.changeTheme(theme, colorScheme);
    }

    changeTheme(theme: string, colorScheme: string) {
        const themeLink = document.getElementById('theme-css') as HTMLLinkElement;
        const newHref = themeLink.getAttribute('href')!.replace(this.layoutService.config.theme, theme);
        // Guardar en localStorage
        // localStorage.setItem('theme', theme);
        // localStorage.setItem('colorScheme', colorScheme);
        this.replaceThemeLink(newHref, () => {
          this.layoutService.config.theme = theme;
          this.layoutService.config.colorScheme = colorScheme;
          this.layoutService.onConfigUpdate();
        });
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

    logout(){
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
