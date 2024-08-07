import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
// Service
import { NgxSpinnerService } from 'ngx-spinner';
import { PersonaService } from 'src/app/modules/service/data/persona.service';
import { AuthService } from 'src/app/modules/service/core/auth.service';
// Modelos
import { tipoProfesion } from 'src/app/modules/models/persona';
import { Usuario } from 'src/app/modules/models/usuario';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
    templateUrl: './estudiante-admision-tipoProfesion.component.html',
    providers: [MessageService],
})
export class EstudianteAdmisionTipoProfesionComponent implements OnInit {

    usuario: Usuario;
    statuses: any[] = [];
    loading: boolean = false;
    TipoProfesion: tipoProfesion[] = [];
    tipoProfesion: tipoProfesion;
    tipoProfesionForm: FormGroup;
    tipoProfesionDialog: boolean = false;
    optionDialogTipoProfesion: boolean = false;
    eliminarTipoProfesionDialog: boolean = false;

    items: MenuItem[] | undefined;
    home: MenuItem | undefined;

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
        this.items = [{label: 'Estudiantes'} ,{ label: 'Admisión'}, { label: 'Tipo Profesión', routerLink:''},];
        this.home = { icon: 'pi pi-home', routerLink: '/' };
    }

    ngOnInit() {

        // Tipo Profesion
        this.listarTipoProfesion()

        this.statuses = [
            { label: 'Activo', value: 0 },
            { label: 'Inactivo', value: 1 },
        ];

        this.getUser()

        this.tipoProfesionForm = this.formBuilder.group({
            proid: [''],
            pronombre: ['', [Validators.required]],
            proobservacion: [''],
            proestado: ['', [Validators.required]]
        })
    }

    adicionarTipoProfesion(){
        this.tipoProfesionDialog = true;
        this.optionDialogTipoProfesion = true;
        this.tipoProfesionForm.reset();
    }

    modificarTipoProfesion(data: any){
        this.tipoProfesionForm.reset();
        // this.lista();
        this.tipoProfesionDialog = true;
        this.optionDialogTipoProfesion = false;
        this.tipoProfesion = {...data};
        console.log("antes modificar: ", this.tipoProfesion)
        this.tipoProfesionForm.patchValue({
            proid: this.tipoProfesion.proid,
            pronombre: this.tipoProfesion.pronombre,
            proobservacion: this.tipoProfesion.proobservacion,
            proestado: this.tipoProfesion.proestado
        });
        console.log("modificar: ", this.tipoProfesionForm.value)
    }

    // Obtener Severity Estado
    getSeverityStatus(estado: number): string {
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
    getDescriptionStatus(estado: number): string {
        switch (estado) {
            case 1:
                return 'Activo';
            case 0:
                return 'Inactivo';
            default:
                return 'Ninguno';
        }
    }

    confirmarEliminarTipoProfesion(tipoProfesion: any){
        this.eliminarTipoProfesionDialog = true;
        this.tipoProfesion = {...tipoProfesion}
    }

    eliminarTipoProfesion(){
        this.personaService.eliminarTipoProfesion(this.tipoProfesion.proid).subscribe(
            (data: any) => {

                this.messageService.add(
                    { severity: 'success',
                      summary: 'Tipo Profesión',
                      detail: 'Se eliminó correctamente en el sistema.',
                      life: 3000
                    });

                this.optionDialogTipoProfesion = false;
                this.eliminarTipoProfesionDialog = false;
                this.listarTipoProfesion();
                this.tipoProfesionDialog = false;
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

    enviarTipoProfesion(){
        if(this.tipoProfesionForm.invalid){
            this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Por favor, verifica la información ingresada e intenta nuevamente.', life: 3000 });
            return Object.values(this.tipoProfesionForm.controls).forEach(control=>{
                control.markAllAsTouched();
                control.markAsDirty();
            })
        }
        if (this.optionDialogTipoProfesion) {
            this.tipoProfesion = new tipoProfesion();
            this.tipoProfesion.pronombre = this.tipoProfesionForm.value.pronombre;
            this.tipoProfesion.proobservacion = this.tipoProfesionForm.value.proobservacion;
            this.tipoProfesion.proestado = this.tipoProfesionForm.value.proestado;
            this.tipoProfesion.prousureg = this.usuario.usuname;
            this.loading=true;
            this.personaService.adicionarTipoProfesion(this.tipoProfesion).subscribe(
                (data: any) => {

                    this.messageService.add(
                        { severity: 'success',
                          summary: 'Tipo Profesión',
                          detail: 'Se registró correctamente en el sistema.',
                          life: 3000
                        });

                    this.optionDialogTipoProfesion = false;
                    this.listarTipoProfesion();
                    this.tipoProfesionDialog = false;
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
        if (!this.optionDialogTipoProfesion) {
            this.tipoProfesion = new tipoProfesion();
            this.tipoProfesion.proid = this.tipoProfesionForm.value.proid;
            this.tipoProfesion.pronombre = this.tipoProfesionForm.value.pronombre;
            this.tipoProfesion.proobservacion = this.tipoProfesionForm.value.proobservacion;
            this.tipoProfesion.proestado = this.tipoProfesionForm.value.proestado;
            this.tipoProfesion.prousumod = this.usuario.usuname;
            this.loading=true;
            this.personaService.modificarTipoProfesion(this.tipoProfesion, this.tipoProfesion.proid).subscribe(
                (data: any) => {
                    this.messageService.add(
                        { severity: 'success',
                          summary: 'Tipo Profesión',
                          detail: 'Se modificó correctamente en el sistema.',
                          life: 3000
                        });

                    this.optionDialogTipoProfesion = false;
                    this.listarTipoProfesion();
                    this.tipoProfesionDialog = false;
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

    listarTipoProfesion(){
        this.spinner.show();
        this.personaService.listarTipoProfesion().subscribe({
            next: (data: any) => {
                this.TipoProfesion = Array.isArray(data["data"]) ? data["data"] : [];
                this.spinner.hide();
            },
            error: (error: any) => {
                this.spinner.hide();
                console.error("Error: ", error['message']);
                this.messageService.add({ severity: 'error', summary: 'Problema', detail: 'Ocurrío un error en el registro de persona, verifique los campos ingresados.', life: 3000 });
            }
        });
    }

    ocultarTipoProfesion(){
        this.tipoProfesionDialog = false;
        this.tipoProfesionForm.reset();
    }
}
