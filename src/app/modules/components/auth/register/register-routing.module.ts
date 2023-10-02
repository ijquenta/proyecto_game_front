import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
// import { LoginComponent } from './login.component';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { AppLayoutComponent } from 'src/app/modules/layout/app.layout.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'principal', component: AppLayoutComponent }
    ])],
    exports: [RouterModule]
})
export class RegisterRoutingModule { }
