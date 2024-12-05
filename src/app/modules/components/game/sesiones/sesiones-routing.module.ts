import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SesionesComponent } from './sesiones.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: SesionesComponent }
	])],
	exports: [RouterModule]
})
export class SesionesRoutingModule { }
