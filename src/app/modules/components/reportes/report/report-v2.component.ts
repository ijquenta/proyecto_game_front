import { Component, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'reintegro-report',
    templateUrl: './report-v2.component.html',
    styleUrls: ['./report-v2.component.css'],
    providers: [MessageService]
})
export class ReportV2Component implements OnInit {
    reporteSRC: string = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';
    reporte : any = {
        "name": "Reporte.pdf",
        "lastModifiedDate": new Date()
    };
    zom: number = 1;
    constructor(
        public ref: DynamicDialogRef, public config:DynamicDialogConfig) { }
    ngOnInit(): void {
        if(this.config.data){
            this.reporteSRC = this.config.data?.reporteSRC;
            this.reporte = this.config.data?.reporte;
        }
    }
    downloadPdf(): void {
        saveAs(this.reporte, this.reporte.name);
    }
    mas(){
        this.zom += 0.2;
    }
    menos(){
        this.zom -= 0.2;
    }
}
