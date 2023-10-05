import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PagoReporteComponent } from './pago-reporte.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: PagoReporteComponent }
    ])],
    exports: [RouterModule]
})
export class PagoReporteRoutingModule { }
