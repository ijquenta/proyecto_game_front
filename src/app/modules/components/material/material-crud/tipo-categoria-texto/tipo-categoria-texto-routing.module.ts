import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TipoCategoriaTextoComponent } from './tipo-categoria-texto.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: TipoCategoriaTextoComponent }
	])],
	exports: [RouterModule]
})
export class TipoCategoriaTextoRoutingModule { }
