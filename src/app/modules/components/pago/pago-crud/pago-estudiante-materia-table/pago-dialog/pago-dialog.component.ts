import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { Pago, TipoPago } from 'src/app/modules/models/pago';
import { Usuario } from 'src/app/modules/models/usuario';

interface UploadEvent {
    originalEvent: Event;
    files: File[];
}

@Component({
  selector: 'app-pago-dialog',
  templateUrl: './pago-dialog.component.html',
  styleUrls: ['./pago-dialog.component.css']
})
export class PagoDialogComponent implements OnInit {
  @ViewChild('fileUpload') fileUpload: FileUpload | undefined;

  @Input() pago: Pago = new Pago();
  @Input() usuario: Usuario = new Usuario();
  @Input() tipoPago: TipoPago[] = [];
  @Input() visible: boolean = false;
  @Output() onGuardar = new EventEmitter<Pago>();
  @Output() onCancelar = new EventEmitter<void>();

  pagoForm: FormGroup;
  archivos: File[] = [];
  uploadedFiles: File[] = [];
  pagoData = new Pago();

  constructor(
    private messageService: MessageService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initializeForm(); // Inicializa el formulario
    this.populateForm();   // Rellena el formulario con datos existentes
  }

  /**
   * Inicializa el formulario con los controles y validaciones.
   */
  private initializeForm(): void {
    this.pagoForm = this.formBuilder.group({
      pagid: [''],
      insid: [''],
      pagdescripcion: ['', Validators.required],
      pagfecha: ['', Validators.required],
      pagmonto: ['', [Validators.required, Validators.min(0)]],
      tipoPago: ['', Validators.required],
      pagestadodescripcion: ['']
    });
  }

  /**
   * Maneja el evento de guardar el pago, emitiendo los datos del formulario si es válido.
   */
  guardarPago(): void {
    if (this.pagoForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error en el registro',
        detail: 'Por favor, completa todos los campos obligatorios e intenta nuevamente.',
        life: 5000
      });
      // Marca todos los controles como tocados y sucios para mostrar los errores
      Object.values(this.pagoForm.controls).forEach(control => {
        control.markAllAsTouched();
        control.markAsDirty();
      });
      return;
    }

    this.pagoData = { ...this.pagoForm.value };
    this.pagoData.tipo = 1; // Valor fijo para el tipo
    this.pagoData.pagid = null; // Nuevo registro
    this.pagoData.insid = this.pago.insid;
    this.pagoData.pagusureg = this.usuario.usuname;
    this.pagoData.pagusumod = this.usuario.usuname;
    this.pagoData.pagtipo = this.pagoForm.value.tipoPago.tpagid;
    this.pagoData.pagarchivo = null; // Archivo no asignado aún

    this.onGuardar.emit(this.pagoData); // Emite el formulario al componente padre
  }

  /**
   * Maneja el evento de cancelar la operación, notificando al componente padre.
   */
  cancelar(): void {
    this.onCancelar.emit(); // Notifica al componente padre que se ha cancelado
  }

  /**
   * Rellena el formulario con los datos del pago y tipo de pago.
   */
  private populateForm(): void {
    this.pagoForm.patchValue({
      pagid: this.pago.pagid,
      insid: this.pago.insid,
      pagdescripcion: this.pago.pagdescripcion,
      pagfecha: this.pago.pagfecha,
      pagmonto: this.pago.pagmonto,
      pagestado: this.pago.pagestado,
      tipoPago: this.tipoPago.find(tp => tp.tpagid === this.pago.pagtipo) || ''
    });
  }

  /**
   * Maneja el evento de carga de archivos, actualizando la lista de archivos subidos.
   * @param event El evento de carga que contiene los archivos seleccionados.
   */
  onUpload(event: UploadEvent): void {
    this.archivos = event.files;
    this.uploadedFiles.push(...event.files);
    this.messageService.add({
      severity: 'info',
      summary: 'Archivo',
      detail: 'Archivo seleccionado correctamente.'
    });
  }

  hidePagoDialog(){
    this.visible = false;
    // this.fileUpload.clear();
    this.pagoData = new Pago();
  }
}
