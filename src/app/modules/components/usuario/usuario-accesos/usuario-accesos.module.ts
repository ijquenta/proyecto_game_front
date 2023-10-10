import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioAccesosRoutingModule } from './usuario-accesos-routing.module';
import { UsuarioAccesosComponent } from './usuario-accesos.component';
import { TableModule } from 'primeng/table';
import { UsuarioService } from 'src/app/modules/service/data/usuario.service';
import { ButtonModule } from 'primeng/button';

@NgModule({
    imports: [
        CommonModule,
        UsuarioAccesosRoutingModule,
        TableModule,
        ButtonModule
    ],
    declarations: [UsuarioAccesosComponent],
    providers: [UsuarioService]
})
export class UsuarioAccesosModule { }
