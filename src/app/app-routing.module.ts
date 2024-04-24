import { CursoModule } from './modules/components/curso/curso.module';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './modules/components/notfound/notfound.component';
import { AppLayoutComponent } from "./modules/layout/app.layout.component";
import { IsLoggedInGuard } from './guards/is-logged-in.guard';

// import { LoginComponent } from './release/components/auth/login/login.component';

// importamos el guardian
import { AuthGuard } from './guards/auth.guard';
import { RedirectGuard } from './guards/redirect.guard';
import { HasRoleGuard } from './guards/has-role.guard';

const routes: Routes = [
  {

    path: '',
    canActivate: [ RedirectGuard ],
    loadChildren: () => import('./modules/components/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'principal',
    canActivate: [ AuthGuard ],
    // loadChildren: () => import('./release/components/dashboard/dashboard.module').then((m) => m.DashboardModule),
    component: AppLayoutComponent,
                children: [
                    { path: '', loadChildren: () => import('./modules/components/panel/panel.module').then(m => m.PanelModule), canActivate: [ AuthGuard ] },
                    { path: 'principal', loadChildren: () => import('./modules/components/panel/panel.module').then(m => m.PanelModule), canActivate: [ AuthGuard ] },
                    { path: 'panel', loadChildren: () => import('./modules/components/principal/principal.module').then(m => m.PrincipaldModule), canActivate: [ AuthGuard ] },
                    // { path: '', loadChildren: () => import('./release/components/auth/login/login.module').then(m => m.LoginModule)},
                    // { path: 'uikit', loadChildren: () => import('./release/components/uikit/uikit.module').then(m => m.UIkitModule) },
                    // { path: 'utilities', loadChildren: () => import('./release/components/utilities/utilities.module').then(m => m.UtilitiesModule) },
                    // { path: 'documentation', loadChildren: () => import('./release/components/documentation/documentation.module').then(m => m.DocumentationModule) },
                    // { path: 'blocks', loadChildren: () => import('./release/components/primeblocks/primeblocks.module').then(m => m.PrimeBlocksModule) },
                    // { path: 'pages', loadChildren: () => import('./release/components/pages/pages.module').then(m => m.PagesModule) },
                    // { path: 'usuario', canLoad: [HasRoleGuard], data: { allowedRoles: ['usuario', 'Administrador']}, loadChildren: () => import('./modules/components/usuario/usuario.module').then(m => m.UsuarioModule), canActivate: [ AuthGuard ] },
                    { path: 'usuario', loadChildren: () => import('./modules/components/usuario/usuario.module').then(m => m.UsuarioModule), canActivate: [ AuthGuard ] },
                    // para estudiantes
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
                    // { path: 'notfound', loadChildren:() => import('./modules/components/notfound/notfound.module').then(m => m.NotFoundModule), canActivate: [AuthGuard]},
                     {
                         path: 'notfound',
                         component: NotfoundComponent
                       },
                      {
                        path: '**',
                        redirectTo: 'notfound'
                      }

                    // { path: 'login', loadChildren:() => import('./release/components/auth/login/login.module').then(m => m.LoginModule)},
                ],

  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking'
})],
  exports: [RouterModule]
})


/*@NgModule({
    imports: [
        RouterModule.forRoot([
            {   // Son Rutas para los modulos
                path: '', component: AppLayoutComponent,
                children: [
                    // { path: '', loadChildren: () => import('./release/components/dashboard/dashboard.module').then(m => m.DashboardModule) },
                    { path: '', loadChildren: () => import('./release/components/auth/login/login.module').then(m => m.LoginModule)},
                    // { path: 'uikit', loadChildren: () => import('./release/components/uikit/uikit.module').then(m => m.UIkitModule) },
                    // { path: 'utilities', loadChildren: () => import('./release/components/utilities/utilities.module').then(m => m.UtilitiesModule) },
                    // { path: 'documentation', loadChildren: () => import('./release/components/documentation/documentation.module').then(m => m.DocumentationModule) },
                    // { path: 'blocks', loadChildren: () => import('./release/components/primeblocks/primeblocks.module').then(m => m.PrimeBlocksModule) },
                    // { path: 'pages', loadChildren: () => import('./release/components/pages/pages.module').then(m => m.PagesModule) },
                    { path: 'usuario', loadChildren: () => import('./release/components/usuario/usuario.module').then(m => m.UsuarioModule) },
                    // { path: 'login', loadChildren:() => import('./release/components/auth/login/login.module').then(m => m.LoginModule)},
                ]
            },
            // { path: 'auth', loadChildren: () => import('./release/components/auth/auth.module').then(m => m.AuthModule) },
            // { path: 'landing', loadChildren: () => import('./release/components/landing/landing.module').then(m => m.LandingModule) },
            // { path: 'notfound', component: NotfoundComponent },
            // { path: '**', redirectTo: '/notfound' },
            // { path: 'login', component: LoginComponent}
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule]
})*/
export class AppRoutingModule {
}
