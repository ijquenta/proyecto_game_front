import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialReporteRoutingModule } from './material-reporte-routing.module';
import { MaterialReporteComponent } from './material-reporte.component';

@NgModule({
    imports: [
        CommonModule,
        MaterialReporteRoutingModule
    ],
    declarations: [MaterialReporteComponent]
})
export class MaterialReporteModule { }
