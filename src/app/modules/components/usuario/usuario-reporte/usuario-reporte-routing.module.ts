import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UsuarioReporteComponent } from './usuario-reporte.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: UsuarioReporteComponent }
    ])],
    exports: [RouterModule]
})
export class UsuarioReporteRoutingModule { }
