// Imports
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, forkJoin, of } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
// Models
import { Usuario } from 'src/app/modules/models/usuario';
import { MenuItem } from 'primeng/api';
import { TipoIcono, TipoRol, TipoSubMenu, TipoMenu } from 'src/app/modules/models/diccionario';
// Serivices
import { AuthService } from 'src/app/modules/service/core/auth.service';
import { UsuarioService } from 'src/app/modules/service/data/usuario.service';
@Component({
    selector: 'usuarios-component',
    templateUrl: './usuarios.component.html',
    providers: [MessageService],
    styleUrls: ['./usuarios.component.css'],

})
export class UsuariosComponent implements OnInit {

    usuarios: Usuario[] = [];
    usuarioForm: FormGroup;
    usuario_dialog: boolean = false;
    rolOptions: any[]; 
    estadoOptions: any[];
    loading: boolean = false;
    usuarioDialog: boolean = false;
    usuarioSeleccionado: Usuario | null = null;



    items: MenuItem[] | undefined;
    home: MenuItem | undefined;

    constructor(
        public usuarioService: UsuarioService,
        private messageService: MessageService,
        private authService: AuthService,
        private formBuilder: FormBuilder,
        private spinner: NgxSpinnerService,
    ) { }

    ngOnInit() {

        this.items = [{ label: 'Administrar' }, { label: 'Usuarios', routerLink: '' },];
        this.home = { icon: 'pi pi-home', routerLink: '/' };

        this.usuarioForm = this.formBuilder.group({
            id_usuario: [null], // Puede ser null o un número
            nombre: ['', [Validators.required]],
            apellido: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]], // Validación de email
            numero_carnet: ['', [Validators.required]],
            telefono: ['', [Validators.required]],
            fecha_nacimiento: ['', [Validators.required]], // Puedes usar un validador de fecha si es necesario
            rol: ['', [Validators.required]],
            fecha_creacion: [{ value: null, disabled: true }], // Deshabilitado si no se debe modificar
            estado: ['', [Validators.required]]
        });

        this.rolOptions = [
            { label: 'Paciente', value: 'paciente' },
            { label: 'Doctor', value: 'doctor' }
        ];

        this.estadoOptions = [
            { label: 'Activo', value: 'activo' },
            { label: 'Inactivo', value: 'inactivo' }
        ];

        this.obtenerUsuarios();
        
    }

    obtenerUsuarios(){
        this.usuarioService.obtenerUsuarios().subscribe(
            (data) => {
                this.usuarios = data as Usuario[];
            },
            (error) => {
                console.error('Error in recupered submenus', error);
            }
       );
    }

    abrirDialog(){
        this.usuario_dialog = true;
    }

    onSubmit(): void {
        if (this.usuarioForm.valid) {
            const usuario: Usuario = this.usuarioForm.value;
    
            // Convertir la fecha de nacimiento a formato YYYY-MM-DD
            if (usuario.fecha_nacimiento) {
                const fechaNacimiento = new Date(usuario.fecha_nacimiento);
                const anio = fechaNacimiento.getFullYear();
                const mes = String(fechaNacimiento.getMonth() + 1).padStart(2, '0'); // Los meses son 0-indexados
                const dia = String(fechaNacimiento.getDate()).padStart(2, '0');
                usuario.fecha_nacimiento = `${anio}-${mes}-${dia}`; // Formato YYYY-MM-DD
            }
    
            this.usuarioService.crearUsuario(usuario).subscribe(
                (response) => {
                    console.log('Usuario creado:', response);
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario creado correctamente.' });
                    this.usuarioForm.reset(); // Reiniciar el formulario
                    this.usuario_dialog = false; // Cerrar el diálogo
                    this.obtenerUsuarios(); // Llama a la función para actualizar la tabla
                },
                (error) => {
                    console.error('Error al crear el usuario:', error);
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el usuario.' });
                }
            );
        } else {
            console.log('Formulario no válido');
        }
    }

    modificarUsuario(usuario: Usuario): void {
        this.usuarioForm.patchValue(usuario); // Cargar los datos del usuario en el formulario
        this.usuario_dialog = true; // Mostrar el diálogo
    }


    guardarCambios(): void {
        if (this.usuarioForm.valid) {
            const usuarioData = this.usuarioForm.value;
    
            // Formatear la fecha de nacimiento
            const fechaNacimiento = new Date(usuarioData.fecha_nacimiento);
            const anio = fechaNacimiento.getFullYear();
            const mes = String(fechaNacimiento.getMonth() + 1).padStart(2, '0'); // Los meses son 0-indexados
            const dia = String(fechaNacimiento.getDate()).padStart(2, '0');
            usuarioData.fecha_nacimiento = `${anio}-${mes}-${dia}`; // Formato YYYY-MM-DD
    
            if (usuarioData.id_usuario) {
                this.usuarioService.modificarUsuario(usuarioData, usuarioData.id_usuario).subscribe(
                    response => {
                        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario modificado correctamente.' });
                        this.usuario_dialog = false; // Cerrar el diálogo
                        this.obtenerUsuarios(); // Actualizar la tabla
                    },
                    error => {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo modificar el usuario.' });
                    }
                );
            }
        }
    }

    desactivarUsuario(usuario: Usuario): void {
        this.usuarioService.desactivarUsuario(usuario.id_usuario).subscribe(
            response => {
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario desactivado correctamente.' });
                this.obtenerUsuarios(); // Actualizar la tabla
            },
            error => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo desactivar el usuario.' });
            }
        );
    }
}
