import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { CardModule } from 'primeng/card';
import { ReactiveFormsModule } from '@angular/forms';
import { PersonaService } from 'src/app/modules/service/data/persona.service';
import { SplitterModule } from 'primeng/splitter';
import { SelectButtonModule } from 'primeng/selectbutton';
import { EstudianteAdmisionTipoProfesionRoutingModule } from './estudiante-admision-tipoProfesion-routing.module';
import { EstudianteAdmisionTipoProfesionComponent } from './estudiante-admision-tipoProfesion.component';
import { BreadcrumbModule } from 'primeng/breadcrumb';

@NgModule({
    imports: [
        BreadcrumbModule,
        SelectButtonModule,
        SplitterModule,
        CommonModule,
        TableModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        InputTextModule,
        InputTextareaModule,
        DialogModule,
        ConfirmDialogModule,
        ProgressSpinnerModule,
        TagModule,
        TooltipModule,
        CardModule,
        ReactiveFormsModule,
        EstudianteAdmisionTipoProfesionRoutingModule
    ],
    declarations: [EstudianteAdmisionTipoProfesionComponent],
    providers: [PersonaService]
})
export class EstudianteTipoProfesionModule { }
