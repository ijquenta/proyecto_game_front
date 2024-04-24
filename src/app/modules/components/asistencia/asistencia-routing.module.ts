import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotfoundComponent } from '../notfound/notfound.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'crud', loadChildren: () => import('./asistencia-crud/asistencia-crud.module').then(m => m.AsistenciaCrudModule) },
        { path: 'reporte', loadChildren: () => import('./asistencia-reporte/asistencia-reporte.module').then(m => m.AsistenciaReporteModule) },
        { path: 'estudiante', loadChildren: () => import('./asistencia-estudiante/asistencia-estudiante.module').then(m => m.AsistenciaEstudianteModule) },
        { path: 'docente', loadChildren: () => import('./asistencia-docente/asistencia-docente.module').then(m => m.AsistenciaDocenteModule) },
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
export class AsistenciaRoutingModule { }
