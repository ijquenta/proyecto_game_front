import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResetPasswordRoutingModule } from './reset-password-routing.module';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ImageModule } from 'primeng/image';

@NgModule({
    imports: [
        ImageModule,
        CardModule,
        CommonModule,
        ResetPasswordRoutingModule,
        ButtonModule,
        CheckboxModule,
        InputTextModule,
        FormsModule,
        PasswordModule,
        MessagesModule,
        ReactiveFormsModule
    ],
    declarations: [
        // LoginComponent
    ]
})
export class ResetPasswordComponentModule { }
