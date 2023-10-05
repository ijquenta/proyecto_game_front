import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InscripcionListarComponent } from './inscripcion-listar.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: InscripcionListarComponent }
	])],
	exports: [RouterModule]
})
export class InscripcionListarRoutingModule { }
