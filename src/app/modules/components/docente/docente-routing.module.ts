import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotfoundComponent } from '../notfound/notfound.component';
import { authGuard } from 'src/app/guards/auth.guard';
import { HasRoleGuard } from 'src/app/guards/has-role.guard';

const routes: Routes = [
    {
        path: 'reporte',
        loadChildren: () => import('./docente-reporte/docente-reporte.module').then(m => m.DocenteReporteModule),
        canActivate: [authGuard, HasRoleGuard],
        data: { role: ['Docente', 'Administrador', 'Director', 'Secretaria'] },
    },
    {
        path: 'mi-admision-doc',
        loadChildren: () => import('./docente-mi-admision/docente-mi-admision.module').then(m => m.DocenteMiAdmisionModule),
        canActivate: [authGuard, HasRoleGuard],
        data: { role: ['Docente'] },
    },
    {
        path: 'crud',
        loadChildren: () => import('../estudiante/estudiante-admision/estudiante-admision.module').then(m => m.EstudianteAdmisionModule),
        canActivate: [authGuard, HasRoleGuard],
        data: { role: ['Administrador', 'Director', 'Secretaria'] },
    },
    {
        path: 'notfound',
        component: NotfoundComponent
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
export class DocenteRoutingModule { }
