import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotfoundComponent } from '../notfound/notfound.component';
import { authGuard } from 'src/app/guards/auth.guard';
import { HasRoleGuard } from 'src/app/guards/has-role.guard';

const routes: Routes = [
    {
        path: 'crud',
        loadChildren: () => import('./inscripcion-crud/inscripcion-crud.module').then(m => m.InscripcionCrudModule),
        canActivate: [authGuard, HasRoleGuard],
        data: { role: ['Administrador', 'Director', 'Secretaria'] },
    },
    {
        path: 'listar',
        loadChildren: () => import('./inscripcion-listar/inscripcion-listar.module').then(m => m.InscripcionListarModule),
        canActivate: [authGuard, HasRoleGuard],
        data: { role: ['Administrador', 'Director', 'Secretaria'] },
    },
    {
        path: 'verificar',
        loadChildren: () => import('./inscripcion-verificar/inscripcion-verificar.module').then(m => m.InscripcionVerificarModule),
        canActivate: [authGuard, HasRoleGuard],
        data: { role: ['Administrador', 'Director', 'Secretaria'] },
    },
    {
        path: 'reporteEstudiante',
        loadChildren: () => import('./inscripcion-reporte-estudiante/inscripcion-reporte-estudiante.module').then(m => m.InscripcionRerporteEstudianteModule),
        canActivate: [authGuard, HasRoleGuard],
        data: { role: ['Administrador', 'Director', 'Secretaria'] },
    },
    {
        path: 'reportes',
        loadChildren: () => import('./inscripcion-reportes/inscripcion-reportes.module').then(m => m.InscripcionRerportesModule),
        canActivate: [authGuard, HasRoleGuard],
        data: { role: ['Administrador'] },
    },
    {
        path: 'estudiante',
        loadChildren: () => import('./inscripcion-estudiante/inscripcion-estudiante.module').then(m => m.InscripcionEstudianteModule),
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
export class InscripcionRoutingModule { }
