import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MateriaReporteRoutingModule } from './materia-reporte-routing.module';
import { MateriaReporteComponent } from './materia-reporte.component';

@NgModule({
    imports: [
        CommonModule,
        MateriaReporteRoutingModule
    ],
    declarations: [MateriaReporteComponent]
})
export class MateriaReporteModule { }
