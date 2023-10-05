import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagoReporteRoutingModule } from './pago-reporte-routing.module';
import { PagoReporteComponent } from './pago-reporte.component';

@NgModule({
    imports: [
        CommonModule,
        PagoReporteRoutingModule
    ],
    declarations: [PagoReporteComponent]
})
export class PagoReporteModule { }
