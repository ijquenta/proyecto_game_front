import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CrudComponent } from './estudiante-crud.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: CrudComponent }
	])],
	exports: [RouterModule]
})
export class CrudRoutingModule { }
