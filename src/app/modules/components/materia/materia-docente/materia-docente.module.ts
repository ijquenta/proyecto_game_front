import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MateriaDocenteRoutingModule } from './materia-docente-routing.module';
import { TableModule } from 'primeng/table';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { UsuarioService } from '../../../service/data/usuario.service';
import { ReporteService } from 'src/app/modules/service/data/reporte.service';
import { MateriaService } from 'src/app/modules/service/data/materia.service';
import { TagModule } from 'primeng/tag';
import { ChipModule } from 'primeng/chip';
import { CalendarModule } from 'primeng/calendar';
import { MateriaDocenteComponent } from './materia-docente.component';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MultiSelectModule } from "primeng/multiselect";
import { SidebarModule } from 'primeng/sidebar';
@NgModule({
    imports: [
        BreadcrumbModule,
        MultiSelectModule,
        SidebarModule,
        TooltipModule,
        CommonModule,
        CardModule,
        AvatarModule,
        // MateriaCrudRoutingModule,
        MateriaDocenteRoutingModule,
        TableModule,
        FileUploadModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        RatingModule,
        InputTextModule,
        InputTextareaModule,
        DropdownModule,
        RadioButtonModule,
        InputNumberModule,
        DialogModule,
        TagModule,
        ChipModule,
        CalendarModule
    ],
    declarations: [MateriaDocenteComponent],
    providers: [UsuarioService, ReporteService, MateriaService]
})
export class MateriaDocenteModule { }
