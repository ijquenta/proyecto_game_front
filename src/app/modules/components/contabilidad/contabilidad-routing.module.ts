import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NotfoundComponent } from '../notfound/notfound.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'gestionar', loadChildren: () => import('./contabilidad-gestionar/contabilidad-gestionar.module').then(m => m.ContabilidadGestionarModule) },
        // { path: 'reporte', loadChildren: () => import('./pago-reporte/pago-reporte.module').then(m => m.PagoReporteModule) },
        // { path: 'notificacion', loadChildren: () => import('./pago-notificacion/pago-notificacion.module').then(m => m.PagoNotificacionModule) },
        // { path: 'estudiante', loadChildren: () => import('./pago-estudiante/pago-estudiante.module').then(m => m.PagoEstudianteModule) },
        // { path: 'timeline', loadChildren: () => import('./timeline/timelinedemo.module').then(m => m.TimelineDemoModule) },
        // { path: '**', redirectTo: '/notfound' }
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
export class ContabilidadRoutingModule { }
