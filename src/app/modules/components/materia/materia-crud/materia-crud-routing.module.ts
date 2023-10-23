import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MateriaCrudComponent } from './materia-crud.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: MateriaCrudComponent }
	])],
	exports: [RouterModule]
})
export class MateriaCrudRoutingModule { }
