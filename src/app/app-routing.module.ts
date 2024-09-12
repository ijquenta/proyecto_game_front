import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './modules/components/notfound/notfound.component';
import { AppLayoutComponent } from "./modules/layout/app.layout.component";
import { authGuard } from './guards/auth.guard';
import { RedirectGuard } from './guards/redirect.guard';
import { EstudianteMateriaComponent } from './modules/components/pago/pago-crud/estudiante-materia/estudiante-materia.component';
import { FormPagoComponent } from './modules/components/pago/pago-crud/estudiante-materia/form-pago/form-pago.component';
import { AccessDeniedComponent } from './modules/components/auth/access-denied/access-denied.component';

const routes: Routes = [
  { path: '', loadChildren: () => import('./modules/components/auth/auth.module').then((m) => m.AuthModule), canActivate: [ RedirectGuard ] },
  {
    path: 'principal',
    canActivate: [ authGuard ],
    component: AppLayoutComponent, children: [
                { path: '', loadChildren: () => import('./modules/components/panel/panel.module').then(m => m.PanelModule), canActivate: [ authGuard ] },
                { path: 'principal', loadChildren: () => import('./modules/components/panel/panel.module').then(m => m.PanelModule), canActivate: [ authGuard ] },
                { path: 'panel', loadChildren: () => import('./modules/components/principal/principal.module').then(m => m.PrincipaldModule), canActivate: [ authGuard ] },
                { path: 'usuario', loadChildren: () => import('./modules/components/usuario/usuario.module').then(m => m.UsuarioModule), canActivate: [ authGuard ] },
                { path: 'estudiante', loadChildren: () => import('./modules/components/estudiante/estudiante.module').then(m => m.EstudianteModule), canActivate: [ authGuard ] },
                { path: 'asistencia', loadChildren: () => import('./modules/components/asistencia/asistencia.module').then(m => m.AsistenciaModule), canActivate: [ authGuard ] },
                { path: 'docente', loadChildren: () => import('./modules/components/docente/docente.module').then(m => m.DocenteModule), canActivate: [ authGuard ] },
                { path: 'nota', loadChildren: () => import('./modules/components/nota/nota.module').then(m => m.NotaModule), canActivate: [ authGuard ] },
                { path: 'inscripcion', loadChildren: () => import('./modules/components/inscripcion/inscripcion.module').then(m => m.InscripcionModule), canActivate: [ authGuard ] },
                { path: 'pago', loadChildren: () => import('./modules/components/pago/pago.module').then(m => m.PagoModule), canActivate: [ authGuard ] },
                { path: 'materia', loadChildren: () => import('./modules/components/materia/materia.module').then(m => m.MateriaModule), canActivate: [ authGuard ] },
                { path: 'material', loadChildren: () => import('./modules/components/material/material.module').then(m => m.MaterialModule), canActivate: [ authGuard ] },
                { path: 'matricula', loadChildren: () => import('./modules/components/matricula/matricula.module').then(m => m.MatriculaModule), canActivate: [ authGuard ]},
                { path: 'nivel', loadChildren: () => import('./modules/components/nivel/nivel.module').then(m => m.NivelModule), canActivate: [ authGuard ]},
                { path: 'curso', loadChildren: () => import('./modules/components/curso/curso.module').then(m => m.CursoModule), canActivate: [ authGuard ]},
                { path: 'mensaje', loadChildren: () => import('./modules/components/mensaje/mensaje.module').then(m => m.MensajeModule), canActivate: [ authGuard ]},
                { path: 'contabilidad', loadChildren:() => import('./modules/components/contabilidad/contabilidad.module').then(m => m.ContabilidadModule), canActivate: [authGuard]},
                { path: 'pago', loadChildren: () => import('./modules/components/pago/pago.module').then(m => m.PagoModule) },
                { path: 'estudiante-materia', component: EstudianteMateriaComponent },
                { path: 'estudiante-materia/form', component: FormPagoComponent },
                { path: 'error', component: AccessDeniedComponent},
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
