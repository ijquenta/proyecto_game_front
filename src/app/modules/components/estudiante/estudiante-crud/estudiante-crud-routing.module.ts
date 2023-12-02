import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EstudianteCrudComponent } from './estudiante-crud.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: EstudianteCrudComponent }
	])],
	exports: [RouterModule]
})
export class CrudRoutingModule { }
