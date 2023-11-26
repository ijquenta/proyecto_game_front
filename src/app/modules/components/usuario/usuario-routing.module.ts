import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'crud', loadChildren: () => import('./usuario-crud/usuario-crud.module').then(m => m.UsuarioCrudModule), canActivate: [ AuthGuard ] },
        { path: 'roles', loadChildren: () => import('./usuario-roles/usuario-roles.module').then(m => m.UsuarioRolesModule), canActivate: [ AuthGuard ] },
        { path: 'accesos', loadChildren: () => import('./usuario-accesos/usuario-accesos.module').then(m => m.UsuarioAccesosModule), canActivate: [ AuthGuard ] },
        { path: 'persona', loadChildren: () => import('./usuario-persona/usuario-persona.module').then(m => m.UsuarioPersonaModule), canActivate: [ AuthGuard ] },
        { path: 'reporte', loadChildren: () => import('./usuario-reporte/usuario-reporte.module').then(m => m.UsuarioReporteModule), canActivate: [ AuthGuard ] },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class UsuarioRoutingModule { }
