import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
// import { ReportComponent } from 'src/app/components/reportes/report/report.component';
import { ReportComponent } from '../../components/reportes/report/report.component';
import { ReportV2Component } from '../../components/reportes/report/report-v2.component';


@Injectable({
  providedIn: 'root'
})
export class ArchivosService {

  constructor(
    private spinner: NgxSpinnerService,
    private dialogService: DialogService,
    private messageService: MessageService,
  ) { }

  generateReportPDF(data: any, fileName: string){
    const file:any = new Blob([data], { type: 'application/pdf' });
    var day = new Date().getDay();
    var hour = new Date().getHours();
    var minutes = new Date().getMinutes();

    // file.name = fileName+'_'+day.toString()+'_'+hour.toString()+'_'+minutes.toString()+'.pdf';
    const name = fileName.split('.');
    file.name = name[0];
    file.lastModifiedDate = new Date();

    const fileURL = URL.createObjectURL(file);
    const initialState = {
              reporteSRC: fileURL,
      reporte: file
    };
    const ref = this.dialogService.open(ReportComponent, {
      data: initialState,
      header: file.name,
      width: '90%',
      height: '100%'
    });
    ref.onClose.subscribe((result: any) => {
        // console.log('fileName:', result);
        //this.confirmDialogObsData = result;
    });
  }

  generateReportPDFV2(data: any, fileName: string){
    const file:any = new Blob([data], { type: 'application/pdf' });
    var hour = new Date().getHours();
    var minutes = new Date().getMinutes();

    file.name = fileName+'_'+hour.toString()+'_'+minutes.toString()+'.pdf';
    file.lastModifiedDate = new Date();

    const fileURL = URL.createObjectURL(file);
    const initialState = {
      reporteSRC: fileURL,
      reporte: file
    };
    const ref = this.dialogService.open(ReportV2Component, {
      data: initialState,
      header: file.name,
      width: '90%',
      height: '80%'
    });
    ref.onClose.subscribe((result: any) => {
        // console.log('fileName:', result);
        //this.confirmDialogObsData = result;
    });
  }
  generateReportDescargable(data: any, fileName: string){
    this.spinner.hide();
    saveAs(data, fileName);
  }
  generateReportDescargable2(data: any, fileName: string, extension: string){
    this.spinner.hide();
    var hour = new Date().getHours();
    var minutes = new Date().getMinutes();
    saveAs(data, fileName+'_'+hour.toString()+'_'+minutes.toString()+extension);
  }
  showToast(){
    this.messageService.add({severity:'warn', summary:'No se encontro', detail:'No se pudo obtener el archivo'});
  }
}
