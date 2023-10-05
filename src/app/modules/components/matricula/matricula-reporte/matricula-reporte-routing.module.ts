import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatriculaRerporteComponent } from './matricula-reporte.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: MatriculaRerporteComponent }
    ])],
    exports: [RouterModule]
})
export class MatriculaRerporteRoutingModule { }
