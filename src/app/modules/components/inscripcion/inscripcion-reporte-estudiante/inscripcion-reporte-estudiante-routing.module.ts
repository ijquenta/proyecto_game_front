import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InscripcionRerporteEstudianteComponent } from './inscripcion-reporte-estudiante.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: InscripcionRerporteEstudianteComponent }
    ])],
    exports: [RouterModule]
})
export class InscripcionRerporteEstudianteRoutingModule { }
