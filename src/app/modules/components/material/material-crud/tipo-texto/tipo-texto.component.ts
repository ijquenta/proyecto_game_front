import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/modules/service/core/auth.service';
import { MaterialService } from 'src/app/modules/service/data/material.service';
import { TipoTexto } from 'src/app/modules/models/material';
import { Usuario } from 'src/app/modules/models/usuario';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    templateUrl: './tipo-texto.component.html',
    providers: [MessageService],
})
export class TipoTextoComponent implements OnInit {

    usuario: Usuario;
    loading: boolean = false;
    TipoTexto: TipoTexto[] = [];
    tipoTexto: TipoTexto;
    tipoTextoForm: FormGroup;
    optionDialogTipoTexto: boolean = true;
    eliminarTipoTextoDialog: boolean = false;

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
            { label: 'Tipo Texto', routerLink: '' },
        ];
        this.home = { icon: 'pi pi-home', routerLink: '/principal' };
    }

    ngOnInit() {
        this.listarTipoTexto();
        this.tipoTextoForm = this.formBuilder.group({
            tiptexid: [''],
            tiptexnombre: ['', [Validators.required]],
        });
        this.getUser();
    }

    adicionarTipoTexto() {
        this.tipoTextoForm.reset();
        this.optionDialogTipoTexto = true;
    }

    modificarTipoTexto(data: TipoTexto) {

        this.messageService.add({
            severity: 'info',
            summary: 'Tipo Texto',
            detail: 'Modificar registro',
            life: 3000,
        });

        this.tipoTexto = { ...data };
        this.tipoTextoForm.patchValue({
            tiptexid: this.tipoTexto.tiptexid,
            tiptexnombre: this.tipoTexto.tiptexnombre,
        });
        this.optionDialogTipoTexto = false;
    }

    confirmarEliminarTipoTexto(tipoTexto: TipoTexto) {
        this.tipoTexto = { ...tipoTexto };
        this.eliminarTipoTextoDialog = true;
    }

    eliminarTipoTexto() {
        this.materialService.deleteTipoTexto(this.tipoTexto.tiptexid).subscribe(
            () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Tipo Texto',
                    detail: 'Se eliminó correctamente en el sistema.',
                    life: 3000,
                });
                this.listarTipoTexto();
                this.eliminarTipoTextoDialog = false;
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

    enviarTipoTexto() {
        console.log("tipoTextoForm: ", this.tipoTextoForm.value)
        if (this.tipoTextoForm.invalid) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Por favor, verifica la información ingresada e intenta nuevamente.',
                life: 3000,
            });
            Object.values(this.tipoTextoForm.controls).forEach(control => {
                control.markAllAsTouched();
                control.markAsDirty();
            });
            return;
        }

        this.tipoTexto = this.tipoTextoForm.value as TipoTexto;
        this.loading = true;

        if (this.optionDialogTipoTexto) {
            this.materialService.createTipoTexto(this.tipoTexto).subscribe({
                next: (data: any) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Tipo Texto',
                        detail: 'Se registró correctamente en el sistema.',
                        life: 3000,
                    });
                    this.listarTipoTexto();
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
            this.materialService.updateTipoTexto(this.tipoTexto.tiptexid, this.tipoTexto).subscribe({
                next: (data: any) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Tipo Texto',
                        detail: 'Se modificó correctamente en el sistema.',
                        life: 3000,
                    });
                    this.listarTipoTexto();
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

    listarTipoTexto() {
        this.spinner.show();
        this.materialService.getTipoTexto().subscribe(
            (data: TipoTexto[]) => {
                this.TipoTexto = data;
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

    ocultarTipoTexto() {
        this.messageService.add({
            severity: 'info',
            summary: 'Tipo Texto',
            detail: 'Vaciar registro',
            life: 3000,
        });
        this.optionDialogTipoTexto = true;
        this.tipoTextoForm.reset();
    }
}
