import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './modules/components/notfound/notfound.component';
import { AppLayoutComponent } from "./modules/layout/app.layout.component";
import { authGuard } from './guards/auth.guard';
import { RedirectGuard } from './guards/redirect.guard';
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
