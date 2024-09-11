import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotfoundComponent } from '../notfound/notfound.component';
import { CursoHorarioComponent } from './curso-crud/curso-horario/curso-horario.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'crud', loadChildren: () => import('./curso-crud/curso-crud.module').then(m => m.CursoCrudModule) },
        { path: 'reporte', loadChildren: () => import('./reporte/reporte.module').then(m => m.CursoReporteModule) },
        { path: 'estudiante', loadChildren: () => import('./curso-estudiante/curso-estudiante.module').then(m => m.CursoEstudianteModule) },
        // { path: 'horario', loadChildren: () => import('./curso-crud/curso-horario/curso-horario.module').then(m => m.CursoHorarioModule)},
        { path: 'curso-horario', component: CursoHorarioComponent },
        // { path: '**', redirectTo: '/notfound' }
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
export class CursoRoutingModule { }
