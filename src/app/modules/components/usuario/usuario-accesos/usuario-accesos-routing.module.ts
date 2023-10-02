import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UsuarioAccesosComponent } from './usuario-accesos.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: UsuarioAccesosComponent }
    ])],
    exports: [RouterModule]
})
export class UsuarioAccesosRoutingModule { }
