import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AsistenciaCrudComponent } from './asistencia-crud.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: AsistenciaCrudComponent }
	])],
	exports: [RouterModule]
})
export class AsistenciaCrudRoutingModule { }
