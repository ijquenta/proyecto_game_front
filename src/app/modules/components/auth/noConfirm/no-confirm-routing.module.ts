import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PrincipalComponent } from '../../principal/principal.component';
import { AppLayoutComponent } from 'src/app/modules/layout/app.layout.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'principal', component: AppLayoutComponent }
    ])],
    exports: [RouterModule]
})
export class NoConfirmRoutingModule { }
