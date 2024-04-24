import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotfoundComponent } from '../notfound/notfound.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'crud', loadChildren: () => import('./curso-crud/curso-crud.module').then(m => m.CursoCrudModule) },
        { path: 'reporte', loadChildren: () => import('./reporte/reporte.module').then(m => m.CursoReporteModule) },
        { path: 'estudiante', loadChildren: () => import('./curso-estudiante/curso-estudiante.module').then(m => m.CursoEstudianteModule) },
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
export class CursoRoutingModule { }
