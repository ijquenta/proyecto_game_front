import { Component, OnInit } from '@angular/core';
// FormBuilder to create form and Validators for validations
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// Modelos
import { Rol } from 'src/app/modules/models/rol';
import { Usuario } from 'src/app/modules/models/usuario';

// Services
import { RolService } from 'src/app/modules/service/data/rol.service';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioService } from 'src/app/modules/service/data/usuario.service';
import { MessageService } from 'primeng/api';
import { FechaService } from 'src/app/modules/service/data/fecha.service';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
    templateUrl: './usuario-roles.component.html',
    providers: [MessageService],
    styleUrls: ['./usuario-roles.component.css']
})

export class UsuarioRolesComponent implements OnInit {

    rolForm: FormGroup;

    roles: Rol[] = [];
    rol: Rol;
    rolRegistro: Rol;
    optionRol: boolean = false;
    roldialog: boolean = false;
    desactivarRolDialog: boolean = false;
    activarRolDialog: boolean = false;
    errors: any;
    rolNuevoDialog: boolean = false;
    rolModificarDialog: boolean = false;
    usuario: Usuario;
    loading: boolean = false;
    rowsPerPageOptions = [5, 10, 20];

    constructor(
        public usuarioService: UsuarioService,
        private messageService: MessageService,
        public rolService: RolService,
        private authService: AuthService,
        public fechaService: FechaService,
        private formBuilder: FormBuilder,
        private spinner: NgxSpinnerService
    ) {

    }

    ngOnInit() {
        this.ListarRoles();
        this.authService.getPerfil().subscribe(user => {
            this.usuario = user[0];
        })
        this.loading = true;

        this.rolForm = this.formBuilder.group({
            idRol: [''],
            nombreRol: ['', [Validators.required, Validators.minLength(5)]],
            descripcionRol: ['', Validators.required],
        });
    }

    ListarRoles() {
        this.spinner.show();
        this.rolService.getListarRoles().subscribe((data: any) => {
          this.roles = data;
          console.log("Roles: ", this.roles)
          this.loading = false;
          this.spinner.hide()
        },
        (error) => {
            console.error(error)
            this.spinner.hide()
        }
        );

      }

    registroRol(){

        if(this.rolForm.invalid){
            this.messageService.add({ key: 'tc',  severity: 'error', summary: 'Error en el Registro', detail: 'Por favor, verifica la información ingresada e intenta nuevamente. Si el problema persiste, contacta al soporte técnico.', life: 5000 });
            return Object.values(this.rolForm.controls).forEach(control=>{
                control.markAllAsTouched();
                control.markAsDirty();
            })

        }
        else{
            if (this.rolForm.valid){
               // aqui si todos los datos son correctos
               if(this.optionRol){
                console.log("rolForm.value",this.rolForm.value);
                this.rolRegistro = new Rol();
                this.rolRegistro.tipo = 1; // tipo 1, creación de rol
                this.rolRegistro.rolid = null;
                this.rolRegistro.rolestado = 1;
                this.rolRegistro.rolusureg = this.usuario.usuname;
                this.rolRegistro.rolnombre = this.rolForm.value.nombreRol;
                this.rolRegistro.roldescripcion = this.rolForm.value.descripcionRol;
                console.log("rolRegistro", this.rolRegistro);
                this.loading = true;
                this.rolService.gestionarRol(this.rolRegistro).subscribe(
                    (result: any) => {
                        this.messageService.add({ key: 'tc',  severity: 'success', summary: 'Registro Exitoso', detail: 'El rol se ha registrado correctamente en el sistema. Ahora está disponible para su uso según los permisos asignados.', life: 3000 });
                        this.roldialog = false;
                        this.optionRol = false;
                        this.ListarRoles();
                        this.loading = false;
                        this.rolForm.reset();
                    },
                    (error) => {
                        this.errors = error;
                        console.log('error', error);
                        this.messageService.add({ key: 'tc',  severity: 'error', summary: 'Error en el Registro', detail: 'Se ha producido un error al intentar registrar el rol. Por favor, verifica la información ingresada e intenta nuevamente. Si el problema persiste, contacta al soporte técnico para obtener asistencia.', life: 5000 });
                        this.loading = false;
                    }
                );
                }
                else {
                    this.rolRegistro = new Rol();
                    this.rolRegistro.tipo = 2; // tipo 2, modificación de rol
                    this.rolRegistro.rolestado = 1;
                    this.rolRegistro.rolusureg = this.usuario.usuname;
                    this.rolRegistro.rolnombre = this.rolForm.value.nombreRol;
                    this.rolRegistro.roldescripcion = this.rolForm.value.descripcionRol;
                    this.rolRegistro.rolid = this.rolForm.value.idRol;
                    this.loading = true;
                    this.rolService.gestionarRol(this.rolRegistro).subscribe(
                        (result: any) => {
                            this.messageService.add({ key: 'tc',  severity: 'success', summary: 'Modificación Exitosa', detail: 'El rol se ha modificado correctamente en el sistema. Los cambios han sido actualizados y están ahora disponibles para su uso.', life: 3000 });
                            this.roldialog = false;
                            this.optionRol = false;
                            this.ListarRoles();
                            this.loading = false;
                        },
                        (error) => {
                            this.errors = error;
                            console.log('error', error);
                            this.messageService.add({key: 'tc', severity: 'error',summary: 'Error al Modificar Rol',detail: 'Se ha producido un error al intentar modificar el rol. Por favor, verifica la información ingresada e inténtalo nuevamente. Si el problema persiste, contacta al soporte técnico.',life: 5000});
                            this.loading = false;
                        }
                    );
                }
            }else{
                // Mensaje de error
                this.messageService.add({key: 'tc', severity: 'warn', summary: 'Advertencia', detail: 'Error en la validación', life: 5000});
            }
        }


    }

    NuevoRol() {
        this.rol = new Rol();
        this.roldialog = true;
        this.optionRol = true;
        this.rolForm.reset();
    }

    modificarRol(data: Rol) {
        this.rol = { ...data };

        this.rolForm.patchValue({
            idRol: this.rol.rolid,
            nombreRol: this.rol.rolnombre,
            descripcionRol: this.rol.roldescripcion
        });

        this.roldialog = true;
        this.optionRol = false;
    }


    desactivarRol(data: Rol){
        this.rolRegistro = { ...data };
        this.rolRegistro.tipo = 2;
        this.desactivarRolDialog = true;
    }

    activarRol(data: Rol){
        this.rolRegistro = { ...data };
        this.rolRegistro.tipo = 3;
        this.activarRolDialog = true;
    }

    confirmarActivarDesactivar() {
      this.loading = true;
      console.log("desactivar: ", this.rolRegistro);
      this.rolService.gestionarRolEstado(this.rolRegistro).subscribe(
          (result: any) => {
              this.messageService.add({ key: 'tc',  severity: 'success', summary: 'Desactivación Exitosa', detail: 'El rol se ha desactivado correctamente del sistema.', life: 3000});
              this.desactivarRolDialog = false;
              this.activarRolDialog = false;
              this.ListarRoles();
              this.loading = false;
          },
          (error) => {
              this.errors = error;
              console.log('error', error);
              this.messageService.add({ key: 'tc',  severity: 'error', summary: 'Error al Desactivar el Rol', detail: 'Se ha producido un error al intentar desactivar el rol.', life: 5000 });
          }
      );
    }

    ocultarDialog() {
        this.rolNuevoDialog = false;
        this.roldialog = false;
        this.rolModificarDialog = false;
        this.desactivarRolDialog = false;
        this.activarRolDialog = false;
        this.rol = new Rol();
        this.rolForm.reset();
    }

    obtenerSeverity(estado: number): string {
        switch (estado) {
            case 1:
                return 'warning';
            case 0:
                return 'danger';
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
}
