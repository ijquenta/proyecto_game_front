import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForgotPasswordRoutingModule } from './forgot-password-routing.module';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { ReactiveFormsModule } from '@angular/forms';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
    imports: [
        DropdownModule,
        DividerModule,
        CommonModule,
        ForgotPasswordRoutingModule,
        ButtonModule,
        CheckboxModule,
        InputTextModule,
        FormsModule,
        PasswordModule,
        MessagesModule,
        ReactiveFormsModule
    ],
    declarations: [
    ]
})
export class ForgotPasswordModule { }
