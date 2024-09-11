import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// import { MateriaCrudRoutingModule } from '../materia-crud/materia-crud-routing.module';
import { NotaDocenteRoutingModule } from './nota-docente-routing.module';
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
import { NotaDocenteComponent } from './nota-docente.component';
import { TooltipModule } from 'primeng/tooltip';
import { KnobModule } from 'primeng/knob';
import { AccordionModule } from 'primeng/accordion';
import { AvatarModule } from 'primeng/avatar';
import { TabViewModule } from 'primeng/tabview';
import { CardModule } from 'primeng/card';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ReactiveFormsModule } from '@angular/forms';
import { SidebarModule } from 'primeng/sidebar';
@NgModule({
    imports: [
        TabViewModule,
        CardModule,
        BreadcrumbModule,
        ReactiveFormsModule,
        SidebarModule,
        AvatarModule,
        AccordionModule,
        CommonModule,
        // MateriaCrudRoutingModule,
        NotaDocenteRoutingModule,
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
        CalendarModule,
        TooltipModule,
        KnobModule

    ],
    declarations: [NotaDocenteComponent],
    providers: [UsuarioService, ReporteService, MateriaService]
})
export class NotaDocenteModule { }
