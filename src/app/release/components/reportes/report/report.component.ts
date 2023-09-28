import { Component, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
// import { Product } from 'src/app/release/api/product';
// import { Usuarios } from 'src/app/release/models/usuarios';
// import { Usuario } from 'src/app/release/models/usuario';
// import { MessageService } from 'primeng/api';
// import { Table } from 'primeng/table';
// import { ProductService } from 'src/app/release/service/product.service';
// import { UsuarioService } from 'src/app/release/service/data/usuario.service';

@Component({
    selector: 'reintegro-report',
    templateUrl: './report.component.html',
    styleUrls: ['./report.component.css']
    // providers: [MessageService]
})
export class ReportComponent implements OnInit {
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