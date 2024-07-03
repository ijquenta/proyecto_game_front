import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EstudianteAdmisionTipoCargoComponent } from './estudiante-admision-tipoCargo.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: EstudianteAdmisionTipoCargoComponent }
	])],
	exports: [RouterModule]
})
export class EstudianteAdmisionTipoCargoRoutingModule { }
