import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'crud', loadChildren: () => import('./pago-crud/pago-crud.module').then(m => m.PagoCrudModule) },
        { path: 'reporte', loadChildren: () => import('./pago-reporte/pago-reporte.module').then(m => m.PagoReporteModule) },
        { path: 'notificacion', loadChildren: () => import('./pago-notificacion/pago-notificacion.module').then(m => m.PagoNotificacionModule) },
        // { path: 'timeline', loadChildren: () => import('./timeline/timelinedemo.module').then(m => m.TimelineDemoModule) },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class PagoRoutingModule { }
