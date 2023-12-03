import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AsistenciaEstudianteComponent } from './asistencia-estudiante.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: AsistenciaEstudianteComponent }
	])],
	exports: [RouterModule]
})
export class AsistenciaEstudianteRoutingModule { }
