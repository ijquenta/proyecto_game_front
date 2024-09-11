import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DocenteMiAdmisionComponent } from './docente-mi-admision.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: DocenteMiAdmisionComponent }
	])],
	exports: [RouterModule]
})
export class DocenteMiAdmisionRoutingModule { }
