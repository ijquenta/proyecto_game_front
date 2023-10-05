import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PagoNotificacionComponent } from './pago-notificacion.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: PagoNotificacionComponent }
    ])],
    exports: [RouterModule]
})
export class PagoNotificacionRoutingModule { }
