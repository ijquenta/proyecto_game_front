import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Product } from '../../api/product';
import { Subscription } from 'rxjs';
import { LayoutService } from 'src/app/modules/layout/service/app.layout.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/modules/service/core/auth.service';
import { Usuario } from '../../models/usuario';
import { PanelService } from '../../service/data/panel.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog'; // Importa DynamicDialogRef

@Component({
    templateUrl: './panel.component.html',
    styleUrls: ['./panel.component.css']
})


export class PanelComponent implements OnInit, OnDestroy {

    subscription!: Subscription;

    visible: boolean = false;

    position: string = 'center';

    usuario: Usuario;

    dialogRef!: DynamicDialogRef; // Crea una variable para almacenar la referencia al modal

    visible2: boolean = false;


    constructor(
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


    showDialog2() {
        this.visible2 = true;
    }

    closeDialog() {
        this.visible2 = false;
    }

    showDialog(position: string) {
        this.position = position;
        this.visible = true;
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
