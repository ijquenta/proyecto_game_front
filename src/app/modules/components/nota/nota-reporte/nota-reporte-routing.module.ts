import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NotaReporteComponent } from './nota-reporte.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: NotaReporteComponent }
    ])],
    exports: [RouterModule]
})
export class NotaReporteRoutingModule { }
