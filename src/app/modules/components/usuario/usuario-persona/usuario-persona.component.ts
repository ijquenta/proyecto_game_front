import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';


// Service
import { UsuarioService } from 'src/app/modules/service/data/usuario.service';
// Modelos
import { Persona } from 'src/app/modules/models/persona';
import { TipoPais, TipoCiudad, TipoEstadoCivil, TipoGenero, TipoDocumento } from 'src/app/modules/models/diccionario';
import { PersonaService } from 'src/app/modules/service/data/persona.service';


@Component({
    templateUrl: './usuario-persona.component.html',
    providers: [MessageService],
})
export class UsuarioPersonaComponent implements OnInit {
    Personas: Persona[] = [];
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

    // lRol: Rol[] = [];
    // role: {};
    // rol_nuevo: Rol[] = [];
    // role_eli: {};
    errors: any;
    personaDialog: boolean = false;
    optionDialog: boolean = false;

    rolModificarDialog: boolean = false;
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
        public personaService: PersonaService
    ) {
        // this.TipoPaisSeleccionado = new TipoPais(1,"Ninguno");
        // this.TipoCiudadSeleccionado = new TipoCiudad(1,"Ninguno", 1);
        // this.TipoEstadoCivilSeleccionado = new TipoEstadoCivil(1,"Ninguno");
        // this.TipoGeneroSeleccionado = new TipoGenero(1,"Femenino");
        // this.TipoDocumentoSeleccionado = new TipoDocumento(1,"Ninguno");
    }

    ngOnInit() {
        // console.log('ngOnInit-->');
        this.ListarPersonas();
        this.LlenarTipoCombo();

        this.statuses = [
            { label: 'Activo', value: 0 },
            { label: 'Inactivo', value: 1 },
        ];
    }

    LlenarTipoCombo(){
        this.personaService.getTipoCiudad().subscribe((data: any) => {
            this.TipoCiudad = data;
            this.TipoCiudadRespaldo = data;
            // console.log('Ciudad: ', this.TipoCiudad);
        });
        this.personaService.getTipoPais().subscribe((data: any) => {
            this.TipoPais = data;
            // console.log('Pais: ', this.TipoPais);
        });
        this.personaService.getTipoDocumento().subscribe((data: any) => {
            this.TipoDocumento = data;
            // console.log('Documento: ', this.TipoDocumento);
        });
        this.personaService.getTipoGenero().subscribe((data: any) => {
            this.TipoGenero = data;
            // console.log('Genero: ', this.TipoGenero);
        });
        this.personaService.getTipoEstadoCivil().subscribe((data: any) => {
            this.TipoEstadoCivil = data;
            // console.log('EstadoCivil: ', this.TipoEstadoCivil);
        });
    }
    ListarPersonas() {
        this.personaService.ListarPersona().subscribe((data: any) => {
            this.Personas = data;
            // console.log('Personas->', this.Personas);
        });
    }
    id: any;
    onChangeTipoPais(data: any){
        this.TipoCiudad = this.TipoCiudadRespaldo;
        // console.log("Datos del Pais: ", data.value);
        this.id = data.value.paisid;
        this.TipoCiudad = this.TipoCiudad.filter(ciudad => ciudad.paisid === this.id);
        // console.log("Filtro: ", this.TipoCiudad);
    }
    /*
    CrearRol(rol_nombre: any, rol_descripcion: any) {
        if (
            !rol_nombre ||
            !rol_descripcion ||
            !rol_nombre.trim() ||
            !rol_descripcion.trim()
        ) {
            this.submitted = true;
            console.log(this.submitted, 'VOOL.-->', rol_nombre.trim().length);
            return;
        } else {
            this.submitted = false;
            let registroRol = new Rol();
            registroRol.rolNombre = rol_nombre;
            registroRol.rolDescripcion = rol_descripcion;
            registroRol.rolUsuReg = 'Administrador';
            this.usuarioService.crearRol(registroRol).subscribe(
                (result: any) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Registro Exitoso',
                        detail: 'El rol se registró correctamente en el sistema.',
                        life: 3000,
                    });
                    console.log(result);
                    this.hideDialog();
                    this.ListarRoles();
                },
                (error) => {
                    this.errors = error;
                    console.log('error', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error en el Registro',
                        detail: 'Se produjo un error al intentar registrar el rol. Por favor, inténtalo de nuevo.',
                        life: 5000,
                    });
                }
            );
        }
    }
    */


    modificarPersona(data: Persona) {
        this.persona = { ...data };
        this.personaDialog = true;
        this.TipoEstadoCivilSeleccionado = new TipoEstadoCivil(this.persona.perestcivil, this.persona.estadocivilnombre);
        this.TipoGeneroSeleccionado = new TipoGenero(this.persona.pergenero, this.persona.generonombre);
        this.TipoDocumentoSeleccionado = new TipoDocumento(this.persona.pertipodoc, this.persona.tipodocnombre);
        this.TipoCiudadSeleccionado = new TipoCiudad(this.persona.perciudad, this.persona.ciudadnombre, this.persona.perpais);
        this.TipoPaisSeleccionado = new TipoPais(this.persona.perpais, this.persona.paisnombre);
        this.persona.perfecnac = new Date(this.persona.perfecnac);
    }



    enviarFormulario() {

        if(this.optionDialog){
            // console.log("TipoCuidadSeleccionado: ", this.TipoCiudadSeleccionado);
            // console.log("TipoPaisSeleccionado: ", this.TipoPaisSeleccionado);
            // console.log("TipoGeneroSeleccionado: ", this.TipoGeneroSeleccionado);
            // console.log("TipoDocumentoSeleccionado: ", this.TipoDocumentoSeleccionado);
            // console.log("TipoEstadoCivilSeleccionado: ", this.TipoEstadoCivilSeleccionado);
            // console.log("this.enviarFormulario: ", this.persona);
            this.personaRegistro = { ...this.persona};
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
                (data : any) =>{
                    console.log("Gestionar Persona: ", data);
                    this.personaDialog = false;
                    this.optionDialog = false;
                    this.messageService.add({ severity: 'success', summary: 'Registro Correcto!', detail: 'La persona se registro correctamente en el sistema.', life: 3000 });
                    this.ListarPersonas();
                }),
                (error: any)=>{
                    console.log("Error: ", error);
                    this.messageService.add({ severity: 'error', summary: 'Algo salio mal!', detail: 'Ocurrio un error en el registro de persona nueva, porfavor comunicarse con soporte.', life: 3000 });
            }
        }
        else{
            this.personaRegistro = { ...this.persona};
            this.personaRegistro.tipo = 2;
            // this.personaRegistro.perid = null;
            this.personaRegistro.perfoto = null;
            this.personaRegistro.perusureg = 'ijquenta';
            this.personaRegistro.perestcivil = this.TipoEstadoCivilSeleccionado.estadocivilid;
            this.personaRegistro.pertipodoc = this.TipoDocumentoSeleccionado.tipodocid;
            this.personaRegistro.pergenero = this.TipoGeneroSeleccionado.generoid;
            this.personaRegistro.perpais = this.TipoPaisSeleccionado.paisid;
            this.personaRegistro.perciudad = this.TipoCiudadSeleccionado.ciudadid;
            console.log("personaRegistro: ", this.personaRegistro);
            this.personaService.gestionarPersona(this.personaRegistro).subscribe(
                (data : any) =>{
                    console.log("Gestionar Persona: ", data);
                    this.personaDialog = false;
                    this.optionDialog = false;
                    this.messageService.add({ severity: 'success', summary: 'Registro Correcto!', detail: 'La persona se modifico correctamente en el sistema.', life: 3000 });
                    this.ListarPersonas();
                }),
                (error: any)=>{
                    console.log("Error: ", error);
                    this.messageService.add({ severity: 'error', summary: 'Algo salio mal!', detail: 'Ocurrio un error en el registro de persona nueva, porfavor comunicarse con soporte.', life: 3000 });
            }
        }

        /*

        }*/
        // if (!datosRolMod.rolnombre || !datosRolMod.roldescripcion) {
        //     this.camposVacios = true;
        //     return;
        // }
        // this.camposVacios = false;
        // let registroModRol = new Rol();
        // registroModRol.rolId = datosRolMod.rolid;
        // registroModRol.rolNombre = datosRolMod.rolnombre;
        // registroModRol.rolDescripcion = datosRolMod.roldescripcion;
        // registroModRol.rolUsuReg = 'Usu Modddd';

        // this.usuarioService
        //     .modificarRol(datosRolMod)
        //     .subscribe((result: any) => {
        //         this.messageService.add({
        //             severity: 'success',
        //             summary: 'Modificación Exitosa',
        //             detail: 'El rol se modificó correctamente en el sistema.',
        //             life: 3000,
        //         });
        //         console.log(result);
        //         this.hideDialog();
        //         this.ListarRoles();
        //     });


        // this.hideDialog();
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
                return 'info'; // Valor predeterminado si el estado no coincide con 1 o 0
        }
    }
    obtenerDescripcion(estado: number): string {
        switch (estado) {
            case 1:
                return 'Activo';
            case 0:
                return 'Desactivo';
            default:
                return 'Ninguno'; // Valor predeterminado si el estado no coincide con 1 o 0
        }
    }

    NuevoPersona() {
        this.persona = new Persona();
        this.TipoPaisSeleccionado = new TipoPais(1,"Ninguno");
        this.TipoCiudadSeleccionado = new TipoCiudad(1,"Ninguno", 1);
        this.TipoEstadoCivilSeleccionado = new TipoEstadoCivil(1,"Ninguno");
        this.TipoGeneroSeleccionado = new TipoGenero(1,"Femenino");
        this.TipoDocumentoSeleccionado = new TipoDocumento(1,"Ninguno");
        // this.submitted = false;
        this.personaDialog = true;
        this.optionDialog = true;
    }
    eliminarPersona(){
        console.log("eliminarPersona: ", this.persona);
        this.personaRegistro = { ...this.persona};
        this.personaRegistro.tipo = 3;
        this.personaService.gestionarPersona(this.personaRegistro).subscribe(
            (data : any) =>{
                console.log("Gestionar Persona: ", data);
                this.eliminarPersonaDialog = false;
                this.optionDialog = false;
                this.messageService.add({ severity: 'success', summary: 'Registro Correcto!', detail: 'La persona se elimino correctamente en el sistema.', life: 3000 });
                this.ListarPersonas();
            }),
            (error: any)=>{
                console.log("Error: ", error);
                this.messageService.add({ severity: 'error', summary: 'Algo salio mal!', detail: 'Ocurrio un error en la eliminación de , porfavor comunicarse con soporte.', life: 3000 });
        }
    }
    /*
    deleteProduct(regRol: Rol) {
        console.log('eli>', regRol);
        this.deleteProductDialog = true;
        this.role_eli = { ...regRol };
        console.log('eli->', this.role_eli);
    }*/
    confirmarEliminar(data: any) {
        this.persona = { ...data };
        this.eliminarPersonaDialog = true;
    }
    hideDialog() {
        this.personaDialog = false;
        // this.rolModificarDialog = false;
        this.submitted = false;
        this.deleteProductDialog = false;
        // this.persona_nueva = [];
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
