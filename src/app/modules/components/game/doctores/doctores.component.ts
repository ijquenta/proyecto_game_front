import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { Doctor } from 'src/app/modules/models/game';
import { Usuario } from 'src/app/modules/models/usuario';
import { UsuarioService } from 'src/app/modules/service/data/usuario.service';

@Component({
    selector: 'doctores-component',
    templateUrl: './doctores.component.html',
    providers: [MessageService],
    styleUrls: ['./doctores.component.css'],
})
export class DoctoresComponent implements OnInit {
    doctores: Doctor[] = [];
    doctorForm: FormGroup;
    doctor_dialog: boolean = false;
    loading: boolean = false;
    estadoOptions: any[];
    items: MenuItem[] | undefined;
    home: MenuItem | undefined;
    usuarios: Usuario[] = []; // Lista de usuarios
    usuariosOptions: any[] = []; // Opciones para el dropdown

    constructor(
        private usuarioService: UsuarioService,
        private messageService: MessageService,
        private formBuilder: FormBuilder
    ) { }

    ngOnInit() {
        this.items = [{ label: 'Administrar' }, { label: 'Doctores', routerLink: '' }];
        this.home = { icon: 'pi pi-home', routerLink: '/' };

        this.doctorForm = this.formBuilder.group({
            id_doctor: [null],
            id_usuario: [null, [Validators.required]],
            especialidad: ['', [Validators.required]],
            estado: ['', [Validators.required]]
        });

        this.estadoOptions = [
            { label: 'Activo', value: 'activo' },
            { label: 'Inactivo', value: 'inactivo' }
        ];

        this.obtenerDoctores();
        this.obtenerUsuarios();
    }

    obtenerDoctores() {
        this.usuarioService.obtenerDoctores().subscribe(
            (data) => {
                this.doctores = data as Doctor[];
            },
            (error) => {
                console.error('Error al obtener doctores', error);
            }
        );
    }

    abrirDialog() {
        this.doctor_dialog = true;
        this.doctorForm.reset(); // Reiniciar el formulario al abrir el diálogo
    }

    onSubmit(): void {
        if (this.doctorForm.valid) {
            const doctor: Doctor = this.doctorForm.value;

            this.usuarioService.crearDoctor(doctor).subscribe(
                (response) => {
                    console.log('Doctor creado:', response);
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Doctor creado correctamente.' });
                    this.doctorForm.reset();
                    this.doctor_dialog = false;
                    this.obtenerDoctores();
                },
                (error) => {
                    console.error('Error al crear el doctor:', error);
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el doctor.' });
                }
            );
        } else {
            console.log('Formulario no válido');
        }
    }

    modificarDoctor(doctor: Doctor): void {
        this.doctorForm.patchValue(doctor);
        this.doctor_dialog = true;
    }

    guardarCambios(): void {
        if (this.doctorForm.valid) {
            const doctorData = this.doctorForm.value;

            if (doctorData.id_doctor) {
                this.usuarioService.modificarDoctor(doctorData, doctorData.id_doctor).subscribe(
                    response => {
                        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Doctor modificado correctamente.' });
                        this.doctor_dialog = false;
                        this.obtenerDoctores();
                    },
                    error => {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo modificar el doctor.' });
                    }
                );
            }
        }
    }

    obtenerUsuarios() {
        this.usuarioService.obtenerUsuarios().subscribe(
            (data) => {
                this.usuarios = data as Usuario[];
                // Mapear los usuarios a un formato adecuado para el dropdown
                this.usuariosOptions = this.usuarios.map(usuario => ({
                    label: `${usuario.nombre} ${usuario.apellido}`, // Mostrar nombre y apellido
                    value: usuario.id_usuario // Usar id_usuario como valor
                }));
            },
            (error) => {
                console.error('Error al obtener usuarios', error);
            }
        );
    }

    desactivarDoctor(doctor: Doctor): void {
        this.usuarioService.desactivarDoctor(doctor.id_doctor).subscribe(
            response => {
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Doctor desactivado correctamente.' });
                this.obtenerDoctores();
            },
            error => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo desactivar el doctor.' });
            }
        );
    }
}