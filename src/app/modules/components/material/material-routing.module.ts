import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'crud', loadChildren: () => import('./material-crud/material-crud.module').then(m => m.MaterialCrudModule) },
        { path: 'reporte', loadChildren: () => import('./material-reporte/material-reporte.module').then(m => m.MaterialReporteModule) },
        // { path: 'timeline', loadChildren: () => import('./timeline/timelinedemo.module').then(m => m.TimelineDemoModule) },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class MaterialRoutingModule { }
