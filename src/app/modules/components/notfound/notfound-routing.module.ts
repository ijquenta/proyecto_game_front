import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
// import { LoginComponent } from './login.component';
// import { NotFoundComponent } from '../notfound/notfound.component';
import { AppLayoutComponent } from 'src/app/modules/layout/app.layout.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'notfound', component: AppLayoutComponent }
    ])],
    exports: [RouterModule]
})
export class NotFoundRoutingModule { }
