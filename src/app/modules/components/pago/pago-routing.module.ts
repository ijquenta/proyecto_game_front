
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NotfoundComponent } from '../notfound/notfound.component';
import { EstudianteMateriaComponent } from './pago-crud/estudiante-materia/estudiante-materia.component';
import { FormPagoComponent } from './pago-crud/estudiante-materia/form-pago/form-pago.component';
@NgModule({
    imports: [RouterModule.forChild([
        { path: 'todos', loadChildren: () => import('./pago-crud/pago-crud.module').then(m => m.PagoCrudModule) },
        { path: 'reporte', loadChildren: () => import('./pago-reporte/pago-reporte.module').then(m => m.PagoReporteModule) },
        { path: 'notificacion', loadChildren: () => import('./pago-notificacion/pago-notificacion.module').then(m => m.PagoNotificacionModule) },
        { path: 'estudiante', loadChildren: () => import('./pago-estudiante/pago-estudiante.module').then(m => m.PagoEstudianteModule) },
        // { path: 'todos/estudiante-materia', component: EstudianteMateriaComponent },
        { path: 'estudiante-materia', component: EstudianteMateriaComponent },

        { path: 'estudiante-materia/form', component: FormPagoComponent },

        { path: 'form', component: FormPagoComponent },
        // { path: 'form/:id', component: FormPagoComponent },

        { path: 'notfound', component: NotfoundComponent },
        { path: '**', redirectTo: 'notfound' }
    ])],
    exports: [RouterModule]
})
export class PagoRoutingModule { }
