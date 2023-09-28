import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { NotfoundComponent } from './release/components/notfound/notfound.component';
import { ProductService } from './release/service/product.service';
import { CountryService } from './release/service/country.service';
import { CustomerService } from './release/service/customer.service';
import { EventService } from './release/service/event.service';
import { IconService } from './release/service/icon.service';
import { NodeService } from './release/service/node.service';
import { PhotoService } from './release/service/photo.service';
import { ReportComponent } from './release/components/reportes/report/report.component';
import { ReportesComponent } from './release/components/reportes/reportes.component';
import { SafePipe } from './release/pipes/safe.pipe';

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
@NgModule({
    declarations: [
        AppComponent,
        NotfoundComponent,
        ReportComponent,
        ReportesComponent,
        SafePipe,
    ],
    imports: [
        AppRoutingModule,
        AppLayoutModule,
        PdfViewerModule,
        NgxSpinnerModule,
        CalendarModule,
        TableModule,
        DialogModule,
        DynamicDialogModule,
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

    ],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        CountryService, CustomerService, EventService, IconService, NodeService,
        PhotoService, ProductService, DialogService, PrimeIcons, ConfirmationService, MessageService
    ],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
