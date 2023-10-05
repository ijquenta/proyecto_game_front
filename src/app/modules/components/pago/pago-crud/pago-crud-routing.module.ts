import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PagoCrudComponent } from './pago-crud.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: PagoCrudComponent }
	])],
	exports: [RouterModule]
})
export class PagoCrudRoutingModule { }
