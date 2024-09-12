import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotfoundComponent } from '../notfound/notfound.component';
import { CursoHorarioComponent } from './curso-crud/curso-horario/curso-horario.component';
import { authGuard } from 'src/app/guards/auth.guard';
import { HasRoleGuard } from 'src/app/guards/has-role.guard';

const routes: Routes = [
    {
        path: 'crud',
        loadChildren: () => import('./curso-crud/curso-crud.module').then(m => m.CursoCrudModule),
        canActivate: [authGuard, HasRoleGuard],
        data: { role: ['Administrador', 'Director', 'Secretaria'] },
    },
    {
        path: 'reporte',
        loadChildren: () => import('./reporte/reporte.module').then(m => m.CursoReporteModule),
        canActivate: [authGuard, HasRoleGuard],
        data: { role: ['Administrador'] },
    },
    {
        path: 'estudiante',
        loadChildren: () => import('./curso-estudiante/curso-estudiante.module').then(m => m.CursoEstudianteModule),
        canActivate: [authGuard, HasRoleGuard],
        data: { role: ['Estudiante'] },
    },
    {
        path: 'curso-horario',
        component: CursoHorarioComponent,
        canActivate: [authGuard, HasRoleGuard],
        data: { role: ['Administrador', 'Director',  'Secretaria'] },
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
export class CursoRoutingModule { }
