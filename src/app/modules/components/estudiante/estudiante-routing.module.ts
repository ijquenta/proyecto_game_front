import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotfoundComponent } from '../notfound/notfound.component';
import { authGuard } from 'src/app/guards/auth.guard';
import { HasRoleGuard } from 'src/app/guards/has-role.guard';

const routes: Routes = [
    {
        path: 'crud',
        loadChildren: () => import('./estudiante-crud/estudiante-crud.module').then(m => m.EstudianteCrudModule),
        canActivate: [authGuard, HasRoleGuard],
        data: { role: ['Administrador', 'Director', 'Secretaria'] },
    },
    {
        path: 'reporte',
        loadChildren: () => import('./estudiante-reporte/estudiante-reporte.module').then(m => m.EstudianteReporteModule),
        canActivate: [authGuard, HasRoleGuard],
        data: { role: ['Administrador', 'Director', 'Secretaria'] },
    },
    {
        path: 'admision',
        loadChildren: () => import('./estudiante-admision/estudiante-admision.module').then(m => m.EstudianteAdmisionModule),
        canActivate: [authGuard, HasRoleGuard],
        data: { role: ['Administrador', 'Director', 'Secretaria'] },
    },
    {
        path: 'admision/tipoProfesion',
        loadChildren: () => import('./estudiante-admision-tipoProfesion/estudiante-admision-tipoProfesion.module').then(m => m.EstudianteTipoProfesionModule),
        canActivate: [authGuard, HasRoleGuard],
        data: { role: ['Administrador', 'Director', 'Secretaria'] },
    },
    {
        path: 'admision/tipoEducacion',
        loadChildren: () => import('./estudiante-admision-tipoEducacion/estudiante-admision-tipoEducacion.module').then(m => m.EstudianteTipoEducacionModule),
        canActivate: [authGuard, HasRoleGuard],
        data: { role: ['Administrador', 'Director', 'Secretaria'] },
    },
    {
        path: 'admision/tipoCargo',
        loadChildren: () => import('./estudiante-admision-tipoCargo/estudiante-admision-tipoCargo.module').then(m => m.EstudianteTipoCargoModule),
        canActivate: [authGuard, HasRoleGuard],
        data: { role: ['Administrador', 'Director', 'Secretaria'] },
    },
    {
        path: 'mi-admision',
        loadChildren: () => import('./estudiante-mi-admision/estudiante-mi-admision.module').then(m => m.EstudianteMiAdmisionModule),
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
export class EstudianteRoutingModule { }
