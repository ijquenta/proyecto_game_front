import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NotaEstudianteComponent } from './nota-estudiante.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: NotaEstudianteComponent }
	])],
	exports: [RouterModule]
})
export class NotaEstudianteRoutingModule { }
