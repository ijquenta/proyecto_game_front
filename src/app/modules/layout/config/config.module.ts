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
import { DialogModule } from 'primeng/dialog';
import { ImageModule } from 'primeng/image';
import { CardModule } from 'primeng/card';
import { ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';


import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { FileUploadModule } from 'primeng/fileupload';
import { RippleModule } from 'primeng/ripple';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { PasswordModule } from 'primeng/password';
import { CalendarModule } from 'primeng/calendar';
import { AutoCompleteModule } from "primeng/autocomplete";
import { ChipsModule } from "primeng/chips";
import { InputMaskModule } from "primeng/inputmask";
import { CascadeSelectModule } from "primeng/cascadeselect";
import { MultiSelectModule } from "primeng/multiselect";
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SkeletonModule } from 'primeng/skeleton';
import { ChipModule } from 'primeng/chip';
import { UploadService } from 'src/app/modules/service/data/upload.service';
import { UsuarioService } from 'src/app/modules/service/data/usuario.service';
import { ReporteService } from 'src/app/modules/service/data/reporte.service';
import { PersonaService } from 'src/app/modules/service/data/persona.service';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DividerModule } from 'primeng/divider';
@NgModule({
    imports: [
        TableModule,
        ToolbarModule,
        FileUploadModule,
        RippleModule,
        RatingModule,
        InputTextModule,
        InputTextareaModule,
        InputNumberModule,
        PasswordModule,
        CalendarModule,
        AutoCompleteModule,
        ChipsModule,
        InputMaskModule,
        CascadeSelectModule,
        MultiSelectModule,
        ProgressSpinnerModule,
        SkeletonModule,
        ChipModule,
        BreadcrumbModule,
        SelectButtonModule,
        DividerModule,
        DropdownModule,
        ReactiveFormsModule,
        CardModule,
        ImageModule,
        DialogModule,
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
