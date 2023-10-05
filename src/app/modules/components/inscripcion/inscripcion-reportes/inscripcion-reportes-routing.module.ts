import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InscripcionRerportesComponent } from './inscripcion-reportes.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: InscripcionRerportesComponent }
    ])],
    exports: [RouterModule]
})
export class InscripcionRerportesRoutingModule { }
