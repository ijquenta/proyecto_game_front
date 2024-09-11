import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PagoEstudianteMatriculaComponent } from './pago-estudiante-matricula.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: PagoEstudianteMatriculaComponent }
	])],
	exports: [RouterModule]
})
export class PagoEstudianteMatriculaRoutingModule { }
