import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
// Services
import { UsuarioService } from 'src/app/modules/service/data/usuario.service';
import { ReporteService } from 'src/app/modules/service/data/reporte.service';
// Models
import { Usuarios } from 'src/app/modules/models/usuarios';
import { Usuario,  } from 'src/app/modules/models/usuario';
import { TipoPersona, TipoPersona2, TipoRol } from 'src/app/modules/models/diccionario';
import { AuthService } from 'src/app/services/auth.service';
// For validations
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    templateUrl: './usuario-crud.component.html',
    providers: [MessageService],
    styleUrls: ['./usuario-crud.component.css']
})
export class UsuarioCrudComponent implements OnInit {

    // --------- Tipo Persona ---------
    tipoPersona: TipoPersona2[] = [];
    tipoPersonaSeleccionada:  TipoPersona2;
    loading: boolean = false;
    usuarios: Usuario[] = [];
    usuario: Usuario;
    datosUsuario: Usuario;
    usuarioRegistro: Usuario;
    usuarioDialog: boolean = false;
    optionDialog: boolean = false;
    // --------- Tipo Rol ---------
    tipoRol: TipoRol[] = [];
    tipoRolSeleccionada: TipoRol;
    // --------- Variables any ---------
    errors: any;
    eliminarUsuarioDialog: boolean = false;
    rowsPerPageOptions = [5, 10, 20];
    // --------- Variables for Dataview ---------
    sortOrder: number = 0;
    sortField: string = '';
    filteredUsuarios: any[] = [];
    searchText: string = '';
    items: MenuItem[];
    // --------- Variables para validaciones ---------
    usuarioForm: FormGroup;

    constructor(
                private messageService: MessageService,
                private usuarioService: UsuarioService,
                private authService: AuthService,
                public reporte: ReporteService,
                private formBuilder: FormBuilder
                )
                {}
    ngOnInit() {
        this.loading = true;
        this.listarUsuarios();
        this.listarPersonaCombo();
        this.listarRolCombo();
        this.obtenerDatosUsuario();
        this.usuarioForm = this.formBuilder.group({
            uf_id: [''],
            uf_usuname: ['', Validators.required],
            uf_tipPerSel: ['', Validators.required],
            uf_tipRolSel: ['', Validators.required],
            uf_email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
            uf_descripcion: ['']
        })
    }
    listarRolCombo() {
        this.usuarioService.getRoles().subscribe(
            (result: any) => {
                this.tipoRol = result;
            }
        )
    }
    obtenerDatosUsuario() {
        this.authService.usuario$.subscribe((user => {
            if (user) {
                if (Array.isArray(user) && user.length > 0) {
                    this.datosUsuario = user[0];
                }
            }
        }));
    }

    listarPersonaCombo(){
        this.usuarioService.getTipoPersona().subscribe(
            (result: any) => {
                this.tipoPersona = result;
            }
        )
    }

    filterUsuarios(){
        this.filteredUsuarios = this.usuarios.filter(usuario => usuario.pernomcompleto.toLowerCase().includes(this.searchText.toLowerCase()));
    }

    listarUsuarios(){
        this.usuarioService.listaUsuario().subscribe(
            (result: any) => {
                this.usuarios = result;
                this.filteredUsuarios = this.usuarios;
                this.loading = false;
            }
        )
    }

    nuevaPersona() {
        this.usuario = new Usuario();
        this.usuarioRegistro = new Usuario();
        this.tipoPersonaSeleccionada = null;
        this.tipoRolSeleccionada = null;
        this.usuarioDialog = true;
        this.optionDialog = true;
        this.usuarioForm.reset();
    }

    editarUsuario(data: Usuario){
        this.usuario = { ...data };
        this.usuarioDialog = true;
        this.optionDialog = false;
        this.usuarioForm.patchValue({
            uf_id: this.usuario.usuid,
            uf_usuname: this.usuario.usuname,
            uf_tipPerSel: new TipoPersona2(this.usuario.perid, this.usuario.pernomcompleto, this.usuario.pernrodoc, this.usuario.perfoto),
            uf_tipRolSel: new TipoRol(this.usuario.rolid, this.usuario.rolnombre),
            uf_email: this.usuario.usuemail,
            uf_descripcion: this.usuario.usudescripcion
        })
    }

    eliminarUsuario(data: Usuario){
        this.eliminarUsuarioDialog = true;
        this.usuario = { ...data };
    }

    confirmarEliminar() {
        this.usuarioRegistro = new Usuario();
        this.usuarioRegistro = { ...this.usuario};
        this.usuarioRegistro.tipo = 3;
        this.usuarioRegistro.usuimagen = null;
        this.usuarioRegistro.usuusureg = this.datosUsuario.usuname;
        this.usuarioRegistro.usupassword = "";
        this.usuarioRegistro.usupasswordhash = "";
        this.usuarioService.gestionarUsuario(this.usuarioRegistro).subscribe(
            (result: any) => {
                this.messageService.add({ severity: 'success', summary: 'Proceso realizado correctamente', detail: 'Usuario Eliminado.', life: 3000});
                this.eliminarUsuarioDialog = false;
                this.listarUsuarios();
            },
            (error) => {
                this.errors = error;
                this.messageService.add({ severity: 'error', summary: 'Error de proceso', detail: 'Se produjo un error al intentar eliminar el usuario.', life: 3000});
            }
        )
    }

    ocultarDialog(){
        this.usuarioDialog = false;
    }

    enviarFormulario(){
        if (this.optionDialog) {
            if(this.usuarioForm.invalid){
                this.messageService.add({ severity: 'error', summary: 'Error en el Registro', detail: 'Por favor, verifica la información ingresada e intenta nuevamente.', life: 3000 });
                return Object.values(this.usuarioForm.controls).forEach(control=>{
                    control.markAllAsTouched();
                    control.markAsDirty();
                })
            }
            this.usuarioRegistro = new Usuario();
            this.usuarioRegistro.tipo = 1;
            this.usuarioRegistro.usuid = null;
            this.usuarioRegistro.perid = this.usuarioForm.value.uf_tipPerSel.perid;
            this.usuarioRegistro.rolid = this.usuarioForm.value.uf_tipRolSel.rolid;
            this.usuarioRegistro.usuname = this.usuarioForm.value.uf_usuname;
            this.usuarioRegistro.usuemail = this.usuarioForm.value.uf_email;
            this.usuarioRegistro.usuimagen = null;
            this.usuarioRegistro.usuestado = 1;
            this.usuarioRegistro.usuusureg = this.datosUsuario.usuname;
            this.usuarioRegistro.usudescripcion = this.usuarioForm.value.uf_descripcion;
            this.usuarioService.gestionarUsuario(this.usuarioRegistro).subscribe(
                (result: any) => {
                    this.messageService.add({ severity: 'success', summary: 'Exitosamente', detail: 'Proceso realizado correctamente.', life: 3000});
                    this.optionDialog = false;
                    this.usuarioDialog = false;
                    this.listarUsuarios();
                },
                (error) => {
                    this.errors = error;
                    this.messageService.add({ severity: 'error', summary: 'Error en el Registro', detail: 'Se produjo un error al intentar registrar el usuario.', life: 3000});
                }
            )
        }
        else{
            this.usuarioRegistro = new Usuario();
            this.usuarioRegistro.tipo = 2;
            this.usuarioRegistro.usuid = this.usuarioForm.value.uf_id;
            this.usuarioRegistro.usuname = this.usuarioForm.value.uf_usuname;
            this.usuarioRegistro.usuemail = this.usuarioForm.value.uf_email;
            this.usuarioRegistro.perid = this.usuarioForm.value.uf_tipPerSel.perid;
            this.usuarioRegistro.rolid = this.usuarioForm.value.uf_tipRolSel.rolid;
            this.usuarioRegistro.usuimagen = null;
            this.usuarioRegistro.usuestado = 1;
            this.usuarioRegistro.usuusureg = this.datosUsuario.usuname;
            this.usuarioRegistro.usudescripcion = this.usuarioForm.value.uf_descripcion;
            this.usuarioService.gestionarUsuario(this.usuarioRegistro).subscribe(
                (result: any) => {
                    this.messageService.add({ severity: 'success', summary: 'Exitosamente', detail: 'Proceso de modificado realizado correctamente.', life: 3000});
                    this.optionDialog = false;
                    this.usuarioDialog = false;
                    this.listarUsuarios();
                },
                (error) => {
                    this.errors = error;
                    this.messageService.add({ severity: 'error', summary: 'Error en el Registro', detail: 'Se produjo un error al intentar modificar el usuario.', life: 3000});
                }
            )
        }
    }
}
