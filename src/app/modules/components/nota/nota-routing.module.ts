import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'crud', loadChildren: () => import('./nota-crud/nota-crud.module').then(m => m.NotaCrudModule) },
        { path: 'reporte', loadChildren: () => import('./nota-reporte/nota-reporte.module').then(m => m.NotaReporteModule) },
        // { path: 'timeline', loadChildren: () => import('./timeline/timelinedemo.module').then(m => m.TimelineDemoModule) },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class NotaRoutingModule { }
