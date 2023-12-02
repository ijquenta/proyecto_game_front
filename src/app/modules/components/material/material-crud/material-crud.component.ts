import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';


// Service
import { UsuarioService } from 'src/app/modules/service/data/usuario.service';
// Modelos
import { Persona } from 'src/app/modules/models/persona';
import { TipoPais, TipoCiudad, TipoEstadoCivil, TipoGenero, TipoDocumento } from 'src/app/modules/models/diccionario';
import { PersonaService } from 'src/app/modules/service/data/persona.service';
import { Nota } from 'src/app/modules/models/nota';
import { NotaService } from 'src/app/modules/service/data/nota.service';
import { PagoService } from 'src/app/modules/service/data/pago.service';
import { Pago } from 'src/app/modules/models/pago';
import { Material } from 'src/app/modules/models/material';
import { MaterialService } from 'src/app/modules/service/data/material.service';

@Component({
    templateUrl: './material-crud.component.html',
    providers: [MessageService],
})
export class MaterialCrudComponent implements OnInit {
    Personas: Persona[] = [];
    Notas: Nota[] = [];
    Pagos: Pago[] = [];
    Materiales: Material[] = [];
    persona: Persona;
    personaRegistro: Persona;

    TipoPais: TipoPais[] = [];
    TipoPaisSeleccionado: TipoPais;
    TipoPaisSeleccionado2: TipoPais;
    TipoCiudad: TipoCiudad[] = [];
    TipoCiudadRespaldo: TipoCiudad[] = [];
    TipoCiudadSeleccionado: TipoCiudad;
    TipoEstadoCivil: TipoEstadoCivil[] = [];
    TipoEstadoCivilSeleccionado: TipoEstadoCivil;
    TipoGenero: TipoGenero[] = [];
    TipoGeneroSeleccionado: TipoGenero;
    TipoDocumento: TipoDocumento[] = [];
    TipoDocumentoSeleccionado: TipoDocumento;

    eliminarPersonaDialog: boolean = false;
    errors: any;
    personaDialog: boolean = false;
    optionDialog: boolean = false;
    id: any;
    deleteProductDialog: boolean = false;
    deleteProductsDialog: boolean = false;
    submitted: boolean = false;
    submittedMod: boolean = false;
    cols: any[] = [];
    statuses: any[] = [];
    rowsPerPageOptions = [5, 10, 20];
    camposVacios: boolean = false;
    value!: string;

    constructor(
        public usuarioService: UsuarioService,
        private messageService: MessageService,
        public personaService: PersonaService,
        public notaService: NotaService,
        public pagoService: PagoService,
        public materialService: MaterialService
    ) {

    }

    ngOnInit() {
        this.ListarPersonas();
        this.LlenarTipoCombo();

        this.statuses = [
            { label: 'Activo', value: 0 },
            { label: 'Inactivo', value: 1 },
        ];
    }

    LlenarTipoCombo() {
        this.personaService.getTipoCiudad().subscribe((data: any) => {
            this.TipoCiudad = data;
            this.TipoCiudadRespaldo = data;
        });
        this.personaService.getTipoPais().subscribe((data: any) => {
            this.TipoPais = data;
        });
        this.personaService.getTipoDocumento().subscribe((data: any) => {
            this.TipoDocumento = data;
        });
        this.personaService.getTipoGenero().subscribe((data: any) => {
            this.TipoGenero = data;
        });
        this.personaService.getTipoEstadoCivil().subscribe((data: any) => {
            this.TipoEstadoCivil = data;
        });
    }
    ListarPersonas() {
        this.materialService.listarMaterial().subscribe((data: any) => {
            this.Materiales = data;
            console.log("Listar Materiales:", this.Materiales)
        });

    }

    onChangeTipoPais(data: any) {
        this.TipoCiudad = this.TipoCiudadRespaldo;
        this.id = data.value.paisid;
        this.TipoCiudad = this.TipoCiudad.filter(ciudad => ciudad.paisid === this.id);
    }

    modificarPersona(data: Persona) {
        this.persona = { ...data };
        console.log("modificar Persona: ", this.persona);
        this.personaDialog = true;
        this.TipoEstadoCivilSeleccionado = new TipoEstadoCivil(this.persona.perestcivil, this.persona.estadocivilnombre);
        this.TipoGeneroSeleccionado = new TipoGenero(this.persona.pergenero, this.persona.generonombre);
        this.TipoDocumentoSeleccionado = new TipoDocumento(this.persona.pertipodoc, this.persona.tipodocnombre);
        this.TipoPaisSeleccionado = new TipoPais(this.persona.perpais, this.persona.paisnombre);
        this.TipoCiudadSeleccionado = new TipoCiudad(this.persona.perciudad, this.persona.ciudadnombre, this.persona.perpais);
        // console.log("tciudad: ", this.TipoCiudadSeleccionado)
        this.persona.perfecnac = new Date(this.persona.perfecnac);
        this.optionDialog = false;
    }

    enviarFormulario() {
        if (this.optionDialog) {
            this.personaRegistro = { ...this.persona };
            this.personaRegistro.tipo = 1;
            this.personaRegistro.perid = null;
            this.personaRegistro.perfoto = null;
            this.personaRegistro.perusureg = 'ijquenta';
            this.personaRegistro.perestcivil = this.TipoEstadoCivilSeleccionado.estadocivilid;
            this.personaRegistro.pertipodoc = this.TipoDocumentoSeleccionado.tipodocid;
            this.personaRegistro.pergenero = this.TipoGeneroSeleccionado.generoid;
            this.personaRegistro.perpais = this.TipoPaisSeleccionado.paisid;
            this.personaRegistro.perciudad = this.TipoCiudadSeleccionado.ciudadid;
            console.log("personaRegistro: ", this.personaRegistro);
            this.personaService.gestionarPersona(this.personaRegistro).subscribe(
                (data: any) => {
                    console.log("Gestionar Persona: ", data);
                    this.personaDialog = false;
                    this.optionDialog = false;
                    this.messageService.add({ severity: 'success', summary: 'Registro Correcto!', detail: 'La persona se registró correctamente en el sistema.', life: 3000 });
                    this.ListarPersonas();
                },
                (error: any) => {
                    console.error("Error: ", error['message']);
                    this.messageService.add({ severity: 'error', summary: 'Problema', detail: 'Ocurrío un error en el registro de persona, verifique los campos ingresados.', life: 3000 });
                }
            );
        }
        else {
            this.personaRegistro = { ...this.persona };
            this.personaRegistro.tipo = 2;
            this.personaRegistro.perfoto = null;
            this.personaRegistro.perusureg = 'ijquenta';
            this.personaRegistro.perestcivil = this.TipoEstadoCivilSeleccionado.estadocivilid;
            this.personaRegistro.pertipodoc = this.TipoDocumentoSeleccionado.tipodocid;
            this.personaRegistro.pergenero = this.TipoGeneroSeleccionado.generoid;
            this.personaRegistro.perpais = this.TipoPaisSeleccionado.paisid;
            this.personaRegistro.perciudad = this.TipoCiudadSeleccionado.ciudadid;
            console.log("personaRegistro: ", this.personaRegistro);
            this.personaService.gestionarPersona(this.personaRegistro).subscribe(
                (data: any) => {
                    console.log("Gestionar Persona: ", data);
                    this.personaDialog = false;
                    this.optionDialog = false;
                    this.messageService.add({ severity: 'success', summary: 'Registro Correcto!', detail: 'La persona se modificó correctamente en el sistema.', life: 3000 });
                    this.ListarPersonas();
                },
                (error: any) => {
                    console.log("Error: ", error);
                    this.messageService.add({ severity: 'error', summary: 'Problema', detail: 'Ocurrió un error en la modificación de la persona, por favor comuníquese con soporte.', life: 3000 });
                }
            );
        }
    }

    obtenerSeverity(estado: number): string {
        switch (estado) {
            case 1:
                return 'danger';
            case 2:
                return 'success';
            case 3:
                return 'warning';
            default:
                return 'info';
        }
    }
    obtenerDescripcion(estado: number): string {
        switch (estado) {
            case 1:
                return 'Activo';
            case 0:
                return 'Desactivo';
            default:
                return 'Ninguno';
        }
    }

    NuevoPersona() {
        this.persona = new Persona();
        this.TipoPaisSeleccionado = new TipoPais(1, "Ninguno");
        this.TipoCiudadSeleccionado = new TipoCiudad(1, "Ninguno", 1);
        this.TipoEstadoCivilSeleccionado = new TipoEstadoCivil(1, "Ninguno");
        this.TipoGeneroSeleccionado = new TipoGenero(1, "Femenino");
        this.TipoDocumentoSeleccionado = new TipoDocumento(1, "Ninguno");
        this.personaDialog = true;
        this.optionDialog = true;
    }
    eliminarPersona() {
        console.log("eliminarPersona: ", this.persona);
        this.personaRegistro = { ...this.persona };
        this.personaRegistro.tipo = 3;
        this.personaService.gestionarPersona(this.personaRegistro).subscribe(
            (data: any) => {
                console.log("Gestionar Persona: ", data);
                this.eliminarPersonaDialog = false;
                this.optionDialog = false;
                this.messageService.add({ severity: 'success', summary: 'Registro Correcto!', detail: 'La persona se elimino correctamente en el sistema.', life: 3000 });
                this.ListarPersonas();
            }),
            (error: any) => {
                console.log("Error: ", error);
                this.messageService.add({ severity: 'error', summary: 'Algo salio mal!', detail: 'Ocurrio un error en la eliminación de , porfavor comunicarse con soporte.', life: 3000 });
            }
    }

    confirmarEliminar(data: any) {
        this.persona = { ...data };
        this.eliminarPersonaDialog = true;
    }
    hideDialog() {
        this.personaDialog = false;
        this.submitted = false;
        this.deleteProductDialog = false;
    }

    ocultarDialog() {
        this.personaDialog = false;


    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }
}
