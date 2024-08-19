import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TipoTextoComponent } from './tipo-texto.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: TipoTextoComponent }
	])],
	exports: [RouterModule]
})
export class TipoTextoRoutingModule { }
