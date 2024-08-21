import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotfoundComponent } from '../notfound/notfound.component';
import { authGuard } from 'src/app/guards/auth.guard';
import { HasRoleGuard } from 'src/app/guards/has-role.guard';
import { AccessDeniedComponent } from '../auth/access-denied/access-denied.component';

const routes: Routes = [
  {
    path: 'crud',
    canActivate: [authGuard, HasRoleGuard], // Primero verifica autenticación y luego el rol
    data: { role: 'Administrador' },
    loadChildren: () => import('./usuario-crud/usuario-crud.module').then(m => m.UsuarioCrudModule)
  },
  {
    path: 'roles',
    canActivate: [authGuard, HasRoleGuard],
    data: { role: 'Administrador' },
    loadChildren: () => import('./usuario-roles/usuario-roles.module').then(m => m.UsuarioRolesModule)
  },
  {
    path: 'accesos',
    canActivate: [authGuard, HasRoleGuard],
    data: { role: 'Administrador' },
    loadChildren: () => import('./usuario-accesos/usuario-accesos.module').then(m => m.UsuarioAccesosModule)
  },
  {
    path: 'persona',
    canActivate: [authGuard, HasRoleGuard],
    data: { role: 'Administrador' },
    loadChildren: () => import('./usuario-persona/usuario-persona.module').then(m => m.UsuarioPersonaModule)
  },
  {
    path: 'reporte',
    canActivate: [authGuard, HasRoleGuard], // Primero verifica autenticación y luego el rol
    data: { role: 'Administrador' },
    loadChildren: () => import('./usuario-reporte/usuario-reporte.module').then(m => m.UsuarioReporteModule)
  },
  {
    path: 'acceso',
    canActivate: [authGuard, HasRoleGuard], // Primero verifica autenticación y luego el rol
    data: { role: 'Administrador' },
    loadChildren: () => import('./usuario-accesos/usuario-accesos.module').then(m => m.UsuarioAccesosModule)
  },
  {
    path: 'permiso',
    canActivate: [authGuard, HasRoleGuard], // Primero verifica autenticación y luego el rol
    data: { role: 'Administrador' },
    loadChildren: () => import('./usuario-permiso/usuario-permiso.module').then(m => m.UsuarioPermisoModule)
  },
  {
    path: 'notfound',
    component: NotfoundComponent
  },
  {
    path: 'access-denied',
    component: AccessDeniedComponent
  },
  {
    path: '**',
    redirectTo: 'notfound'
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuarioRoutingModule { }
