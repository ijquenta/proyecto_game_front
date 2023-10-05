import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatriculaListarComponent } from './matricula-listar.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: MatriculaListarComponent }
	])],
	exports: [RouterModule]
})
export class MatriculaListarRoutingModule { }
