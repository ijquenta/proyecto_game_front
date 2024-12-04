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
import { PasswordModule } from 'primeng/password';
import { CalendarModule } from 'primeng/calendar';
import { AutoCompleteModule } from "primeng/autocomplete";
import { ChipsModule } from "primeng/chips";
import { InputMaskModule } from "primeng/inputmask";
import { CascadeSelectModule } from "primeng/cascadeselect";
import { MultiSelectModule } from "primeng/multiselect";
import { AvatarModule } from 'primeng/avatar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TooltipModule } from 'primeng/tooltip';
import { SkeletonModule } from 'primeng/skeleton';
import { ChipModule } from 'primeng/chip';
import { ReactiveFormsModule } from '@angular/forms';
import { UsuarioService } from 'src/app/modules/service/data/usuario.service';
import { PersonaService } from 'src/app/modules/service/data/persona.service';
import { UsuarioPersonaRoutingModule } from './usuario-persona-routing.module';
import { UsuarioPersonaComponent } from './usuario-persona.component';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CardModule } from 'primeng/card';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ImageModule } from 'primeng/image';
import { SidebarModule } from 'primeng/sidebar';
import { DividerModule } from 'primeng/divider';
import { SpeedDialModule } from 'primeng/speeddial';
@NgModule({
    imports: [
        SpeedDialModule,
        DividerModule,
        SidebarModule,
        ImageModule,
        SelectButtonModule,
        CardModule,
        BreadcrumbModule,
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
        CalendarModule,
        CommonModule,
		FormsModule,
		AutoCompleteModule,
		ChipsModule,
		InputMaskModule,
		CascadeSelectModule,
		MultiSelectModule,
        AvatarModule,
        ProgressSpinnerModule,
        TooltipModule,
        SkeletonModule,
        ChipModule,
        ReactiveFormsModule
    ],
    declarations: [UsuarioPersonaComponent],
    providers: [UsuarioService, PersonaService]
})
export class UsuarioPersonaModule { }




