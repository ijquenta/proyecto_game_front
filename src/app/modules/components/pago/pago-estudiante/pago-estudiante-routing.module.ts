import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PagoEstudianteComponent } from './pago-estudiante.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: PagoEstudianteComponent }
	])],
	exports: [RouterModule]
})
export class PagoEstudianteRoutingModule { }
