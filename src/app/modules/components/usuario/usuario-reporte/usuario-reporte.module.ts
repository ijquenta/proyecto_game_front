import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioReporteRoutingModule } from './usuario-reporte-routing.module';
import { UsuarioReporteComponent } from './usuario-reporte.component';

@NgModule({
    imports: [
        CommonModule,
        UsuarioReporteRoutingModule
    ],
    declarations: [UsuarioReporteComponent]
})
export class UsuarioReporteModule { }
