import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
// Service
import { NgxSpinnerService } from 'ngx-spinner';
import { PersonaService } from 'src/app/modules/service/data/persona.service';
import { AuthService } from 'src/app/services/auth.service';
// Modelos
import { tipoCargo } from 'src/app/modules/models/persona';
import { Usuario } from 'src/app/modules/models/usuario';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
    templateUrl: './estudiante-admision-tipoCargo.component.html',
    providers: [MessageService],
})
export class EstudianteAdmisionTipoCargoComponent implements OnInit {

    usuario: Usuario;
    statuses: any[] = [];
    loading: boolean = false;
    TipoCargo: tipoCargo[] = [];
    tipoCargo: tipoCargo;
    tipoCargoForm: FormGroup;
    tipoCargoDialog: boolean = false;
    optionDialogTipoCargo: boolean = false;
    eliminarTipoCargoDialog: boolean = false;

    stateOptionsEstado: any[] = [
        { label: 'Activo', value: 1 },
        { label: 'Inactivo', value: 0 }
    ];

    constructor(
        private authService: AuthService,
        private messageService: MessageService,
        public personaService: PersonaService,
        private spinner: NgxSpinnerService,
        private formBuilder: FormBuilder,
    ) {

    }

    ngOnInit() {

        // Tipo Educacion
        this.listarTipoCargo()

        this.statuses = [
            { label: 'Activo', value: 0 },
            { label: 'Inactivo', value: 1 },
        ];

        this.getUser()

        this.tipoCargoForm = this.formBuilder.group({
            carid: [''],
            carnombre: ['', [Validators.required]],
            carobservacion: [''],
            carestado: ['', [Validators.required]]
        })
    }

    adicionarTipoCargo(){
        this.tipoCargoDialog = true;
        this.optionDialogTipoCargo = true;
        this.tipoCargoForm.reset();
    }

    modificarTipoCargo(data: any){
        this.tipoCargoForm.reset();
        // this.lista();
        this.tipoCargoDialog = true;
        this.optionDialogTipoCargo = false;
        this.tipoCargo = {...data};
        console.log("antes modificar: ", this.tipoCargo)
        this.tipoCargoForm.patchValue({
            carid: this.tipoCargo.carid,
            carnombre: this.tipoCargo.carnombre,
            carobservacion: this.tipoCargo.carobservacion,
            carestado: this.tipoCargo.carestado
        });
        console.log("modificar: ", this.tipoCargoForm.value)
    }

    // Obtener Severity Estado
    obtenerSeverityEstado(estado: number): string {
        switch (estado) {
            case 1:
                return 'success';
            case 0:
                return 'danger';
            default:
                return 'info';
        }
    }
    // Obtener Descripción de estado
    obtenerDescripcionEstado(estado: number): string {
        switch (estado) {
            case 1:
                return 'Activo';
            case 0:
                return 'Inactivo';
            default:
                return 'Ninguno';
        }
    }

    confirmarEliminarTipoCargo(tipoCargo: any){
        this.eliminarTipoCargoDialog = true;
        this.tipoCargo = {...tipoCargo}
    }

    eliminarTipoCargo(){
        this.personaService.eliminarTipoCargo(this.tipoCargo.carid).subscribe(
            (data: any) => {

                this.messageService.add(
                    { severity: 'success',
                      summary: 'Tipo Cargo',
                      detail: 'Se eliminó correctamente en el sistema.',
                      life: 3000
                    });

                this.optionDialogTipoCargo = false;
                this.eliminarTipoCargoDialog = false;
                this.listarTipoCargo();
                this.tipoCargoDialog = false;
                this.loading=false;
            },
            (error: any) => {
                console.error("Error: ", error['message']);
                this.messageService.add(
                    { severity: 'error',
                      summary: 'Problema',
                      detail: 'Ocurrío un error en el registro, verifique los campos ingresados.',
                      life: 3000
                    });
            }
        );
    }

    enviarTipoCargo(){
        if(this.tipoCargoForm.invalid){
            this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Por favor, verifica la información ingresada e intenta nuevamente.', life: 3000 });
            return Object.values(this.tipoCargoForm.controls).forEach(control=>{
                control.markAllAsTouched();
                control.markAsDirty();
            })
        }
        if (this.optionDialogTipoCargo) {
            this.tipoCargo = new tipoCargo();
            this.tipoCargo.carnombre = this.tipoCargoForm.value.carnombre;
            this.tipoCargo.carobservacion = this.tipoCargoForm.value.carobservacion;
            this.tipoCargo.carestado = this.tipoCargoForm.value.carestado;
            this.tipoCargo.carusureg = this.usuario.usuname;
            this.loading=true;
            this.personaService.adicionarTipoCargo(this.tipoCargo).subscribe(
                (data: any) => {

                    this.messageService.add(
                        { severity: 'success',
                          summary: 'Tipo Cargo',
                          detail: 'Se registró correctamente en el sistema.',
                          life: 3000
                        });

                    this.optionDialogTipoCargo = false;
                    this.listarTipoCargo();
                    this.tipoCargoDialog = false;
                    this.loading=false;
                },
                (error: any) => {
                    console.error("Error: ", error['message']);
                    this.messageService.add(
                        { severity: 'error',
                          summary: 'Problema',
                          detail: 'Ocurrío un error en el registro, verifique los campos ingresados.',
                          life: 3000
                        });
                }
            );
        }
        if (!this.optionDialogTipoCargo) {
            this.tipoCargo = new tipoCargo();
            this.tipoCargo.carid = this.tipoCargoForm.value.carid;
            this.tipoCargo.carnombre = this.tipoCargoForm.value.carnombre;
            this.tipoCargo.carobservacion = this.tipoCargoForm.value.carobservacion;
            this.tipoCargo.carestado = this.tipoCargoForm.value.carestado;
            this.tipoCargo.carusumod = this.usuario.usuname;
            this.loading=true;
            this.personaService.modificarTipoCargo(this.tipoCargo, this.tipoCargo.carid).subscribe(
                (data: any) => {
                    this.messageService.add(
                        { severity: 'success',
                          summary: 'Tipo Cargo',
                          detail: 'Se modificó correctamente en el sistema.',
                          life: 3000
                        });

                    this.optionDialogTipoCargo = false;
                    this.listarTipoCargo();
                    this.tipoCargoDialog = false;
                    this.loading=false;
                },
                (error: any) => {
                    console.error("Error: ", error['message']);
                    this.messageService.add(
                        { severity: 'error',
                          summary: 'Problema',
                          detail: 'Ocurrío un error en el registro, verifique los campos ingresados.',
                          life: 3000
                        });
                }
            );
        }
    }

    getUser() {
        this.authService.usuario$.subscribe((user => {
            if (user) {
                if (Array.isArray(user) && user.length > 0) {
                    this.usuario = user[0];
                }
            }
        }));
    }

    listarTipoCargo(){
        this.personaService.listarTipoCargo().subscribe(
            (data: any) => {
                this.TipoCargo = Array.isArray(data["data"]) ? data["data"] : [];
                console.log("Tipo Cargo: ", this.TipoCargo)
            },
            (error: any) => {
                console.error("Error: ", error['message']);
                this.messageService.add({ severity: 'error', summary: 'Problema', detail: 'Ocurrío un error en el registro de persona, verifique los campos ingresados.', life: 3000 });
            }
        );
    }

    ocultarTipoCargo(){
        this.tipoCargoDialog = false;
        this.tipoCargoForm.reset();
    }


}
