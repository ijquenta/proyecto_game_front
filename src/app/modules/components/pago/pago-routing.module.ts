import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NotfoundComponent } from '../notfound/notfound.component';
import { EstudianteMateriaComponent } from './pago-crud/estudiante-materia/estudiante-materia.component';
import { FormPagoComponent } from './pago-crud/estudiante-materia/form-pago/form-pago.component';
import { authGuard } from 'src/app/guards/auth.guard';
import { HasRoleGuard } from 'src/app/guards/has-role.guard';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: 'todos',
            canActivate: [authGuard, HasRoleGuard],
            data: { role: ['Administrador', 'Director', 'Secretaria'] },
            loadChildren: () => import('./pago-crud/pago-crud.module').then(m => m.PagoCrudModule)
        },
        {
            path: 'reporte',
            canActivate: [authGuard, HasRoleGuard],
            data: { role: 'Administrador' },
            loadChildren: () => import('./pago-reporte/pago-reporte.module').then(m => m.PagoReporteModule)
        },
        {
            path: 'notificacion',
            canActivate: [authGuard, HasRoleGuard],
            data: { role: ['Administrador', 'Secretaria'] },
            loadChildren: () => import('./pago-notificacion/pago-notificacion.module').then(m => m.PagoNotificacionModule)
        },
        {
            path: 'estudiante',
            canActivate: [authGuard, HasRoleGuard],
            data: { role: ['Estudiante'] },
            loadChildren: () => import('./pago-estudiante/pago-estudiante.module').then(m => m.PagoEstudianteModule)
        },
        {
            path: 'estudiante-matricula',
            canActivate: [authGuard, HasRoleGuard],
            data: { role: ['Estudiante'] },
            loadChildren: () => import('./pago-estudiante-matricula/pago-estudiante-matricula.module').then(m => m.PagoEstudianteMatriculaModule)
        },
        {
            path: 'estudiante-materia',
            canActivate: [authGuard, HasRoleGuard],
            data: { role: ['Administrador', 'Director', 'Secretaria'] },
            component: EstudianteMateriaComponent
        },
        {
            path: 'estudiante-materia/form',
            canActivate: [authGuard, HasRoleGuard],
            data: { role: ['Administrador', 'Director', 'Secretaria'] },
            component: FormPagoComponent
        },
        {
            path: 'form',
            canActivate: [authGuard, HasRoleGuard],
            data: { role: ['Administrador', 'Director', 'Secretaria'] },
            component: FormPagoComponent
        },
        { path: 'notfound', component: NotfoundComponent },
        { path: '**', redirectTo: 'notfound' }
    ])],
    exports: [RouterModule]
})
export class PagoRoutingModule { }
