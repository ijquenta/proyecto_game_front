import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CursoReporteComponent } from './reporte.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: CursoReporteComponent }
	])],
	exports: [RouterModule]
})
export class CursoReporteRoutingModule { }
