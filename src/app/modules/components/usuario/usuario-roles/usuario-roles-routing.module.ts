import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UsuarioRolesComponent } from './usuario-roles.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: UsuarioRolesComponent }
    ])],
    exports: [RouterModule]
})
export class UsuarioRolesRoutingModule { }
