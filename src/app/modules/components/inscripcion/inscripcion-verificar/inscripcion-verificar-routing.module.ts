import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InscripcionVerificarComponent } from './inscripcion-verificar.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: InscripcionVerificarComponent }
    ])],
    exports: [RouterModule]
})
export class InscripcionVerificarRoutingModule { }
