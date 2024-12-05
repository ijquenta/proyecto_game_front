import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DoctoresComponent } from './doctores.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: DoctoresComponent }
    ])],
    exports: [RouterModule]
})
export class DoctoresRoutingModule { }
