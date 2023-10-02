import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioAccesosRoutingModule } from './usuario-accesos-routing.module';
import { UsuarioAccesosComponent } from './usuario-accesos.component';

@NgModule({
    imports: [
        CommonModule,
        UsuarioAccesosRoutingModule
    ],
    declarations: [UsuarioAccesosComponent]
})
export class UsuarioAccesosModule { }
