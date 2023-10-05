import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NivelCrudComponent } from './nivel-crud.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: NivelCrudComponent }
	])],
	exports: [RouterModule]
})
export class NivelCrudRoutingModule { }
