import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './modules/components/notfound/notfound.component';
import { AppLayoutComponent } from "./modules/layout/app.layout.component";
import { IsLoggedInGuard } from './guards/is-logged-in.guard';

import { AuthGuard } from './guards/auth.guard';
import { RedirectGuard } from './guards/redirect.guard';
import { HasRoleGuard } from './guards/has-role.guard';
import { PagoEstudianteMateriaTableComponent } from './modules/components/pago/pago-crud/pago-estudiante-materia-table/pago-estudiante-materia-table.component';
import { EstudianteMateriaComponent } from './modules/components/pago/pago-crud/estudiante-materia/estudiante-materia.component';

const routes: Routes = [
  { path: '', loadChildren: () => import('./modules/components/auth/auth.module').then((m) => m.AuthModule), canActivate: [ RedirectGuard ] },
  {
    path: 'principal',
    canActivate: [ AuthGuard ],
    component: AppLayoutComponent,
                children: [
                    { path: '', loadChildren: () => import('./modules/components/panel/panel.module').then(m => m.PanelModule), canActivate: [ AuthGuard ] },
                    { path: 'principal', loadChildren: () => import('./modules/components/panel/panel.module').then(m => m.PanelModule), canActivate: [ AuthGuard ] },
                    { path: 'panel', loadChildren: () => import('./modules/components/principal/principal.module').then(m => m.PrincipaldModule), canActivate: [ AuthGuard ] },
                    { path: 'usuario', loadChildren: () => import('./modules/components/usuario/usuario.module').then(m => m.UsuarioModule), canActivate: [ AuthGuard ] },
                    { path: 'estudiante', loadChildren: () => import('./modules/components/estudiante/estudiante.module').then(m => m.EstudianteModule), canActivate: [ AuthGuard ] },
                    { path: 'asistencia', loadChildren: () => import('./modules/components/asistencia/asistencia.module').then(m => m.AsistenciaModule), canActivate: [ AuthGuard ] },
                    { path: 'docente', loadChildren: () => import('./modules/components/docente/docente.module').then(m => m.DocenteModule), canActivate: [ AuthGuard ] },
                    { path: 'nota', loadChildren: () => import('./modules/components/nota/nota.module').then(m => m.NotaModule), canActivate: [ AuthGuard ] },
                    { path: 'inscripcion', loadChildren: () => import('./modules/components/inscripcion/inscripcion.module').then(m => m.InscripcionModule), canActivate: [ AuthGuard ] },
                    { path: 'pago', loadChildren: () => import('./modules/components/pago/pago.module').then(m => m.PagoModule), canActivate: [ AuthGuard ] },
                    { path: 'materia', loadChildren: () => import('./modules/components/materia/materia.module').then(m => m.MateriaModule), canActivate: [ AuthGuard ] },
                    { path: 'material', loadChildren: () => import('./modules/components/material/material.module').then(m => m.MaterialModule), canActivate: [ AuthGuard ] },
                    { path: 'matricula', loadChildren: () => import('./modules/components/matricula/matricula.module').then(m => m.MatriculaModule), canActivate: [ AuthGuard ]},
                    { path: 'nivel', loadChildren: () => import('./modules/components/nivel/nivel.module').then(m => m.NivelModule), canActivate: [ AuthGuard ]},
                    { path: 'curso', loadChildren: () => import('./modules/components/curso/curso.module').then(m => m.CursoModule), canActivate: [ AuthGuard ]},
                    { path: 'mensaje', loadChildren: () => import('./modules/components/mensaje/mensaje.module').then(m => m.MensajeModule), canActivate: [ AuthGuard ]},
                    { path: 'contabilidad', loadChildren:() => import('./modules/components/contabilidad/contabilidad.module').then(m => m.ContabilidadModule), canActivate: [AuthGuard]},
                    // { path: 'estudiante-materia', loadChildren: () => import('./modules/components/pago/pago.module').then(m => m.PagoModule), canActivate: [ AuthGuard ] },
                    { path: 'pago/estudiante-materia', loadChildren: () => import('./modules/components/pago/pago.module').then(m => m.PagoModule) },
                    { path: 'pago/estudiante-materia/form', loadChildren: () => import('./modules/components/pago/pago.module').then(m => m.PagoModule) },
                    { path: 'pago/estudiante-materia/form/:id', loadChildren: () => import('./modules/components/pago/pago.module').then(m => m.PagoModule) },
                    { path: 'notfound', component: NotfoundComponent },
                    { path: '**', redirectTo: 'notfound' }
                ],

  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}

// RouterModule.forRoot([routes])
