import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CursoCrudComponent } from './crud.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: CursoCrudComponent }
	])],
	exports: [RouterModule]
})
export class CursoCrudRoutingModule { }
