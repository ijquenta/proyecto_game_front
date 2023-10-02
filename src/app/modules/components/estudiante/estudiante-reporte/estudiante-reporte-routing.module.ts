import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EstudianteReporteComponent } from './estudiante-reporte.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: EstudianteReporteComponent }
    ])],
    exports: [RouterModule]
})
export class EstudianteReporteRoutingModule { }
