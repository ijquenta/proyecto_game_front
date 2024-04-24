import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PanelComponent } from './panel.component';
import { ChartModule } from 'primeng/chart';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { PanelMenuModule } from 'primeng/panelmenu';
import { PanelRoutingModule } from './panel-routing.module';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PanelVideoComponent } from './panel-video/panel-video.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ChartModule,
        MenuModule,
        TableModule,
        StyleClassModule,
        PanelMenuModule,
        ButtonModule,
        PanelRoutingModule,
        ProgressSpinnerModule
    ],
    declarations: [PanelComponent, PanelVideoComponent]
})
export class PanelModule { }