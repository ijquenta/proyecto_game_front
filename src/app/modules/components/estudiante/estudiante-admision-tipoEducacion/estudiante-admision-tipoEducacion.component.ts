import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
// Service
import { NgxSpinnerService } from 'ngx-spinner';
import { PersonaService } from 'src/app/modules/service/data/persona.service';
import { AuthService } from 'src/app/services/auth.service';
// Modelos
import { tipoEducacion } from 'src/app/modules/models/persona';
import { Usuario } from 'src/app/modules/models/usuario';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
    templateUrl: './estudiante-admision-tipoEducacion.component.html',
    providers: [MessageService],
})
export class EstudianteAdmisionTipoEducacionComponent implements OnInit {

    usuario: Usuario;
    statuses: any[] = [];
    loading: boolean = false;
    TipoEducacion: tipoEducacion[] = [];
    tipoEducacion: tipoEducacion;
    tipoEducacionForm: FormGroup;
    tipoEducacionDialog: boolean = false;
    optionDialogTipoEducacion: boolean = false;
    eliminarTipoEducacionDialog: boolean = false;

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
        this.listarTipoEducacion()

        this.statuses = [
            { label: 'Activo', value: 0 },
            { label: 'Inactivo', value: 1 },
        ];

        this.getUser()

        this.tipoEducacionForm = this.formBuilder.group({
            eduid: [''],
            edunombre: ['', [Validators.required]],
            eduobservacion: [''],
            eduestado: ['', [Validators.required]]
        })
    }

    adicionarTipoEducacion(){
        this.tipoEducacionDialog = true;
        this.optionDialogTipoEducacion = true;
        this.tipoEducacionForm.reset();
    }

    modificarTipoEducacion(data: any){
        this.tipoEducacionForm.reset();
        // this.lista();
        this.tipoEducacionDialog = true;
        this.optionDialogTipoEducacion = false;
        this.tipoEducacion = {...data};
        console.log("antes modificar: ", this.tipoEducacion)
        this.tipoEducacionForm.patchValue({
            eduid: this.tipoEducacion.eduid,
            edunombre: this.tipoEducacion.edunombre,
            eduobservacion: this.tipoEducacion.eduobservacion,
            eduestado: this.tipoEducacion.eduestado
        });
        console.log("modificar: ", this.tipoEducacionForm.value)
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

    confirmarEliminarTipoEducacion(tipoEducacion: any){
        this.eliminarTipoEducacionDialog = true;
        this.tipoEducacion = {...tipoEducacion}
    }

    eliminarTipoEducacion(){
        this.personaService.eliminarTipoEducacion(this.tipoEducacion.eduid).subscribe(
            (data: any) => {

                this.messageService.add(
                    { severity: 'success',
                      summary: 'Tipo Educación',
                      detail: 'Se eliminó correctamente en el sistema.',
                      life: 3000
                    });

                this.optionDialogTipoEducacion = false;
                this.eliminarTipoEducacionDialog = false;
                this.listarTipoEducacion();
                this.tipoEducacionDialog = false;
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

    enviarTipoEducacion(){
        if(this.tipoEducacionForm.invalid){
            this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Por favor, verifica la información ingresada e intenta nuevamente.', life: 3000 });
            return Object.values(this.tipoEducacionForm.controls).forEach(control=>{
                control.markAllAsTouched();
                control.markAsDirty();
            })
        }
        if (this.optionDialogTipoEducacion) {
            this.tipoEducacion = new tipoEducacion();
            this.tipoEducacion.edunombre = this.tipoEducacionForm.value.edunombre;
            this.tipoEducacion.eduobservacion = this.tipoEducacionForm.value.eduobservacion;
            this.tipoEducacion.eduestado = this.tipoEducacionForm.value.eduestado;
            this.tipoEducacion.eduusureg = this.usuario.usuname;
            this.loading=true;
            this.personaService.adicionarTipoEducacion(this.tipoEducacion).subscribe(
                (data: any) => {

                    this.messageService.add(
                        { severity: 'success',
                          summary: 'Tipo Educación',
                          detail: 'Se registró correctamente en el sistema.',
                          life: 3000
                        });

                    this.optionDialogTipoEducacion = false;
                    this.listarTipoEducacion();
                    this.tipoEducacionDialog = false;
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
        if (!this.optionDialogTipoEducacion) {
            this.tipoEducacion = new tipoEducacion();
            this.tipoEducacion.eduid = this.tipoEducacionForm.value.eduid;
            this.tipoEducacion.edunombre = this.tipoEducacionForm.value.edunombre;
            this.tipoEducacion.eduobservacion = this.tipoEducacionForm.value.eduobservacion;
            this.tipoEducacion.eduestado = this.tipoEducacionForm.value.eduestado;
            this.tipoEducacion.eduusumod = this.usuario.usuname;
            this.loading=true;
            this.personaService.modificarTipoEducacion(this.tipoEducacion, this.tipoEducacion.eduid).subscribe(
                (data: any) => {
                    this.messageService.add(
                        { severity: 'success',
                          summary: 'Tipo Educación',
                          detail: 'Se modificó correctamente en el sistema.',
                          life: 3000
                        });

                    this.optionDialogTipoEducacion = false;
                    this.listarTipoEducacion();
                    this.tipoEducacionDialog = false;
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

    listarTipoEducacion(){
        this.personaService.listarTipoEducacion().subscribe(
            (data: any) => {
                this.TipoEducacion = Array.isArray(data["data"]) ? data["data"] : [];
                console.log("Tipo Educación: ", this.TipoEducacion)
            },
            (error: any) => {
                console.error("Error: ", error['message']);
                this.messageService.add({ severity: 'error', summary: 'Problema', detail: 'Ocurrío un error en el registro de persona, verifique los campos ingresados.', life: 3000 });
            }
        );
    }

    ocultarTipoEducacion(){
        this.tipoEducacionDialog = false;
        this.tipoEducacionForm.reset();
    }
}
