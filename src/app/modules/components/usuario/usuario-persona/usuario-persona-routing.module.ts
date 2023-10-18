import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UsuarioPersonaComponent } from './usuario-persona.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: UsuarioPersonaComponent }
    ])],
    exports: [RouterModule]
})
export class UsuarioPersonaRoutingModule { }
