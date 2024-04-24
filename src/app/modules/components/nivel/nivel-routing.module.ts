import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotfoundComponent } from '../notfound/notfound.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'crud', loadChildren: () => import('./nivel-crud/nivel-crud.module').then(m => m.NivelCrudModule) },
        { path: 'reporte', loadChildren: () => import('./nivel-reporte/nivel-reporte.module').then(m => m.NivelReporteModule) },
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
export class NivelRoutingModule { }
