import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'crud', loadChildren: () => import('./nivel-crud/nivel-crud.module').then(m => m.NivelCrudModule) },
        { path: 'reporte', loadChildren: () => import('./nivel-reporte/nivel-reporte.module').then(m => m.NivelReporteModule) },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class NivelRoutingModule { }
