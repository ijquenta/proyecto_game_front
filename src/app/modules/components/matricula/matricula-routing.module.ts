import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NotfoundComponent } from '../notfound/notfound.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'asignar', loadChildren: () => import('./matricula-nuevo/matricula-nuevo.module').then(m => m.MatriculaNuevoModule) },
        { path: 'listar', loadChildren: () => import('./matricula-listar/matricula-listar.module').then(m => m.MatriculaListarModule) },
        { path: 'reporte', loadChildren: () => import('./matricula-reporte/matricula-reporte.module').then(m => m.MatriculaRerporteModule) },
        { path: 'estudiante', loadChildren: () => import('./matricula-estudiante/matricula-estudiante.module').then(m => m.MatriculaEstudianteModule) },
        // { path: 'reporteEstudiante', loadChildren: () => import('./inscripcion-reporte-estudiante/inscripcion-reporte-estudiante.module').then(m => m.InscripcionRerporteEstudianteModule) },
        // { path: 'reportes', loadChildren: () => import('./inscripcion-reportes/inscripcion-reportes.module').then(m => m.InscripcionRerportesModule) },
        // { path: 'reportes', loadChildren: () => import('./inscripcion-reporte/nota-reporte.module').then(m => m.NotaReporteModule) },
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
export class MatriculaRoutingModule { }
