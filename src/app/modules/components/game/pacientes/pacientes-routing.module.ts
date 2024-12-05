import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PacientesComponent } from './pacientes.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: PacientesComponent }
    ])],
    exports: [RouterModule]
})
export class PacientesRoutingModule { }
