import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InscripcionRerportesRoutingModule } from './inscripcion-reportes-routing.module';
import { InscripcionRerportesComponent } from './inscripcion-reportes.component';

@NgModule({
    imports: [
        CommonModule,
        InscripcionRerportesRoutingModule
    ],
    declarations: [InscripcionRerportesComponent]
})
export class InscripcionRerportesModule { }
