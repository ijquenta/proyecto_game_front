import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UsuarioCrudComponent } from './usuario-crud.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: UsuarioCrudComponent }
	])],
	exports: [RouterModule]
})
export class CrudRoutingModule { }
