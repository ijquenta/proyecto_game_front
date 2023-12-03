import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CursoEstudianteComponent } from './curso-estudiante.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: CursoEstudianteComponent }
	])],
	exports: [RouterModule]
})
export class CursoEstudianteRoutingModule { }
