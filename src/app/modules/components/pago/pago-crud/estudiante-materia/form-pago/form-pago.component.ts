import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { Pago, TipoPago } from 'src/app/modules/models/pago';
import { Usuario } from 'src/app/modules/models/usuario';
import { PagoService } from 'src/app/modules/service/data/pago.service';

@Component({
  selector: 'app-form-pago',
  templateUrl: './form-pago.component.html',
  styleUrls: ['./form-pago.component.css']
})
export class FormPagoComponent implements OnInit {
  pagoForm: FormGroup;
  tipoPago: TipoPago[] = [];
  pago: Pago = new Pago();
  usuario: Usuario = new Usuario(); // Asume que obtienes el usuario actual de alguna manera
  pagoId: string | null = null;
  isEditMode: boolean = false;
  archivos: File[] = [];
  uploadedFiles: File[] = [];
  visible: boolean = true;
  items: MenuItem[];
  home: MenuItem | undefined;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private pagoService: PagoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.listarTipoPagoCombo();
    this.isEditMode = false;
    // this.route.paramMap.subscribe(params => {
    //   this.pagoId = params.get('id');
    //   if (this.pagoId) {     
    //     this.isEditMode = true;
    //     this.loadPagoData(this.pagoId);
    //   }
    // });

    this.items = [
        { label: 'Pago'},
        { label: 'Gestionar Pagos', routerLink:'/principal/pago/todos' },
        { label: 'Materia', routerLink:'/principal/pago/estudiante-materia'},
        { label: 'Formulario de pago', routerLink:'/principal/pago/form'},
    ];

    this.home = { icon: 'pi pi-home', routerLink: '/' };
  }

  private initializeForm(): void {
    this.pagoForm = this.fb.group({
      pagid: [''],
      insid: [''],
      pagdescripcion: ['', Validators.required],
      pagfecha: ['', Validators.required],
      pagmonto: ['', [Validators.required, Validators.min(0)]],
      tipoPago: ['', Validators.required],
      pagestadodescripcion: ['']
    });
  }

  listarTipoPagoCombo(): void {
    this.pagoService.getTipoPago().subscribe({
      next: (result: TipoPago[]) => {
        this.tipoPago = result;
      },
      error: (error: any) => {
        console.log("Error al obtener los tipos de pago:", error);
        this.messageService.add({ severity: 'warn', summary: '¡Error!', detail: 'No se pudieron obtener los tipos de pago' });
      }
    });
  }

  loadPagoData(id: string) {
    // this.pagoService.getPagoById(id).subscribe({
    //   next: (result: Pago) => {
    //     this.pago = result;
    //     this.pagoForm.patchValue(result);
    //   },
    //   error: (error: any) => {
    //     console.log("Error al obtener los datos del pago:", error);
    //     this.messageService.add({ severity: 'warn', summary: '¡Error!', detail: 'No se pudieron cargar los datos del pago' });
    //   }
    // });
  }

  guardarPago(): void {
    if (this.pagoForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error en el registro',
        detail: 'Por favor, completa todos los campos obligatorios e intenta nuevamente.',
        life: 5000
      });
      Object.values(this.pagoForm.controls).forEach(control => {
        control.markAllAsTouched();
        control.markAsDirty();
      });
      return;
    }

    const pagoData = { ...this.pagoForm.value };
    pagoData.tipo = 1; // Valor fijo para el tipo
    pagoData.pagid = this.isEditMode ? this.pago.pagid : null; // Usar ID si es edición
    pagoData.insid = this.pago.insid;
    pagoData.pagusureg = this.usuario.usuname;
    pagoData.pagusumod = this.usuario.usuname;
    pagoData.pagtipo = this.pagoForm.value.tipoPago.tpagid;
    pagoData.pagarchivo = this.archivos.length ? this.archivos[0] : null; // Usar archivo si hay alguno

    if (this.isEditMode) {
    //   this.pagoService.updatePago(this.pagoId!, pagoData).subscribe({
    //     next: () => {
    //       this.messageService.add({ severity: 'info', summary: 'Exitoso', detail: 'Pago actualizado correctamente.', life: 1000 });
    //       this.router.navigate(['/pago']); // Redirige a la lista de pagos
    //     },
    //     error: (error: any) => {
    //       console.log("Error al actualizar el pago:", error);
    //       this.messageService.add({ severity: 'warn', summary: '¡Error!', detail: 'No se pudo actualizar el pago' });
    //     }
    //   });
    } else {
    //   this.pagoService.createPago(pagoData).subscribe({
    //     next: () => {
    //       this.messageService.add({ severity: 'info', summary: 'Exitoso', detail: 'Pago creado correctamente.', life: 1000 });
    //       this.router.navigate(['/pago']); // Redirige a la lista de pagos
    //     },
    //     error: (error: any) => {
    //       console.log("Error al crear el pago:", error);
    //       this.messageService.add({ severity: 'warn', summary: '¡Error!', detail: 'No se pudo crear el pago' });
    //     }
    //   });
    }
  }

  cancelar(): void {
    this.router.navigate(['/pago']); // Redirige a la lista de pagos o a la vista deseada
  }

  onUpload(event: { files: File[] }): void {
    this.archivos = event.files;
    this.uploadedFiles.push(...event.files);
    this.messageService.add({
      severity: 'info',
      summary: 'Archivo',
      detail: 'Archivo seleccionado correctamente.'
    });
  }
}
