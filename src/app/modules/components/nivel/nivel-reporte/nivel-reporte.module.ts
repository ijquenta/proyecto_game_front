import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NivelReporteRoutingModule } from './nivel-reporte-routing.module';
import { NivelReporteComponent } from './nivel-reporte.component';

@NgModule({
    imports: [
        CommonModule,
        NivelReporteRoutingModule
    ],
    declarations: [NivelReporteComponent]
})
export class NivelReporteModule { }
