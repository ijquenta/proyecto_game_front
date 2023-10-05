import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MateriaReporteComponent } from './materia-reporte.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: MateriaReporteComponent }
    ])],
    exports: [RouterModule]
})
export class MateriaReporteRoutingModule { }
