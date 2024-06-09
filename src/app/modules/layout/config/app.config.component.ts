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
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
    selector: 'app-config',
    templateUrl: './app.config.component.html'
})
export class AppConfigComponent {

    usuario: any = {};
    apiUrl = environment.API_URL_FOTO_PERFIL;
    @Input() minimal: boolean = false;
    scales: number[] = [12, 13, 14, 15, 16];
    isDarkTheme: boolean = false;

    constructor(public layoutService: LayoutService, 
                public menuService: MenuService, 
                private authService: AuthService,
                private confirmationService: ConfirmationService, 
                private messageService: MessageService, 
                private router: Router, 
                private spinner: NgxSpinnerService
               ) { }

    ngOnInit() {
          this.getDataUser();
          this.initializeTheme();
    }

    getDataUser() {
        this.authService.getPerfil().subscribe(
            (result: any) => {
              this.usuario = result[0];
            },
            (error: any) => {
              console.error("Error al obtener el perfil: ", error);
            }
          );
    }

    initializeTheme() {
        const theme = localStorage.getItem('theme');
        if(theme === "theme-dark"){
            this.isDarkTheme = true;
        }
        else {
            this.isDarkTheme = false;
        }
        const colorScheme = localStorage.getItem('colorScheme');
        if (theme && colorScheme) {
            this.changeTheme(theme);
        }
    }

    toggleTheme() {
        const theme = this.isDarkTheme ? 'theme-dark' : 'theme-light';
        localStorage.setItem('theme', theme);
        this.changeTheme(theme);
    }

    changeTheme(theme: string) {
        const themeLink = document.getElementById('app-theme') as HTMLLinkElement;
        if(themeLink) {
            themeLink.href = '/assets/layout/styles/theme/' + theme + '/' + theme + '.css'
        }
        localStorage.setItem('theme', theme);
    }

    signOff() {
        this.confirmationService.confirm({
            message: '¿Estás seguro de cerrar sesión?',
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Cerrando sesión...' });
                this.spinner.show();  
                setTimeout(() => {
                    this.logout();
                    this.spinner.hide();
                }, 3000);
            },
            reject: (type: ConfirmEventType) => {
                switch (type) {
                    case ConfirmEventType.REJECT:
                    case ConfirmEventType.CANCEL:
                        this.messageService.add({ severity: 'warn', summary: 'Cancelado', detail: 'Cancelaste la operación' });
                        break;
                }
            }
        });
    }
    
    logout(){
        this.authService.logout();
        this.router.navigate(['/login']);
        this.visible = false;
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

    
}
