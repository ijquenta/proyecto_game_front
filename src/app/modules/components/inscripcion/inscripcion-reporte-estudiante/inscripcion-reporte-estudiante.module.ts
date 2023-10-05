import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InscripcionRerporteEstudianteRoutingModule } from './inscripcion-reporte-estudiante-routing.module';
import { InscripcionRerporteEstudianteComponent } from './inscripcion-reporte-estudiante.component';

@NgModule({
    imports: [
        CommonModule,
        InscripcionRerporteEstudianteRoutingModule
    ],
    declarations: [InscripcionRerporteEstudianteComponent]
})
export class InscripcionRerporteEstudianteModule { }
