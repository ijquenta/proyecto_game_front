import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InscripcionEstudianteComponent } from './inscripcion-estudiante.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: InscripcionEstudianteComponent }
	])],
	exports: [RouterModule]
})
export class InscripcionEstudianteRoutingModule { }
