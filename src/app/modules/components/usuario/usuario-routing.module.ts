import { NgModule } from '@angular/core';
import { RouterModule, CanActivate } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { HasRoleGuard, hasRole } from 'src/app/guards/has-role.guard';
import { NotfoundComponent } from '../notfound/notfound.component';
@NgModule({
    imports: [RouterModule.forChild([
        { path: 'crud',
        //   canActivate: [hasRole(['Administrador']), AuthGuard],
          canActivate: [AuthGuard],
        //   canLoad: [hasRole(['Administrador'])],
          loadChildren: () => import('./usuario-crud/usuario-crud.module').then(m => m.UsuarioCrudModule)
        },
        { path: 'roles',
        //   canActivate: [hasRole(['Administrador']), AuthGuard],
          canActivate: [AuthGuard],
        //   canLoad: [hasRole(['Administrador'])],
          loadChildren: () => import('./usuario-roles/usuario-roles.module').then(m => m.UsuarioRolesModule)
        },
        { path: 'accesos',
        //   canActivate: [hasRole(['Administrador']), AuthGuard],
          canActivate: [AuthGuard],
        //   canLoad: [hasRole(['Administrador'])],
          loadChildren: () => import('./usuario-accesos/usuario-accesos.module').then(m => m.UsuarioAccesosModule)
        },
        { path: 'persona',
        //   canActivate: [hasRole(['Administrador','Invitado']), AuthGuard],
          canActivate: [AuthGuard],
        //   canLoad: [hasRole(['Administrador','Invitado'])],
          loadChildren: () => import('./usuario-persona/usuario-persona.module').then(m => m.UsuarioPersonaModule)
        },
        { path: 'reporte',
        //   canActivate: [hasRole(['Administrador', 'Invitado']), AuthGuard],
        //   canLoad: [hasRole(['Administrador', 'Invitado'])],
          canActivate: [AuthGuard],
          loadChildren: () => import('./usuario-reporte/usuario-reporte.module').then(m => m.UsuarioReporteModule)
        },
        // { path: '**', redirectTo: '/notfound'  }

        {
            path: 'notfound',
            component: NotfoundComponent
          },
         {
           path: '**',
           redirectTo: 'notfound',
         }

    ])],
    exports: [RouterModule]
})
export class UsuarioRoutingModule { }
