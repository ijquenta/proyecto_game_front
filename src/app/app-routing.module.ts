import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
// import { NotfoundComponent } from './modules/components/notfound/notfound.component';
import { AppLayoutComponent } from "./modules/layout/app.layout.component";

// import { LoginComponent } from './release/components/auth/login/login.component';


const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./modules/components/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'principal',
    // loadChildren: () => import('./release/components/dashboard/dashboard.module').then((m) => m.DashboardModule),
    component: AppLayoutComponent,
                children: [
                    { path: '', loadChildren: () => import('./modules/components/principal/principal.module').then(m => m.PrincipaldModule) },
                    // { path: '', loadChildren: () => import('./release/components/auth/login/login.module').then(m => m.LoginModule)},
                    // { path: 'uikit', loadChildren: () => import('./release/components/uikit/uikit.module').then(m => m.UIkitModule) },
                    // { path: 'utilities', loadChildren: () => import('./release/components/utilities/utilities.module').then(m => m.UtilitiesModule) },
                    // { path: 'documentation', loadChildren: () => import('./release/components/documentation/documentation.module').then(m => m.DocumentationModule) },
                    // { path: 'blocks', loadChildren: () => import('./release/components/primeblocks/primeblocks.module').then(m => m.PrimeBlocksModule) },
                    // { path: 'pages', loadChildren: () => import('./release/components/pages/pages.module').then(m => m.PagesModule) },
                    { path: 'usuario', loadChildren: () => import('./modules/components/usuario/usuario.module').then(m => m.UsuarioModule) },
                    // para estudiantes
                    { path: 'estudiante', loadChildren: () => import('./modules/components/estudiante/estudiante.module').then(m => m.EstudianteModule) },
                    { path: 'asistencia', loadChildren: () => import('./modules/components/asistencia/asistencia.module').then(m => m.AsistenciaModule) },
                    { path: 'docente', loadChildren: () => import('./modules/components/docente/docente.module').then(m => m.DocenteModule) },
                    { path: 'nota', loadChildren: () => import('./modules/components/nota/nota.module').then(m => m.NotaModule) },
                    { path: 'inscripcion', loadChildren: () => import('./modules/components/inscripcion/inscripcion.module').then(m => m.InscripcionModule) },

                    // { path: 'login', loadChildren:() => import('./release/components/auth/login/login.module').then(m => m.LoginModule)},
                ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
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
