import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UsuarioPermisoComponent } from './usuario-permiso.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: UsuarioPermisoComponent }
    ])],
    exports: [RouterModule]
})
export class UsuarioPermisoRoutingModule { }
