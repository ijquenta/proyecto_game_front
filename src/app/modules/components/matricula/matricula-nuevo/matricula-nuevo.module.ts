import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatriculaNuevoRoutingModule } from './matricula-nuevo-routing.module';
import { MatriculaNuevoComponent } from './matricula-nuevo.component';
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
import { MatriculaService } from 'src/app/modules/service/data/matricula.service';
import { CalendarModule } from 'primeng/calendar';
import { TagModule } from 'primeng/tag';
import { ChipModule } from 'primeng/chip';
import { TooltipModule } from 'primeng/tooltip';
import { ReactiveFormsModule } from '@angular/forms';
import { DataViewModule } from 'primeng/dataview';
import { AvatarModule } from 'primeng/avatar';
import { CardModule } from 'primeng/card';
import { UploadService } from 'src/app/modules/service/data/upload.service';
import { DividerModule } from 'primeng/divider';
import { PanelModule } from 'primeng/panel';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ImageModule } from 'primeng/image';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { SelectButtonModule } from 'primeng/selectbutton';
import { MultiSelectModule } from "primeng/multiselect";
import { SidebarModule } from 'primeng/sidebar';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { ProgressBarModule } from 'primeng/progressbar';
@NgModule({
    imports: [
        PdfViewerModule,
        NgxExtendedPdfViewerModule,
        ProgressBarModule,
        DividerModule,
        PanelModule,
        BreadcrumbModule,
        ImageModule,
        OverlayPanelModule,
        SelectButtonModule,
        MultiSelectModule,
        SidebarModule,
        CardModule,
        AvatarModule,
        DataViewModule,
        ReactiveFormsModule,
        TooltipModule,
        CommonModule,
        MatriculaNuevoRoutingModule,
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
        CalendarModule,
        TagModule,
        ChipModule
    ],
    declarations: [MatriculaNuevoComponent],
    providers: [UsuarioService, ReporteService, MatriculaService, UploadService]
})
export class MatriculaNuevoModule { }
