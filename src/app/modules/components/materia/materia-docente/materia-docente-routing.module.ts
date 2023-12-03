import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MateriaDocenteComponent } from './materia-docente.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: MateriaDocenteComponent }
	])],
	exports: [RouterModule]
})
export class MateriaDocenteRoutingModule { }
