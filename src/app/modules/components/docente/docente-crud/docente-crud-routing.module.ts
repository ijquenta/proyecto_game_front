import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DocenteCrudComponent } from './docente-crud.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: DocenteCrudComponent }
	])],
	exports: [RouterModule]
})
export class DocenteCrudRoutingModule { }
