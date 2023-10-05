import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InscripcionVerificarRoutingModule } from './inscripcion-verificar-routing.module';
import { InscripcionVerificarComponent } from './inscripcion-verificar.component';

@NgModule({
    imports: [
        CommonModule,
        InscripcionVerificarRoutingModule
    ],
    declarations: [InscripcionVerificarComponent]
})
export class InscripcionVerificarModule { }
