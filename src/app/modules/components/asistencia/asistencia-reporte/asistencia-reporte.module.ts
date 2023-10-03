import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsistenciaReporteRoutingModule } from './asistencia-reporte-routing.module';
import { AsistenciaReporteComponent } from './asistencia-reporte.component';

@NgModule({
    imports: [
        CommonModule,
        AsistenciaReporteRoutingModule
    ],
    declarations: [AsistenciaReporteComponent]
})
export class AsistenciaReporteModule { }
