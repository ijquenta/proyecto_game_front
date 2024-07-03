import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EstudianteAdmisionTipoProfesionComponent } from './estudiante-admision-tipoProfesion.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: EstudianteAdmisionTipoProfesionComponent }
	])],
	exports: [RouterModule]
})
export class EstudianteAdmisionTipoProfesionRoutingModule { }
