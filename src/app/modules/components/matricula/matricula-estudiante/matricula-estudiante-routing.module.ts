import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatriculaEstudianteComponent } from './matricula-estudiante.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: MatriculaEstudianteComponent }
	])],
	exports: [RouterModule]
})
export class MatriculaEstudianteRoutingModule { }
