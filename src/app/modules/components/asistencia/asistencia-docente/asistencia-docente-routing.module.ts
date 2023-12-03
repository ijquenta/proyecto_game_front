import { AsistenciaDocenteComponent } from './asistencia-docente.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: AsistenciaDocenteComponent }
	])],
	exports: [RouterModule]
})
export class AsistenciaDocenteRoutingModule { }
