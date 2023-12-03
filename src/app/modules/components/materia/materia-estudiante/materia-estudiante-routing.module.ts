import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MateriaEstudianteComponent } from './materia-estudiante.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: MateriaEstudianteComponent }
	])],
	exports: [RouterModule]
})
export class MateriaEstudianteRoutingModule { }
