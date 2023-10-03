import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocenteReporteRoutingModule } from './docente-reporte-routing.module';
import { DocenteReporteComponent } from './docente-reporte.component';

@NgModule({
    imports: [
        CommonModule,
        DocenteReporteRoutingModule
    ],
    declarations: [DocenteReporteComponent]
})
export class DocenteReporteModule { }
