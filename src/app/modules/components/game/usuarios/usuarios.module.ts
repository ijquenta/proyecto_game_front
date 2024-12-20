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
import { UsuariosRoutingModule } from './usuarios-routing.module';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { UsuariosComponent } from './usuarios.component';
import { TooltipModule } from 'primeng/tooltip';
import { UsuarioService } from 'src/app/modules/service/data/usuario.service';
import { AccordionModule } from 'primeng/accordion';
import { TabViewModule } from 'primeng/tabview';
import { CheckboxModule } from 'primeng/checkbox';
import { ReactiveFormsModule } from '@angular/forms';
import { MultiSelectModule } from "primeng/multiselect";
import { SelectButtonModule } from 'primeng/selectbutton';
import { CalendarModule } from 'primeng/calendar';
@NgModule({
    imports: [
        CalendarModule,
        SelectButtonModule,
        MultiSelectModule,
        ReactiveFormsModule,
        CheckboxModule,
        TabViewModule,
        AccordionModule,
        TooltipModule,
        BreadcrumbModule,
        CommonModule,
        UsuariosRoutingModule,
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
        ProgressSpinnerModule
    ],
    declarations: [UsuariosComponent],
    providers: [
            UsuarioService,
        ]
})
export class UsuariosModule { }
