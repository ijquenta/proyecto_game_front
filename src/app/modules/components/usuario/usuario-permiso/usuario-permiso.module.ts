import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { FileUploadModule } from 'primeng/fileupload';
import { RippleModule } from 'primeng/ripple';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { UsuarioPermisoRoutingModule } from './usuario-permiso-routing.module';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { UsuarioPermisoComponent } from './usuario-permiso.component';
import { UsuarioService } from 'src/app/modules/service/data/usuario.service';
import { ReporteService } from 'src/app/modules/service/data/reporte.service';
import { RolService } from 'src/app/modules/service/data/rol.service';
import { PermisoService } from 'src/app/modules/service/data/permiso.service';
import { CheckboxModule } from 'primeng/checkbox';
import { DataViewModule } from 'primeng/dataview';
import { TreeTableModule } from 'primeng/treetable';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { BadgeModule } from 'primeng/badge';
import { ReactiveFormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { OperacionService } from 'src/app/modules/service/data/operacion.service';
import { InputSwitchModule } from 'primeng/inputswitch';
import { EditorModule } from 'primeng/editor';
import { SelectButtonModule } from 'primeng/selectbutton';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { TooltipModule } from 'primeng/tooltip';
import { ChipModule } from 'primeng/chip';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
@NgModule({
    imports: [
        ConfirmDialogModule,
        ConfirmPopupModule,
        BreadcrumbModule,
        SelectButtonModule,
        EditorModule,
        InputSwitchModule,
        MultiSelectModule,
        ReactiveFormsModule,
        BadgeModule,
        AccordionModule,
        TreeTableModule,
        DataViewModule,
        CheckboxModule,
        CommonModule,
        UsuarioPermisoRoutingModule,
        TableModule,
        ButtonModule,
        TagModule,
        ToastModule,
        ToolbarModule,
        DialogModule,
        FormsModule,
        FileUploadModule,
        RippleModule,
        InputTextModule,
        InputTextareaModule,
        DropdownModule,
        RadioButtonModule,
        InputNumberModule,
        RatingModule,
        ProgressSpinnerModule,
        TooltipModule,
        ChipModule
    ],
    declarations: [UsuarioPermisoComponent],
    providers: [UsuarioService, RolService, PermisoService, OperacionService],
    schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class UsuarioPermisoModule { }
