import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NivelCrudRoutingModule } from './nivel-crud-routing.module';
import { NivelCrudComponent } from './nivel-crud.component';
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
import { CursoService } from 'src/app/modules/service/data/curso.service';
import { NivelService } from 'src/app/modules/service/data/nivel.service';
import { TagModule } from 'primeng/tag';
import { ChipModule } from 'primeng/chip';
import { CalendarModule } from 'primeng/calendar';
import { ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
@NgModule({
    imports: [
        CommonModule,
        NivelCrudRoutingModule,
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
        ChipModule,
        ReactiveFormsModule,
        TooltipModule
    ],
    declarations: [NivelCrudComponent],
    providers: [UsuarioService, ReporteService, CursoService, NivelService]
})
export class NivelCrudModule { }
