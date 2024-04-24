import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Product } from '../../api/product';
import { ProductService } from '../../service/examples/product.service';
import { Subscription } from 'rxjs';
import { LayoutService } from 'src/app/modules/layout/service/app.layout.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/services/auth.service';
import { Usuario } from '../../models/usuario';
import { PanelService } from '../../service/data/panel.service';
import { DialogService } from 'primeng/dynamicdialog';
import { PanelVideoComponent } from './panel-video/panel-video.component';
@Component({
    templateUrl: './panel.component.html',
    styleUrls: ['./panel.component.css']
})


export class PanelComponent implements OnInit, OnDestroy {

    subscription!: Subscription;

    usuario: Usuario;

    constructor(private productService: ProductService,
                        public layoutService: LayoutService,
                        private spinner: NgxSpinnerService,
                        private panelService: PanelService,
                        private dialogService: DialogService,
                        private authService: AuthService) {
        this.subscription = this.layoutService.configUpdate$.subscribe(() => {
        });
    }

    ngOnInit() {

        this.spinner.show();
        this.authService.usuario$.subscribe(
          (user: any) => {
            if (user) {
              if (Array.isArray(user) && user.length > 0) {
                this.usuario = user[0];
                this.spinner.hide();
              }
            }
          },
          (error: any) => {
            console.error("Error al obtener el usuario:", error);
            this.spinner.hide();
          },
        );

    }


    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    openVideo() {
        window.open("https://youtu.be/eGri2nz4kvs", "_blank");
    }
    openVideoModal() {
        const modalRef = this.dialogService.open(PanelVideoComponent, {
          // Puedes pasar opciones de configuración si es necesario
        });
      }



}
