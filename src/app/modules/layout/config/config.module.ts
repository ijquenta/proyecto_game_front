import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarModule } from 'primeng/sidebar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import { InputSwitchModule } from 'primeng/inputswitch';
import { AppConfigComponent } from './app.config.component';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SidebarModule,
        RadioButtonModule,
        ButtonModule,
        InputSwitchModule,
        AvatarModule,
        TagModule,
        ConfirmPopupModule,
        ToastModule,
        TooltipModule,
        ConfirmDialogModule
    ],
    declarations: [
        AppConfigComponent
    ],
    exports: [
        AppConfigComponent
    ]
})
export class AppConfigModule { }
