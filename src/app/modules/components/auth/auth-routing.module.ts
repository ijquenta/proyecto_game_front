import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgotPassword/forgot-password.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { NoConfirmComponent } from './noConfirm/no-confirm.component';
import { VerifiedComponent } from './verified/verified.component';
import { ResetPasswordComponent } from './resetPassword/reset-password.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent,
        title: 'SGSA'
    },
    {
        path: 'register',
        component: RegisterComponent,
        title: 'SGSA'
    },
    {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
        title: 'SGSA'
    },
    {
        path: 'confirm',
        component: ConfirmComponent,
        title: 'SGSA'
    },
    {
        path: 'no-confirm',
        component: NoConfirmComponent,
        title: 'SGSA'
    },
    {
        path: 'verified',
        component: VerifiedComponent,
        title: 'SGSA'
    },
    {
        path:'reset-password/:token',
        component: ResetPasswordComponent,
        title: 'SGSA'
    }
    // {
    //   path: 'register',
    //   component: RegisterComponent,
    //   title: 'Register'
    // },
    // {
    //   path: 'recovery',
    //   component: RecoveryComponent,
    //   title: 'Recovery'
    // }
  ];




@NgModule({
    // imports: [RouterModule.forChild([
    //     { path: 'error', loadChildren: () => import('./error/error.module').then(m => m.ErrorModule) },
    //     { path: 'access', loadChildren: () => import('./access/access.module').then(m => m.AccessModule) },
    //     { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },
    //     { path: '**', redirectTo: '/notfound' }
    // ])],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule { }
