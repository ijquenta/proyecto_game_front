import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotfoundComponent } from '../notfound/notfound.component';
import { authGuard } from 'src/app/guards/auth.guard';
import { HasRoleGuard } from 'src/app/guards/has-role.guard';

const routes: Routes = [
    {
        path: 'asignar',
        loadChildren: () => import('./matricula-nuevo/matricula-nuevo.module').then(m => m.MatriculaNuevoModule),
        canActivate: [authGuard, HasRoleGuard],
        data: { role: ['Administrador', 'Director', 'Secretaria'] },
    },
    {
        path: 'listar',
        loadChildren: () => import('./matricula-listar/matricula-listar.module').then(m => m.MatriculaListarModule),
        canActivate: [authGuard, HasRoleGuard],
        data: { role: ['Administrador', 'Director', 'Secretaria'] },
    },
    {
        path: 'reporte',
        loadChildren: () => import('./matricula-reporte/matricula-reporte.module').then(m => m.MatriculaRerporteModule),
        canActivate: [authGuard, HasRoleGuard],
        data: { role: ['Administrador', 'Director'] },
    },
    {
        path: 'estudiante',
        loadChildren: () => import('./matricula-estudiante/matricula-estudiante.module').then(m => m.MatriculaEstudianteModule),
        canActivate: [authGuard, HasRoleGuard],
        data: { role: ['Estudiante'] },
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
export class MatriculaRoutingModule { }
