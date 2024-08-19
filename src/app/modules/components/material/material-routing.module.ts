import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NotfoundComponent } from '../notfound/notfound.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'crud', loadChildren: () => import('./material-crud/material-crud.module').then(m => m.MaterialCrudModule) },
        { path: 'crud/tipo-texto', loadChildren: () => import('./material-crud/tipo-texto/tipo-texto.module').then(m => m.TipoTextoModule)},
        { path: 'crud/tipo-categoria-texto', loadChildren: () => import('./material-crud/tipo-categoria-texto/tipo-categoria-texto.module').then(m => m.TipoCategoriaTextoModule)},
        { path: 'reporte', loadChildren: () => import('./material-reporte/material-reporte.module').then(m => m.MaterialReporteModule) },
        { path: 'asignar', loadChildren: () => import('./material-asignar/material-asignar.module').then(m => m.MaterialAsignarModule) },
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
export class MaterialRoutingModule { }
