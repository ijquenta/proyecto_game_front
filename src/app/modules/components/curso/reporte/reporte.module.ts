import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CursoReporteRoutingModule } from './reporte-routing.module';
import { CursoReporteComponent } from './reporte.component';

@NgModule({
    imports: [
        CommonModule,
        CursoReporteRoutingModule
    ],
    declarations: [CursoReporteComponent]
})
export class CursoReporteModule { }
