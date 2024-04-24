import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NotfoundComponent } from '../notfound/notfound.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'crud', loadChildren: () => import('./docente-crud/docente-crud.module').then(m => m.DocenteCrudModule) },
        { path: 'reporte', loadChildren: () => import('./docente-reporte/docente-reporte.module').then(m => m.DocenteReporteModule) },
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
export class DocenteRoutingModule { }
