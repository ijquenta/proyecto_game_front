import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EstudianteMiAdmisionComponent } from './estudiante-mi-admision.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: EstudianteMiAdmisionComponent }
	])],
	exports: [RouterModule]
})
export class EstudianteMiAdmisionRoutingModule { }
