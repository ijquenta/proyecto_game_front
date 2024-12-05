import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotfoundComponent } from '../notfound/notfound.component';
import { authGuard } from 'src/app/guards/auth.guard';
import { HasRoleGuard } from 'src/app/guards/has-role.guard';
import { AccessDeniedComponent } from '../auth/access-denied/access-denied.component';

const routes: Routes = [
  {
    path: 'sesiones',
    // canActivate: [authGuard, HasRoleGuard],
    // data: { role: ['Administrador', 'Director', 'Secretaria'] },
    loadChildren: () => import('./sesiones/sesiones.module').then(m => m.SesionesModule)
  },
  {
    path: 'doctores',
    // canActivate: [authGuard, HasRoleGuard],
    // data: { role: 'Administrador' },
    loadChildren: () => import('./doctores/doctores.module').then(m => m.DoctoresModule)
  },
  {
    path: 'usuarios',
    // canActivate: [authGuard, HasRoleGuard],
    // data: { role: 'Administrador' },
    loadChildren: () => import('./usuarios/usuarios.module').then(m => m.UsuariosModule)
  },
  {
    path: 'pacientes',
    // canActivate: [authGuard, HasRoleGuard],
    // data: { role: ['Administrador', 'Director', 'Secretaria'] },
    loadChildren: () => import('./pacientes/pacientes.module').then(m => m.PacientesModule)
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
export class GameRoutingModule { }
