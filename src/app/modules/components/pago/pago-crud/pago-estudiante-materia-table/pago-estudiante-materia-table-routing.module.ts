import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PagoEstudianteMateriaTableComponent } from './pago-estudiante-materia-table.component';
@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: PagoEstudianteMateriaTableComponent },
    ])],
    exports: [RouterModule]
})
export class PagoEstudianteMateriaTableRoutingModule { }
