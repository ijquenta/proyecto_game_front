import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialEstudianteComponent } from './material-estudiante.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: MaterialEstudianteComponent }
	])],
	exports: [RouterModule]
})
export class MaterialEstudianteRoutingModule { }
