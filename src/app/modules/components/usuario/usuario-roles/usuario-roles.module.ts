import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { RippleModule } from 'primeng/ripple';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { UsuarioRolesRoutingModule } from './usuario-roles-routing.module';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ChipModule } from 'primeng/chip';
import { ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { UsuarioRolesComponent } from './usuario-roles.component';
import { UsuarioService } from 'src/app/modules/service/data/usuario.service';
import { RolService } from 'src/app/modules/service/data/rol.service';
import { BreadcrumbModule } from 'primeng/breadcrumb';
@NgModule({
    imports: [
        BreadcrumbModule,
        CommonModule,
        UsuarioRolesRoutingModule,
        TableModule,
        ButtonModule,
        TagModule,
        ToastModule,
        ToolbarModule,
        DialogModule,
        FormsModule,
        RippleModule,
        InputTextModule,
        InputTextareaModule,
        DropdownModule,
        RadioButtonModule,
        InputNumberModule,
        RatingModule,
        ProgressSpinnerModule,
        ChipModule,
        ReactiveFormsModule,
        CardModule,
        TooltipModule
    ],
    declarations: [UsuarioRolesComponent],
    providers: [UsuarioService, RolService]
})
export class UsuarioRolesModule { }
