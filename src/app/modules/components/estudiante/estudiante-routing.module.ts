import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NotfoundComponent } from '../notfound/notfound.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'crud', loadChildren: () => import('./estudiante-crud/estudiante-crud.module').then(m => m.EstudianteCrudModule) },
        { path: 'reporte', loadChildren: () => import('./estudiante-reporte/estudiante-reporte.module').then(m => m.EstudianteReporteModule) },
        { path: 'admision', loadChildren: () => import('./estudiante-admision/estudiante-admision.module').then(m => m.EstudianteAdmisionModule) },
        { path: 'admision/tipoProfesion', loadChildren: () => import('./estudiante-admision-tipoProfesion/estudiante-admision-tipoProfesion.module').then(m => m.EstudianteTipoProfesionModule)},
        { path: 'admision/tipoEducacion', loadChildren: () => import('./estudiante-admision-tipoEducacion/estudiante-admision-tipoEducacion.module').then(m => m.EstudianteTipoEducacionModule)},
        { path: 'admision/tipoCargo', loadChildren: () => import('./estudiante-admision-tipoCargo/estudiante-admision-tipoCargo.module').then(m => m.EstudianteTipoCargoModule)},
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
export class EstudianteRoutingModule { }
