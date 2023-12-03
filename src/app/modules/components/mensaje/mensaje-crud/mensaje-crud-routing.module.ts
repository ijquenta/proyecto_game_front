import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MensajeCrudComponent } from './mensaje-crud.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: MensajeCrudComponent }
	])],
	exports: [RouterModule]
})
export class MensajeCrudRoutingModule { }
