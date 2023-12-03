import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NotaDocenteComponent } from './nota-docente.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: NotaDocenteComponent }
	])],
	exports: [RouterModule]
})
export class NotaDocenteRoutingModule { }
