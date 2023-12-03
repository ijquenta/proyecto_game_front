import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// import { MateriaCrudRoutingModule } from '../materia-crud/materia-crud-routing.module';
import { AsistenciaDocenteRoutingModule } from './asistencia-docente-routing.module';
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
// import { CursoEstudianteComponent } from './curso-estudiante.component';
import { AsistenciaDocenteComponent } from './asistencia-docente.component';

@NgModule({
    imports: [
        CommonModule,
        // MateriaCrudRoutingModule,
        // MateriaEstudianteRoutingModule,
        // CursoEstudianteRoutingModule,
        AsistenciaDocenteRoutingModule,
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
    declarations: [AsistenciaDocenteComponent],
    providers: [UsuarioService, ReporteService, MateriaService]
})
export class AsistenciaDocenteModule { }
