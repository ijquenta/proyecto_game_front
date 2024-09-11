import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MateriaPensumComponent } from './materia-pensum.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: MateriaPensumComponent }
	])],
	exports: [RouterModule]
})
export class MateriaPensumRoutingModule { }
