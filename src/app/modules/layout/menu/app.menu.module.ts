import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { UsuarioRoutingModule } from './usuario-routing.module';
// import { ReporteRoutingModule } from './reporte/reporte-routing.module';
// import { EmptyDemoComponent } from '../estudiante/empty/emptydemo.component';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { PanelMenuModule } from 'primeng/panelmenu';
@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        ScrollPanelModule,
        PanelMenuModule
        // UsuarioRoutingModule,
        // ReporteRoutingModule,
        // EmptyDemoComponent
    ],
})
export class MenuModule {}
