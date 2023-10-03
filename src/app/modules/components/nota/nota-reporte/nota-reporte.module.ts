import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotaReporteRoutingModule } from './nota-reporte-routing.module';
import { NotaReporteComponent } from './nota-reporte.component';

@NgModule({
    imports: [
        CommonModule,
        NotaReporteRoutingModule
    ],
    declarations: [NotaReporteComponent]
})
export class NotaReporteModule { }
