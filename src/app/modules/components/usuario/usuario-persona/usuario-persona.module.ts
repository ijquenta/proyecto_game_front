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
import { CheckboxModule } from 'primeng/checkbox';
import { PasswordModule } from 'primeng/password';


import { UsuarioPersonaRoutingModule } from './usuario-persona-routing.module';
import { UsuarioPersonaComponent } from './usuario-persona.component';

import { UsuarioService } from 'src/app/modules/service/data/usuario.service';
import { ReporteService } from 'src/app/modules/service/data/reporte.service';
import { CalendarModule } from 'primeng/calendar';

@NgModule({
    imports: [
        CommonModule,
        UsuarioPersonaRoutingModule,
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
        PasswordModule,
        CalendarModule
    ],
    declarations: [UsuarioPersonaComponent],
    providers: [UsuarioService]
})
export class UsuarioPersonaModule { }




