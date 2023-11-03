import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InscripcionCrudComponent } from './inscripcion-crud.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: InscripcionCrudComponent }
	])],
	exports: [RouterModule]
})
export class InscripcionCrudRoutingModule { }
