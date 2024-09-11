import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NotfoundComponent } from '../notfound/notfound.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'crud', loadChildren: () => import('./materia-crud/materia-crud.module').then(m => m.MateriaCrudModule) },
        { path: 'reporte', loadChildren: () => import('./materia-reporte/materia-reporte.module').then(m => m.MateriaReporteModule) },
        { path: 'estudiante', loadChildren: () => import('./materia-estudiante/materia-estudiante.module').then(m => m.MateriaEstudianteModule) },
        { path: 'docente', loadChildren: () => import('./materia-docente/materia-docente.module').then(m => m.MateriaDocenteModule) },
        { path: 'pensum', loadChildren: () => import('./materia-pensum/materia-pensum.module').then(m => m.MateriaPensumModule) },
        // { path: 'timeline', loadChildren: () => import('./timeline/timelinedemo.module').then(m => m.TimelineDemoModule) },
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
export class MateriaRoutingModule { }
