import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InscripcionNuevoComponent } from './inscripcion-nuevo.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: InscripcionNuevoComponent }
	])],
	exports: [RouterModule]
})
export class InscripcionNuevoRoutingModule { }
