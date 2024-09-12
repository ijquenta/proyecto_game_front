import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/modules/service/core/auth.service';
import { MaterialService } from 'src/app/modules/service/data/material.service';
import { TipoCategoriaTexto } from 'src/app/modules/models/material';
import { Usuario } from 'src/app/modules/models/usuario';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    templateUrl: './tipo-categoria-texto.component.html',
    providers: [MessageService],
})
export class TipoCategoriaTextoComponent implements OnInit {

    usuario: Usuario;
    loading: boolean = false;
    TipoCategoriaTexto: TipoCategoriaTexto[] = [];
    tipoCategoriaTexto: TipoCategoriaTexto;
    tipoCategoriaTextoForm: FormGroup;
    optionDialogTipoCategoriaTexto: boolean = true;
    eliminarTipoCategoriaTextoDialog: boolean = false;

    items: MenuItem[] | undefined;
    home: MenuItem | undefined;

    constructor(
        private authService: AuthService,
        private messageService: MessageService,
        private materialService: MaterialService,
        private spinner: NgxSpinnerService,
        private formBuilder: FormBuilder,
    ) {
        this.items = [
            { label: 'Material de apoyo' },
            { label: 'Gestionar Material' },
            { label: 'Tipo Categoria Texto', routerLink: '' },
        ];
        this.home = { icon: 'pi pi-home', routerLink: '/principal' };
    }

    ngOnInit() {
        this.listarTipoCategoriaTexto();
        this.tipoCategoriaTextoForm = this.formBuilder.group({
            tipcatid: [''],
            tipcatnombre: ['', [Validators.required]],
        });
        this.getUser();
    }

    adicionarTipoCategoriaTexto() {
        this.tipoCategoriaTextoForm.reset();
        this.optionDialogTipoCategoriaTexto = true;
    }

    modificarTipoCategoriaTexto(data: TipoCategoriaTexto) {

        this.messageService.add({
            severity: 'info',
            summary: 'Tipo Texto',
            detail: 'Modificar registro',
            life: 3000,
        });

        this.tipoCategoriaTexto = { ...data };
        this.tipoCategoriaTextoForm.patchValue({
            tipcatid: this.tipoCategoriaTexto.tipcatid,
            tipcatnombre: this.tipoCategoriaTexto.tipcatnombre,
        });
        this.optionDialogTipoCategoriaTexto = false;
    }

    confirmarEliminarTipoCategoriaTexto(tipoCategoriaTexto: TipoCategoriaTexto) {
        this.tipoCategoriaTexto = { ...tipoCategoriaTexto };
        this.eliminarTipoCategoriaTextoDialog = true;
    }

    eliminarTipoCategoriaTexto() {
        this.materialService.deleteTipoCategoriaTexto(this.tipoCategoriaTexto.tipcatid).subscribe(
            () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Tipo Texto',
                    detail: 'Se eliminó correctamente en el sistema.',
                    life: 3000,
                });
                this.listarTipoCategoriaTexto();
                this.eliminarTipoCategoriaTextoDialog = false;
                this.loading = false;
            },
            (error: any) => {
                console.error("Error: ", error.message);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Problema',
                    detail: 'Ocurrió un error al eliminar el registro.',
                    life: 3000,
                });
                this.loading = false;
            }
        );
    }

    enviarTipoCategoriaTexto() {
        if (this.tipoCategoriaTextoForm.invalid) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Por favor, verifica la información ingresada e intenta nuevamente.',
                life: 3000,
            });
            Object.values(this.tipoCategoriaTextoForm.controls).forEach(control => {
                control.markAllAsTouched();
                control.markAsDirty();
            });
            return;
        }

        this.tipoCategoriaTexto = this.tipoCategoriaTextoForm.value as TipoCategoriaTexto;
        this.loading = true;

        if (this.optionDialogTipoCategoriaTexto) {
            this.materialService.createTipoCategoriaTexto(this.tipoCategoriaTexto).subscribe({
                next: (data: any) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Tipo Texto',
                        detail: 'Se registró correctamente en el sistema.',
                        life: 3000,
                    });
                    this.listarTipoCategoriaTexto();
                    this.loading = false;
                },
                error: (error: any) => {
                    console.error("Error: ", error.message);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Problema',
                        detail: 'El tipo de texto ya existe.',
                        life: 3000,
                    });
                    this.loading = false;
                }
            });
        } else {
            this.materialService.updateTipoCategoriaTexto(this.tipoCategoriaTexto.tipcatid, this.tipoCategoriaTexto).subscribe({
                next: (data: any) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Tipo Texto',
                        detail: 'Se modificó correctamente en el sistema.',
                        life: 3000,
                    });
                    this.listarTipoCategoriaTexto();
                    this.loading = false;
                },
                error: (error: any) => {
                    console.error("Error: ", error.message);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Problema',
                        detail: 'Ocurrió un error al modificar el tipo de texto.',
                        life: 3000,
                    });
                    this.loading = false;
                }
            });
        }
    }

    getUser() {
        this.authService.usuario$.subscribe(user => {
            if (Array.isArray(user) && user.length > 0) {
                this.usuario = user[0];
            }
        });
    }

    listarTipoCategoriaTexto() {
        this.spinner.show();
        this.materialService.getTipoCategoriaTexto().subscribe(
            (data: TipoCategoriaTexto[]) => {
                this.TipoCategoriaTexto = data;
                this.spinner.hide();
            },
            (error: any) => {
                console.error("Error: ", error.message);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Problema',
                    detail: 'Ocurrió un error al listar los tipos de texto.',
                    life: 3000,
                });
                this.spinner.hide();
            }
        );
    }

    ocultarTipoCategoriaTexto() {
        this.messageService.add({
            severity: 'info',
            summary: 'Tipo Texto',
            detail: 'Vaciar registro',
            life: 3000,
        });
        this.optionDialogTipoCategoriaTexto = true;
        this.tipoCategoriaTextoForm.reset();
    }
}
