import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InscripcionCrudRoutingModule } from './inscripcion-crud-routing.module';
import { InscripcionCrudComponent } from './inscripcion-crud.component';
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
import { CalendarModule } from 'primeng/calendar';
import { TagModule } from 'primeng/tag';
import { ChipModule } from 'primeng/chip';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { PanelModule } from 'primeng/panel';
import { TooltipModule } from 'primeng/tooltip';
import { CursoService } from 'src/app/modules/service/data/curso.service';
import { InscripcionService } from 'src/app/modules/service/data/inscripcion.service';
import { ReactiveFormsModule } from '@angular/forms'; // Importamos el module para validaciones
import { AvatarModule } from 'primeng/avatar';
import { MultiSelectModule } from 'primeng/multiselect';
@NgModule({
    imports: [
        MultiSelectModule,
        CommonModule,
        InscripcionCrudRoutingModule,
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
        CardModule,
        DividerModule,
        PanelModule,
        TooltipModule,
        ReactiveFormsModule,
        AvatarModule
    ],
    declarations: [InscripcionCrudComponent],
    providers: [UsuarioService, ReporteService, CursoService, InscripcionService]
})
export class InscripcionCrudModule { }
