import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CursoCrudComponent } from './curso-crud.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: CursoCrudComponent }
	])],
	exports: [RouterModule]
})
export class CursoCrudRoutingModule { }
