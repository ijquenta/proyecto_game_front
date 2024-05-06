import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmRoutingModule } from './confirm-routing.module';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { ReactiveFormsModule } from '@angular/forms';
import { DividerModule } from 'primeng/divider';

@NgModule({
    imports: [
        DividerModule,
        CommonModule,
        ConfirmRoutingModule,
        ButtonModule,
        CheckboxModule,
        InputTextModule,
        FormsModule,
        PasswordModule,
        MessagesModule,
        ReactiveFormsModule
    ],
    declarations: []
})
export class ConfirmModule { }
