import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NivelReporteComponent } from './nivel-reporte.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: NivelReporteComponent }
	])],
	exports: [RouterModule]
})
export class NivelReporteRoutingModule { }
