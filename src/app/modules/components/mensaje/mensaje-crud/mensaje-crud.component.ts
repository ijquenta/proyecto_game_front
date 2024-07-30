import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
// Service
import { UsuarioService } from 'src/app/modules/service/data/usuario.service';
// Modelos
import { Persona } from 'src/app/modules/models/persona';
import { TipoPais, TipoCiudad, TipoEstadoCivil, TipoGenero, TipoDocumento } from 'src/app/modules/models/diccionario';
import { PersonaService } from 'src/app/modules/service/data/persona.service';
import { EstudianteService } from 'src/app/modules/service/data/estudiante.service';
import { DocenteService } from 'src/app/modules/service/data/docente.service';
import { Usuario } from 'src/app/modules/models/usuario';

@Component({
    templateUrl: './mensaje-crud.component.html',
    providers: [MessageService],
})
export class MensajeCrudComponent implements OnInit {
    Personas: Persona[] = [];
    Estudiantes: Persona[] = [];
    persona: Persona;
    usuario: Usuario;
    usuarioRegistro: Usuario;
    personaRegistro: Persona;
    estudianteModificarDialog: boolean = false;
    nuevopassword: any;
    nuevousuname: any;

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
    estudianteDialog: boolean = false;
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

    regPerDialog: boolean = true;
    regUsuDialog: boolean = false;

    usuname: string = '';
    usuemail: string = '';
    usupassword: string = '';
    usupasswordhash: string = '';

    constructor(
        public usuarioService: UsuarioService,
        private messageService: MessageService,
        public personaService: PersonaService,
        public estudianteService: EstudianteService,
        public docenteService: DocenteService
    ) {

    }

    ngOnInit() {
        this.ListarPersonas();
        this.ListarEstudiantes();
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
        this.personaService.getPersons().subscribe((data: any) => {
            this.Personas = data;
        });
    }
    ListarEstudiantes() {
        this.docenteService.listarDocente().subscribe((data: any) => {
            this.Estudiantes = data;
            // console.log("Estudiantes", this.Estudiantes)
        });
    }

    onChangeTipoPais(data: any) {
        this.TipoCiudad = this.TipoCiudadRespaldo;
        this.id = data.value.paisid;
        this.TipoCiudad = this.TipoCiudad.filter(ciudad => ciudad.paisid === this.id);
    }

    modificarPersona(data: Persona) {
        this.persona = { ...data };
        this.estudianteModificarDialog = true;
    }

    enviarFormulario() {
        if (this.optionDialog) {
            this.personaRegistro = { ...this.persona };
            this.personaRegistro.tipo = 1;
            this.personaRegistro.perid = null;
            this.personaRegistro.perfoto = null;
            this.personaRegistro.perusureg = this.usuario.usuname;;
            this.personaRegistro.perestcivil = this.TipoEstadoCivilSeleccionado.estadocivilid;
            this.personaRegistro.pertipodoc = this.TipoDocumentoSeleccionado.tipodocid;
            this.personaRegistro.pergenero = this.TipoGeneroSeleccionado.generoid;
            this.personaRegistro.perpais = this.TipoPaisSeleccionado.paisid;
            this.personaRegistro.perciudad = this.TipoCiudadSeleccionado.ciudadid;
            // console.log("personaRegistro: ", this.personaRegistro);
            this.personaService.managePerson(this.personaRegistro).subscribe(
                (data: any) => {
                    // console.log("Gestionar Persona: ", data);
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
            this.personaRegistro.perusureg = this.usuario.usuname;;
            this.personaRegistro.perestcivil = this.TipoEstadoCivilSeleccionado.estadocivilid;
            this.personaRegistro.pertipodoc = this.TipoDocumentoSeleccionado.tipodocid;
            this.personaRegistro.pergenero = this.TipoGeneroSeleccionado.generoid;
            this.personaRegistro.perpais = this.TipoPaisSeleccionado.paisid;
            this.personaRegistro.perciudad = this.TipoCiudadSeleccionado.ciudadid;
            // console.log("personaRegistro: ", this.personaRegistro);
            this.personaService.managePerson(this.personaRegistro).subscribe(
                (data: any) => {
                    // console.log("Gestionar Persona: ", data);
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

    NuevoEstudiante() {
        this.persona = new Persona();
        this.usuario = new Usuario();
        this.usuario.usuname = '';
        this.TipoPaisSeleccionado = new TipoPais(1, "Ninguno");
        this.TipoCiudadSeleccionado = new TipoCiudad(1, "Ninguno", 1);
        this.TipoEstadoCivilSeleccionado = new TipoEstadoCivil(1, "Ninguno");
        this.TipoGeneroSeleccionado = new TipoGenero(1, "Femenino");
        this.TipoDocumentoSeleccionado = new TipoDocumento(1, "Ninguno");
        this.estudianteDialog = true;
        this.optionDialog = true;
    }
    NuevoEstudiantePersona() {
        this.persona = new Persona();
        this.usuario = new Usuario();
        this.optionDialog = true;
    }
    eliminarPersona() {
        // console.log("eliminarPersona: ", this.persona);
        this.personaRegistro = { ...this.persona };
        this.personaRegistro.tipo = 3;
        this.personaService.managePerson(this.personaRegistro).subscribe(
            (data: any) => {
                // console.log("Gestionar Persona: ", data);
                this.eliminarPersonaDialog = false;
                this.optionDialog = false;
                this.messageService.add({ severity: 'success', summary: 'Registro Correcto!', detail: 'La persona se elimino correctamente en el sistema.', life: 3000 });
                this.ListarPersonas();
            },
            (error: any) => {
                console.log("Error: ", error);
                this.messageService.add({ severity: 'error', summary: 'Algo salio mal!', detail: 'Ocurrio un error en la eliminación de , porfavor comunicarse con soporte.', life: 3000 });
            });
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
        this.regPerDialog = true;
        this.regUsuDialog = false;
        this.estudianteDialog = false;
        this.estudianteModificarDialog = false;
        this.nuevousuname = null;
        this.nuevopassword = null;

    }
    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }
    mostrarDatosPersonales() {
        this.regPerDialog = true;
        this.regUsuDialog = false;
        this.estudianteDialog = true;
    }
    enviarFormularioUsuario() {
        this.personaRegistro = { ...this.persona};
        // console.log("antes: ", this.persona)
        this.personaRegistro.perid = null;
        this.personaRegistro.perfoto = null;
        this.personaRegistro.perusureg = this.usuario.usuname;;
        this.personaRegistro.perestcivil = this.TipoEstadoCivilSeleccionado.estadocivilid;
        this.personaRegistro.pertipodoc = this.TipoDocumentoSeleccionado.tipodocid;
        this.personaRegistro.pergenero = this.TipoGeneroSeleccionado.generoid;
        this.personaRegistro.perpais = this.TipoPaisSeleccionado.paisid;
        this.personaRegistro.perciudad = this.TipoCiudadSeleccionado.ciudadid;
        // console.log("personaRegistro: ", this.personaRegistro);
        this.personaService.createPersonForm(this.personaRegistro).subscribe(
            (data : any) =>{
                // console.log("Registrar Persona: ", data);
                this.usuario = new Usuario();
                const idper = {
                    perid : data['valor']
                }
                this.usuario.perid = data['valor'];
                // console.log("idpersona: ", this.usuario);
                this.optionDialog = false;
                this.usuario.rolid = 4;
                this.usuario.usupassword = this.personaRegistro.pernrodoc;
                this.usuario.usupasswordhash = this.personaRegistro.pernrodoc;
                this.usuario.usuname = this.personaRegistro.pernrodoc;
                this.usuario.usuemail = this.personaRegistro.peremail;
                this.usuario.tipo = 1;
                this.usuario.usuusureg = this.usuario.usuname;;
                this.usuario.usudescripcion = 'Registro login';
                this.usuario.usuestado = 1;
                this.usuario.perid = idper.perid;
                // console.log("usuarioRegistro: ", this.usuario);
                this.usuarioService.gestionarUsuario(this.usuario).subscribe(
                    (data : any) =>{
                        // console.log("Registrar Usuario: ", data);
                        this.messageService.add({ severity: 'success', summary: 'Registro Correcto!', detail: 'El Usuario se registro correctamente en el sistema.', life: 3000 });
                        this.regPerDialog = false;
                        this.regUsuDialog = false;
                        this.estudianteDialog = false;
                        this.ListarEstudiantes();
                    }),
                    (error: any)=>{
                        console.log("Error: ", error);
                        this.messageService.add({ severity: 'error', summary: 'Algo salio mal!', detail: 'Ocurrio un error en el registro de usuario nuevo, porfavor comunicarse con soporte.', life: 3000 });
                }
            }),
            (error: any)=>{
                console.log("Error: ", error);
                this.messageService.add({ severity: 'error', summary: 'Algo salio mal!', detail: 'Ocurrio un error en el registro de persona nueva, porfavor comunicarse con soporte.', life: 3000 });
        }
    }

    modificarEstudiante(data: Persona) {
        this.persona = { ...data }
        this.estudianteModificarDialog = true;
        this.nuevousuname = this.persona.usuname;
        // console.log("Modificar Estudiante", this.persona)
    }

    mostrarDatosUsuario() {
      this.regPerDialog = false;
      this.regUsuDialog = true;
      this.estudianteDialog = true;
    }
    guardarDatosUsuario(){
        this.enviarFormularioUsuario();


    }
    modificarUsuario(){
        this.usuarioRegistro = new Usuario();

        if(this.nuevopassword){
            this.usuarioRegistro.tipo = 4;
            this.usuarioRegistro.usuid = this.persona.usuid;
            this.usuarioRegistro.usuname = this.nuevousuname;
            this.usuarioRegistro.usupassword = this.nuevopassword;
            this.usuarioRegistro.usupasswordhash = this.nuevopassword;
            this.usuarioRegistro.usudescripcion  = 'Cambio de contraseña';
            // console.log("con pass")

        }
        else {
            this.usuarioRegistro.tipo = 5;
            this.usuarioRegistro.usuid = this.persona.usuid;
            this.usuarioRegistro.usuname = this.nuevousuname;
            this.usuarioRegistro.usudescripcion  = 'Cambio de nombre de usuario';
        }
        this.usuarioService.gestionarUsuario(this.usuarioRegistro).subscribe(
                (data : any) =>{
                    // console.log("usuarioRegistro: ", this.usuarioRegistro);
                    this.messageService.add({ severity: 'success', summary: 'Registro Correcto!', detail: 'El estudiante se modifico correctamente en el sistema.', life: 3000 });
                    this.estudianteModificarDialog = false;
                    this.nuevousuname = null;
                    this.nuevopassword = null;
                    this.ListarEstudiantes();
                },
                (error: any)=>{
                    console.log("Error: ", error);
                    this.messageService.add({ severity: 'error', summary: 'Algo salio mal!', detail: 'Ocurrio un error en el registro de usuario nuevo, porfavor comunicarse con soporte.', life: 3000 });
                });
    }
}
