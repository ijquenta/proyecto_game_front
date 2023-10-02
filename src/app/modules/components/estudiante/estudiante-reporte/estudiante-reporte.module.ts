import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstudianteReporteRoutingModule } from './estudiante-reporte-routing.module';
import { EstudianteReporteComponent } from './estudiante-reporte.component';

@NgModule({
    imports: [
        CommonModule,
        EstudianteReporteRoutingModule
    ],
    declarations: [EstudianteReporteComponent]
})
export class EstudianteReporteModule { }
