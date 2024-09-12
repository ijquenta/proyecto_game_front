import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioRoutingModule } from './usuario-routing.module';
import { MessageService } from 'primeng/api';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        UsuarioRoutingModule,
    ],
    providers: [MessageService]
})
export class UsuarioModule { }
