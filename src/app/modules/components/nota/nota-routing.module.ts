import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NotfoundComponent } from '../notfound/notfound.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'crud', loadChildren: () => import('./nota-crud/nota-crud.module').then(m => m.NotaCrudModule) },
        { path: 'reporte', loadChildren: () => import('./nota-reporte/nota-reporte.module').then(m => m.NotaReporteModule) },
        { path: 'estudiante', loadChildren: () => import('./nota-estudiante/nota-estudiante.module').then(m => m.NotaEstudianteModule) },
        { path: 'docente', loadChildren: () => import('./nota-docente/nota-docente.module').then(m => m.NotaDocenteModule) },
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
export class NotaRoutingModule { }
