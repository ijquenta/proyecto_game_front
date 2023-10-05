import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagoNotificacionRoutingModule } from './pago-notificacion-routing.module';
import { PagoNotificacionComponent } from './pago-notificacion.component';

@NgModule({
    imports: [
        CommonModule,
        PagoNotificacionRoutingModule
    ],
    declarations: [PagoNotificacionComponent]
})
export class PagoNotificacionModule { }
