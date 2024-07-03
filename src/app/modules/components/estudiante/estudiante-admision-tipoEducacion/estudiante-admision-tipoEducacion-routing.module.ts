import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EstudianteAdmisionTipoEducacionComponent } from './estudiante-admision-tipoEducacion.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: EstudianteAdmisionTipoEducacionComponent }
	])],
	exports: [RouterModule]
})
export class EstudianteAdmisionTipoEducacionRoutingModule { }
