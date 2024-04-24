import { NotfoundComponent } from './notfound.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { LoginRoutingModule } from './login-routing.module';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { ReactiveFormsModule } from '@angular/forms'; // Importamos el module para validaciones
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        CommonModule,
        // LoginRoutingModule,
        ButtonModule,
        CheckboxModule,
        InputTextModule,
        FormsModule,
        PasswordModule,
        MessagesModule,
        ReactiveFormsModule,
        RouterModule
    ],
    declarations: [
        // LoginComponent
        NotfoundComponent
    ]
})
export class NotFoundModule { }
