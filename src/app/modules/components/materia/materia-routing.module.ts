import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'crud', loadChildren: () => import('./materia-crud/materia-crud.module').then(m => m.MateriaCrudModule) },
        { path: 'reporte', loadChildren: () => import('./materia-reporte/materia-reporte.module').then(m => m.MateriaReporteModule) },
        // { path: 'timeline', loadChildren: () => import('./timeline/timelinedemo.module').then(m => m.TimelineDemoModule) },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class MateriaRoutingModule { }
