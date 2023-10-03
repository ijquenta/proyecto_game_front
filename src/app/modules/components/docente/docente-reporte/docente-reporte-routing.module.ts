import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DocenteReporteComponent } from './docente-reporte.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: DocenteReporteComponent }
    ])],
    exports: [RouterModule]
})
export class DocenteReporteRoutingModule { }
