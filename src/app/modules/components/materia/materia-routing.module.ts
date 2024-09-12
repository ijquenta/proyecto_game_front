import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotfoundComponent } from '../notfound/notfound.component';
import { authGuard } from 'src/app/guards/auth.guard';
import { HasRoleGuard } from 'src/app/guards/has-role.guard';

const routes: Routes = [
    {
        path: 'crud',
        loadChildren: () => import('./materia-crud/materia-crud.module').then(m => m.MateriaCrudModule),
        canActivate: [authGuard, HasRoleGuard],
        data: { role: ['Administrador', 'Director', 'Secretaria'] },
    },
    {
        path: 'reporte',
        loadChildren: () => import('./materia-reporte/materia-reporte.module').then(m => m.MateriaReporteModule),
        canActivate: [authGuard, HasRoleGuard],
        data: { role: ['Administrador'] },
    },
    {
        path: 'estudiante',
        loadChildren: () => import('./materia-estudiante/materia-estudiante.module').then(m => m.MateriaEstudianteModule),
        canActivate: [authGuard, HasRoleGuard],
        data: { role: ['Estudiante'] },
    },
    {
        path: 'docente',
        loadChildren: () => import('./materia-docente/materia-docente.module').then(m => m.MateriaDocenteModule),
        canActivate: [authGuard, HasRoleGuard],
        data: { role: ['Docente'] },
    },
    {
        path: 'pensum',
        loadChildren: () => import('./materia-pensum/materia-pensum.module').then(m => m.MateriaPensumModule),
        canActivate: [authGuard, HasRoleGuard],
        data: { role: ['Estudiante', 'Docente'] },
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
export class MateriaRoutingModule { }
