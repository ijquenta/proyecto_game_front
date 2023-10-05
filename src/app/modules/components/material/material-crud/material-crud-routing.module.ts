import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialCrudComponent } from './material-crud.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: MaterialCrudComponent }
	])],
	exports: [RouterModule]
})
export class MaterialCrudRoutingModule { }
