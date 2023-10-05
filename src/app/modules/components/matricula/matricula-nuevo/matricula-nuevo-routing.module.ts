import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatriculaNuevoComponent } from './matricula-nuevo.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: MatriculaNuevoComponent }
	])],
	exports: [RouterModule]
})
export class MatriculaNuevoRoutingModule { }
