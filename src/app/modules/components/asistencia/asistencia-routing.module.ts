import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'crud', loadChildren: () => import('./asistencia-crud/asistencia-crud.module').then(m => m.AsistenciaCrudModule) },
        { path: 'reporte', loadChildren: () => import('./asistencia-reporte/asistencia-reporte.module').then(m => m.AsistenciaReporteModule) },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class AsistenciaRoutingModule { }
