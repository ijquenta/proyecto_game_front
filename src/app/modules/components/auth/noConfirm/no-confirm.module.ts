import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoConfirmRoutingModule } from './no-confirm-routing.module';
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
        NoConfirmRoutingModule,
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
export class NoConfirmModule { }
