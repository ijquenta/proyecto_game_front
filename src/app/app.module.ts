import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './modules/layout/app.layout.module';
import { ProductService } from './modules/service/examples/product.service';
import { CountryService } from './modules/service/examples/country.service';
import { CustomerService } from './modules/service/examples/customer.service';
import { EventService } from './modules/service/examples/event.service';
import { IconService } from './modules/service/examples/icon.service';
import { NodeService } from './modules/service/examples/node.service';
import { PhotoService } from './modules/service/examples/photo.service';
import { SafePipe } from './modules/pipes/safe.pipe';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CalendarModule} from 'primeng/calendar';
import { TableModule} from 'primeng/table';
import { DialogModule, Dialog} from 'primeng/dialog'
import { DialogService, DynamicDialogModule} from 'primeng/dynamicdialog';
import { PrimeIcons } from 'primeng/api';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule} from 'primeng/button';
import { RippleModule} from 'primeng/ripple';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmDialogModule} from 'primeng/confirmdialog';
import { ToastModule} from 'primeng/toast';
import { MessagesModule} from 'primeng/messages';
import { SidebarModule} from 'primeng/sidebar';
import { AutoCompleteModule} from 'primeng/autocomplete';
import { InputTextModule} from 'primeng/inputtext';
import { InputNumberModule} from 'primeng/inputnumber';
import { SelectButtonModule} from 'primeng/selectbutton';
import { CheckboxModule} from 'primeng/checkbox';
import { TabViewModule} from 'primeng/tabview';
import { PanelMenuModule} from 'primeng/panelmenu';
import { InputTextareaModule} from 'primeng/inputtextarea';
import { DividerModule } from 'primeng/divider';
import { LoginRoutingModule } from './modules/components/auth/login/login-routing.module';
import { LoginComponent } from './modules/components/auth/login/login.component';
import { RegisterComponent } from './modules/components/auth/register/register.component';
import { ForgotPasswordComponent } from './modules/components/auth/forgotPassword/forgot-password.component';
import { PasswordModule } from 'primeng/password';
import { ReportComponent } from './modules/components/reportes/report/report.component';
import { ReportesComponent } from './modules/components/reportes/reportes.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { ReportV2Component } from './modules/components/reportes/report/report-v2.component';
import { ConfirmComponent } from './modules/components/auth/confirm/confirm.component';
import { NoConfirmComponent } from './modules/components/auth/noConfirm/no-confirm.component';
import { VerifiedComponent } from './modules/components/auth/verified/verified.component';
// import { TreeTableModule } from 'primeng/treetable';
@NgModule({
    declarations: [
        AppComponent,
        ReportComponent,
        ReportV2Component,
        ReportesComponent,
        SafePipe,
        LoginComponent,
        RegisterComponent,
        ForgotPasswordComponent,
        ConfirmComponent,
        NoConfirmComponent,
        VerifiedComponent
    ],
    imports: [
        // TreeTableModule,
        AppRoutingModule,
        AppLayoutModule,
        ReactiveFormsModule,
        DividerModule,
        PdfViewerModule,
        BrowserAnimationsModule,
        CalendarModule,
        TableModule,
        DialogModule,
        CommonModule,
        BrowserModule,
        HttpClientModule,
        FormsModule,
        AppRoutingModule,
        ButtonModule,
        RippleModule,
        TableModule,
        DropdownModule,
        ToastModule,
        ConfirmDialogModule,
        MessagesModule,
        SidebarModule,
        AutoCompleteModule,
        DialogModule,
        InputTextModule,
        CalendarModule,
        DynamicDialogModule,
        InputNumberModule,
        SelectButtonModule,
        CheckboxModule,
        TabViewModule,
        NgxSpinnerModule,
        PanelMenuModule,
        PdfViewerModule,
        InputTextareaModule,
        CalendarModule,
        LoginRoutingModule,
        PasswordModule,
        ScrollPanelModule,
    ],
    providers: [
        CountryService, CustomerService, EventService, IconService,
        NodeService, PhotoService, ProductService, DialogService,
        PrimeIcons, ConfirmationService, MessageService,
        { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
    ],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
