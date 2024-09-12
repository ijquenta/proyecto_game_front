import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotfoundComponent } from '../notfound/notfound.component';
import { authGuard } from 'src/app/guards/auth.guard';
import { HasRoleGuard } from 'src/app/guards/has-role.guard';

const routes: Routes = [
    {
        path: 'crud',
        loadChildren: () => import('./material-crud/material-crud.module').then(m => m.MaterialCrudModule),
        canActivate: [authGuard, HasRoleGuard],
        data: { role: ['Administrador', 'Director', 'Secretaria'] },
    },
    {
        path: 'crud/tipo-texto',
        loadChildren: () => import('./material-crud/tipo-texto/tipo-texto.module').then(m => m.TipoTextoModule),
        canActivate: [authGuard, HasRoleGuard],
        data: { role: ['Administrador', 'Director', 'Secretaria'] },
    },
    {
        path: 'crud/tipo-categoria-texto',
        loadChildren: () => import('./material-crud/tipo-categoria-texto/tipo-categoria-texto.module').then(m => m.TipoCategoriaTextoModule),
        canActivate: [authGuard, HasRoleGuard],
        data: { role: ['Administrador', 'Director', 'Secretaria'] },
    },
    {
        path: 'reporte',
        loadChildren: () => import('./material-reporte/material-reporte.module').then(m => m.MaterialReporteModule),
        canActivate: [authGuard, HasRoleGuard],
        data: { role: ['Administrador', 'Director'] },
    },
    {
        path: 'asignar',
        loadChildren: () => import('./material-asignar/material-asignar.module').then(m => m.MaterialAsignarModule),
        canActivate: [authGuard, HasRoleGuard],
        data: { role: ['Administrador', 'Director', 'Secretaria'] },
    },
    {
        path: 'mi-material',
        loadChildren: () => import('./material-estudiante/material-estudiante.module').then(m => m.MaterialEstudianteModule),
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
export class MaterialRoutingModule { }
