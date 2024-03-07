import { Component, OnInit } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
// Modelos
import { Rol } from 'src/app/modules/models/rol';
import { Usuario } from 'src/app/modules/models/usuario';

// Services
import { RolService } from 'src/app/modules/service/data/rol.service';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioService } from 'src/app/modules/service/data/usuario.service';
import { MessageService } from 'primeng/api';
import { FechaService } from 'src/app/modules/service/data/fecha.service';

@Component({
    templateUrl: './usuario-roles.component.html',
    providers: [MessageService],
    styleUrls: ['./usuario-roles.component.css']
})

export class UsuarioRolesComponent implements OnInit {
    roles: Rol[] = [];
    rol: Rol;
    rolRegistro: Rol;
    optionRol: boolean = false;
    roldialog: boolean = false;
    eliminarRolDialog: boolean = false;
    errors: any;
    rolNuevoDialog: boolean = false;
    rolModificarDialog: boolean = false;
    submitted: boolean = false;
    usuario: Usuario;
    loading: boolean = false;
    rowsPerPageOptions = [5, 10, 20];

    constructor(
        public usuarioService: UsuarioService,
        private messageService: MessageService,
        public rolService: RolService,
        private authService: AuthService,
        public fechaService: FechaService
    ) {}

    ngOnInit() {
        this.ListarRoles(); // Listado de todos los roles
        this.authService.getPerfil().subscribe(user => {
            this.usuario = user[0]; // Obteniendo todos los datos del usuario logeado
        })
        this.loading = true;
    }

    ListarRoles() {
        this.rolService.getListarRoles().subscribe((data: any) => {
        //   console.log(data)
          this.roles = data.map(rol => {
            return {
              ...rol,
              rolfecreg: this.fechaService.formatearFecha(new Date(rol.rolfecreg)),
              rolfecmod: this.fechaService.formatearFecha(new Date(rol.rolfecmod)),
            };
          });
          this.loading = false;
        });

      }

    registroRol(){
        if(this.optionRol){
            this.rolRegistro = { ...this.rol };
            this.rolRegistro.tipo = 1; // tipo 1, creación de rol
            this.rolRegistro.rolid = null;
            this.rolRegistro.rolestado = 1;
            this.rolRegistro.rolusureg = this.usuario.usuname;
            this.rolRegistro.rolnombre = this.rolRegistro.rolnombre?.trim();
            this.rolRegistro.roldescripcion = this.rolRegistro.roldescripcion?.trim();
                if((this.rolRegistro.rolnombre != null && this.rolRegistro.roldescripcion == null) || (this.rolRegistro.rolnombre == null && this.rolRegistro.roldescripcion != null) || (this.rolRegistro.rolnombre == null && this.rolRegistro.roldescripcion == null)){
                    this.messageService.add({
                        severity: 'warn',
                        summary: 'Advertencia',
                        detail: 'Por favor, complete todos los campos requeridos marcados con (*) antes de continuar. Asegúrese de proporcionar la información necesaria para el registro.',
                        life: 5000
                    });
                }
                else {
                    if(this.rolRegistro.rolnombre != null && this.rolRegistro.roldescripcion != null && this.rolRegistro.rolnombre.length > 0 && this.rolRegistro.roldescripcion.length > 0) {
                        this.loading = true;
                        this.rolService.gestionarRol(this.rolRegistro).subscribe(
                            (result: any) => {
                                this.messageService.add({
                                    severity: 'success',
                                    summary: 'Registro Exitoso',
                                    detail: 'El rol se ha registrado correctamente en el sistema. Ahora está disponible para su uso según los permisos asignados.',
                                    life: 3000
                                });
                                this.roldialog = false;
                                this.optionRol = false;
                                this.ListarRoles();
                                this.loading = false;
                            },
                            (error) => {
                                this.errors = error;
                                console.log('error', error);
                                this.messageService.add({
                                    severity: 'error',
                                    summary: 'Error en el Registro',
                                    detail: 'Se ha producido un error al intentar registrar el rol. Por favor, verifica la información ingresada e intenta nuevamente. Si el problema persiste, contacta al soporte técnico para obtener asistencia.',
                                    life: 5000
                                });
                                this.loading = false;
                            }
                        );
                    }
                    else{
                        this.messageService.add({
                            severity: 'info',
                            summary: 'Advertencia',
                            detail: 'Por favor, complete todos los campos con datos válidos antes de continuar. Verifique la información ingresada y asegúrese de proporcionar la información requerida.',
                            life: 5000
                          });
                    }
                }
        }else{
            if (this.rol.rolnombre.trim().length > 0) {
                this.rolRegistro = { ...this.rol };
                this.rolRegistro.tipo = 2; // tipo 2, modificación de rol
                this.rolRegistro.rolestado = 1;
                this.rolRegistro.rolusureg = this.usuario.usuname;
                this.loading = true;
                this.rolService.gestionarRol(this.rolRegistro).subscribe(
                    (result: any) => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Modificación Exitosa',
                            detail: 'El rol se ha modificado correctamente en el sistema. Los cambios han sido actualizados y están ahora disponibles para su uso.',
                            life: 3000
                        });
                        this.roldialog = false;
                        this.optionRol = false;
                        this.ListarRoles();
                        this.loading = false;
                    },
                    (error) => {
                        this.errors = error;
                        console.log('error', error);
                        this.submitted = false;
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error al Modificar Rol',
                            detail: 'Se ha producido un error al intentar modificar el rol. Por favor, verifica la información ingresada e inténtalo nuevamente. Si el problema persiste, contacta al soporte técnico.',
                            life: 5000
                        });
                        this.loading = false;
                    }
                );
            } else {
                this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Ingrese un nombre válido.', life: 5000 });
            }
        }
    }

    NuevoRol() {
        this.rol = new Rol();
        this.submitted = false;
        this.roldialog = true;
        this.optionRol = true;
    }

    modificarRol(data: Rol) {
        this.rol = { ...data };
        this.roldialog = true;
        this.optionRol = false;
    }

    eliminarRol(data: Rol){
        this.rolRegistro = { ...data };
        this.rolRegistro.tipo = 3; // tipo 3, eliminar rol
        this.eliminarRolDialog = true;
    }

    confirmarEliminar() {
      this.loading = true;
      this.rolService.gestionarRol(this.rolRegistro).subscribe(
          (result: any) => {
              // Mensaje de éxito al eliminar un rol
              this.messageService.add({
                  severity: 'success',
                  summary: 'Eliminación Exitosa',
                  detail: 'El rol se ha eliminado correctamente del sistema. Cualquier acción relacionada con este rol ha sido completada con éxito.',
                  life: 3000
              });
              this.eliminarRolDialog = false;
              this.ListarRoles();
              this.loading = false;
          },
          (error) => {
              this.errors = error;
              console.log('error', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Error al Eliminar Rol',
                detail: 'Se ha producido un error al intentar eliminar el rol. Por favor, revisa si existen dependencias o inténtalo de nuevo más tarde.',
                life: 5000
              });
          }
      );
    }

    ocultarDialog() {
        this.rolNuevoDialog = false;
        this.roldialog = false;
        this.rolModificarDialog = false;
        this.submitted = false;
        this.eliminarRolDialog = false;
        this.rol = new Rol();
    }

    onDescriptionChange(newValue: string) {
        this.rol.roldescripcion = newValue;
    }

    onNameChange(newValue: string) {
        this.rol.rolnombre = newValue;
    }

    obtenerSeverity(estado: number): string {
        switch (estado) {
            case 1:
                return 'warning';
            case 0:
                return 'danger';
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
}
