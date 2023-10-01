import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './release/components/notfound/notfound.component';
import { AppLayoutComponent } from "./layout/app.layout.component";

import { LoginComponent } from './components/login/login.component';

@NgModule({
    imports: [
        RouterModule.forRoot([
            {   // Son Rutas para los modulos
                path: '', component: AppLayoutComponent,
                children: [
                    { path: '', loadChildren: () => import('./release/components/dashboard/dashboard.module').then(m => m.DashboardModule) },
                    // { path: 'uikit', loadChildren: () => import('./release/components/uikit/uikit.module').then(m => m.UIkitModule) },
                    // { path: 'utilities', loadChildren: () => import('./release/components/utilities/utilities.module').then(m => m.UtilitiesModule) },
                    // { path: 'documentation', loadChildren: () => import('./release/components/documentation/documentation.module').then(m => m.DocumentationModule) },
                    // { path: 'blocks', loadChildren: () => import('./release/components/primeblocks/primeblocks.module').then(m => m.PrimeBlocksModule) },
                    // { path: 'pages', loadChildren: () => import('./release/components/pages/pages.module').then(m => m.PagesModule) },
                    { path: 'usuario', loadChildren: () => import('./release/components/usuario/usuario.module').then(m => m.UsuarioModule) },
                ]
            },
            // { path: 'auth', loadChildren: () => import('./release/components/auth/auth.module').then(m => m.AuthModule) },
            // { path: 'landing', loadChildren: () => import('./release/components/landing/landing.module').then(m => m.LandingModule) },
            // { path: 'notfound', component: NotfoundComponent },
            // { path: '**', redirectTo: '/notfound' },
            { path: 'login', component: LoginComponent}
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
