import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LayoutService } from 'src/app/modules/layout/service/app.layout.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/modules/service/core/auth.service';
import { Usuario } from '../../models/usuario';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Component({
    templateUrl: './panel.component.html',
    styleUrls: ['./panel.component.css'],
})
export class PanelComponent implements OnInit, OnDestroy {
    subscription!: Subscription;
    position: string = 'center';
    usuario: Usuario;
    dialogRef!: DynamicDialogRef;
    manualUsuarioBool: boolean = false;

    tutorialesVisible: boolean = false;
    videoVisible: boolean = false;
    videoUrl: SafeResourceUrl = '';

    constructor(
        public layoutService: LayoutService,
        private spinner: NgxSpinnerService,
        private authService: AuthService,
        private sanitizer: DomSanitizer
    ) {
        this.subscription = this.layoutService.configUpdate$.subscribe(
            () => {}
        );
    }

    ngOnInit() {

        this.initUsuario();

    }

    initUsuario(){
        this.spinner.show();
        this.authService.usuario$.subscribe({
            next: (user: any) => {
                if (user) {
                    if (Array.isArray(user) && user.length > 0) {
                        this.usuario = user[0];
                    }
                }
                this.spinner.hide();
            },
            error: (error: any) => {
                this.spinner.hide();
                console.error('Error al obtener el usuario:', error);

            }
        });
    }

    showDialog(position: string) {
        this.position = position;
        this.tutorialesVisible = true;
    }

    showManualUsuarioDialog() {
        this.manualUsuarioBool = true;
    }

    closeDialogManualUsuario() {
        this.manualUsuarioBool = false;
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    // Método para abrir el modal de tutoriales
    openTutoriales() {
        this.tutorialesVisible = true;
    }

    // Método para abrir el modal del video
    openVideo(videoId: string) {
        const url = `https://drive.google.com/file/d/${videoId}/preview`;
        this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        this.videoVisible = true;
      }

    // Método para cerrar el modal del video
    closeVideo() {
        this.videoVisible = false;
    }
}
