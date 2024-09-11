import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialEstudianteRoutingModule } from './material-estudiante-routing.module';
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
import { MaterialEstudianteComponent } from './material-estudiante.component';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';
import { FullCalendarModule } from '@fullcalendar/angular';
import { HorarioService } from 'src/app/modules/service/data/horario.service';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { TimelineModule } from 'primeng/timeline';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { TabMenuModule } from 'primeng/tabmenu';
import { TabViewModule } from 'primeng/tabview';
import { ImageModule } from 'primeng/image';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
@NgModule({
    imports: [
        NgxExtendedPdfViewerModule,
        ImageModule,
        TabViewModule,
        TabMenuModule,
        TimelineModule,
        OrganizationChartModule,
        AvatarModule,
        TooltipModule,
        CardModule,
        CommonModule,
        FullCalendarModule,
        MaterialEstudianteRoutingModule,
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
        BreadcrumbModule
    ],
    declarations: [MaterialEstudianteComponent],
    providers: [UsuarioService, ReporteService, MateriaService, HorarioService]
})
export class MaterialEstudianteModule { }
