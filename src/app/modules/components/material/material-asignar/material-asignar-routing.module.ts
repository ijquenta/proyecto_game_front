import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialAsignarComponent } from './material-asignar.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: MaterialAsignarComponent }
	])],
	exports: [RouterModule]
})
export class MaterialAsignarRoutingModule { }
