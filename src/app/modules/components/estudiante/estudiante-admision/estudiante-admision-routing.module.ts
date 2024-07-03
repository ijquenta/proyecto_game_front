import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EstudianteAdmisionComponent } from './estudiante-admision.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: EstudianteAdmisionComponent }
	])],
	exports: [RouterModule]
})
export class EstudianteAdmisionRoutingModule { }
