import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ContabilidadGestionarComponent } from './contabilidad-gestionar.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ContabilidadGestionarComponent }
	])],
	exports: [RouterModule]
})
export class ContabilidadGestionarRoutingModule { }
