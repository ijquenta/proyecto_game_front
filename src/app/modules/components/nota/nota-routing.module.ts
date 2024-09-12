import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotfoundComponent } from '../notfound/notfound.component';
import { authGuard } from 'src/app/guards/auth.guard';
import { HasRoleGuard } from 'src/app/guards/has-role.guard';

const routes: Routes = [
    {
        path: 'crud',
        loadChildren: () => import('./nota-crud/nota-crud.module').then(m => m.NotaCrudModule),
        canActivate: [authGuard, HasRoleGuard],
        data: { role: ['Administrador', 'Director', 'Secretaria'] },
    },
    {
        path: 'reporte',
        loadChildren: () => import('./nota-reporte/nota-reporte.module').then(m => m.NotaReporteModule),
        canActivate: [authGuard, HasRoleGuard],
        data: { role: ['Administrador'] },
    },
    {
        path: 'estudiante',
        loadChildren: () => import('./nota-estudiante/nota-estudiante.module').then(m => m.NotaEstudianteModule),
        canActivate: [authGuard, HasRoleGuard],
        data: { role: ['Estudiante'] },
    },
    {
        path: 'docente',
        loadChildren: () => import('./nota-docente/nota-docente.module').then(m => m.NotaDocenteModule),
        canActivate: [authGuard, HasRoleGuard],
        data: { role: ['Docente'] }
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
export class NotaRoutingModule { }
