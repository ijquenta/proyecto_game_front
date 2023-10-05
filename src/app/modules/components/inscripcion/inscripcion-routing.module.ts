import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'nuevo', loadChildren: () => import('./inscripcion-nuevo/inscripcion-nuevo.module').then(m => m.InscripcionNuevoModule) },
        { path: 'listar', loadChildren: () => import('./inscripcion-listar/inscripcion-listar.module').then(m => m.InscripcionListarModule) },
        { path: 'verificar', loadChildren: () => import('./inscripcion-verificar/inscripcion-verificar.module').then(m => m.InscripcionVerificarModule) },
        { path: 'reporteEstudiante', loadChildren: () => import('./inscripcion-reporte-estudiante/inscripcion-reporte-estudiante.module').then(m => m.InscripcionRerporteEstudianteModule) },
        { path: 'reportes', loadChildren: () => import('./inscripcion-reportes/inscripcion-reportes.module').then(m => m.InscripcionRerportesModule) },
        // { path: 'reportes', loadChildren: () => import('./inscripcion-reporte/nota-reporte.module').then(m => m.NotaReporteModule) },
        // { path: 'timeline', loadChildren: () => import('./timeline/timelinedemo.module').then(m => m.TimelineDemoModule) },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class InscripcionRoutingModule { }
