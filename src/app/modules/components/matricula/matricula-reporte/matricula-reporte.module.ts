import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatriculaRerporteRoutingModule } from './matricula-reporte-routing.module';
import { MatriculaRerporteComponent } from './matricula-reporte.component';

@NgModule({
    imports: [
        CommonModule,
        MatriculaRerporteRoutingModule
    ],
    declarations: [MatriculaRerporteComponent]
})
export class MatriculaRerporteModule { }
