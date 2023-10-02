import { NgModule } from '@angular/core';
// import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './modules/layout/app.layout.module';
import { NotfoundComponent } from './modules/components/notfound/notfound.component';
import { ProductService } from './modules/service/examples/product.service';
import { CountryService } from './modules/service/examples/country.service';
import { CustomerService } from './modules/service/examples/customer.service';
import { EventService } from './modules/service/examples/event.service';
import { IconService } from './modules/service/examples/icon.service';
import { NodeService } from './modules/service/examples/node.service';
import { PhotoService } from './modules/service/examples/photo.service';
import { ReportComponent } from './modules/components/reportes/report/report.component';
import { ReportesComponent } from './modules/components/reportes/reportes.component';
import { SafePipe } from './modules/pipes/safe.pipe';
// import { AuthService } from './release/service/core/auth.service';

import { NgxSpinnerModule } from 'ngx-spinner';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {CalendarModule} from 'primeng/calendar';
import {TableModule} from 'primeng/table';
import {DialogModule, Dialog} from 'primeng/dialog'
import {DialogService, DynamicDialogModule} from 'primeng/dynamicdialog';
import { PrimeIcons } from 'primeng/api';
import { ConfirmationService, MessageService } from 'primeng/api';
import {ButtonModule} from 'primeng/button';
import {RippleModule} from 'primeng/ripple';
import { DropdownModule } from 'primeng/dropdown';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ToastModule} from 'primeng/toast';
import {MessagesModule} from 'primeng/messages';
import {SidebarModule} from 'primeng/sidebar';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {InputTextModule} from 'primeng/inputtext';
import {InputNumberModule} from 'primeng/inputnumber';
import {SelectButtonModule} from 'primeng/selectbutton';
import {CheckboxModule} from 'primeng/checkbox';
import {TabViewModule} from 'primeng/tabview';
import {PanelMenuModule} from 'primeng/panelmenu';
import {InputTextareaModule} from 'primeng/inputtextarea';


// Login
// import { LoginComponent } from './release/components/auth/login/login.component';
// import { AuthService } from './release/service/core/auth.service';
// import { AuthService } from './services/auth.service';
// import { HttpClientModule } from '@angular/common/http';

// para quitar #
// import { HashLocationStrategy, LocationStrategy } from '@angular/common';


import { LoginRoutingModule } from './modules/components/auth/login/login-routing.module';
import { LoginComponent } from './modules/components/auth/login/login.component';
import { RegisterComponent } from './modules/components/auth/register/register.component';
import { PasswordModule } from 'primeng/password';
// import { ReporteComponent } from './modules/components/usuario/usuario-reporte/usuario-reporte.component';
// import { ReporteRoutingModule } from './modules/components/usuario/usuario-reporte/usuario-reporte-routing.module';
// import { ReportComponent } from './modules/components/reportes/report/report.component';
// import { ReporteRou}

@NgModule({
    declarations: [
        AppComponent,
        NotfoundComponent,
        ReportComponent,
        ReportesComponent,
        SafePipe,
        // LoginComponent,
        LoginComponent,
        RegisterComponent,
        // ReportComponent
        
    ],
    imports: [
        AppRoutingModule, AppLayoutModule,
        PdfViewerModule, NgxSpinnerModule,
        CalendarModule, TableModule, DialogModule, DynamicDialogModule, 
        CommonModule, BrowserModule, HttpClientModule, FormsModule, AppRoutingModule,
        ButtonModule, RippleModule, TableModule, DropdownModule, ToastModule, ConfirmDialogModule, 
        MessagesModule, SidebarModule, AutoCompleteModule, DialogModule,
        InputTextModule, CalendarModule, DynamicDialogModule, InputNumberModule, SelectButtonModule,
        CheckboxModule, TabViewModule, NgxSpinnerModule, PanelMenuModule, PdfViewerModule, 
        InputTextareaModule, CalendarModule,
        
        LoginRoutingModule,PasswordModule,
        // ReporteRoutingModule,
    ],
    providers: [
        // { provide: LocationStrategy, useClass: HashLocationStrategy },
        CountryService, CustomerService, EventService, IconService,
        NodeService, PhotoService, ProductService, DialogService,
        PrimeIcons, ConfirmationService, MessageService,
        // AuthService,

    ],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
