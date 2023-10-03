import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NotaCrudComponent } from './nota-crud.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: NotaCrudComponent }
	])],
	exports: [RouterModule]
})
export class NotaCrudRoutingModule { }
