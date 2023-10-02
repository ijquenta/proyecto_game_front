import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'crud', loadChildren: () => import('./usuario-crud/usuario-crud.module').then(m => m.UsuarioCrudModule) },
        { path: 'accesos', loadChildren: () => import('./empty/usuario-accesos.module').then(m => m.UsuarioAccesosModule) },
        // { path: 'reporte', loadChildren: () => import('./reporte/reporte.module').then(m => m.ReporteModule) },
        { path: 'reporte', loadChildren: () => import('./reporte/reporte.module').then(m => m.ReporteModule) },
        // { path: 'timeline', loadChildren: () => import('./timeline/timelinedemo.module').then(m => m.TimelineDemoModule) },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class UsuarioRoutingModule { }
