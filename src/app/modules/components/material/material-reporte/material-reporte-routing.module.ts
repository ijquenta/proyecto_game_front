import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialReporteComponent } from './material-reporte.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: MaterialReporteComponent }
    ])],
    exports: [RouterModule]
})
export class MaterialReporteRoutingModule { }
