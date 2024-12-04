import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgotPassword/forgot-password.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { NoConfirmComponent } from './noConfirm/no-confirm.component';
import { VerifiedComponent } from './verified/verified.component';
import { ResetPasswordComponent } from './resetPassword/reset-password.component';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { ExpiredComponent } from './expired/expired.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent,
        title: 'Yoela'
    },
    {
        path: 'register',
        component: RegisterComponent,
        title: 'Yoela'
    },
    {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
        title: 'Yoela'
    },
    {
        path: 'confirm',
        component: ConfirmComponent,
        title: 'Yoela'
    },
    {
        path: 'no-confirm',
        component: NoConfirmComponent,
        title: 'Yoela'
    },
    {
        path: 'verified',
        component: VerifiedComponent,
        title: 'Yoela'
    },
    {
        path: 'access-denied',
        component: AccessDeniedComponent,
    },
    {
        path: 'expired',
        component: ExpiredComponent
    },
    {
        path:'reset-password/:token',
        component: ResetPasswordComponent,
        title: 'Yoela'
    }
  ];




@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule { }
