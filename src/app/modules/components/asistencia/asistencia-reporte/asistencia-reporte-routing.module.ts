import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AsistenciaReporteComponent } from './asistencia-reporte.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: AsistenciaReporteComponent }
	])],
	exports: [RouterModule]
})
export class AsistenciaReporteRoutingModule { }
