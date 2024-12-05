import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { Paciente } from 'src/app/modules/models/game';
import { Usuario } from 'src/app/modules/models/usuario';
import { UsuarioService } from 'src/app/modules/service/data/usuario.service';

@Component({
    selector: 'pacientes-component',
    templateUrl: './pacientes.component.html',
    providers: [MessageService],
    styleUrls: ['./pacientes.component.css'],
})
export class PacientesComponent implements OnInit {
    pacientes: Paciente[] = [];
    pacienteForm: FormGroup;
    paciente_dialog: boolean = false;
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

        this.items = [{ label: 'Administrar' }, { label: 'Pacientes', routerLink: '' },];
        this.home = { icon: 'pi pi-home', routerLink: '/' };

        this.pacienteForm = this.formBuilder.group({
            id_paciente: [null],
            id_usuario: [null, [Validators.required]],
            diagnostico: ['', [Validators.required]],
            fecha_ingreso: ['', [Validators.required]],
            rango_movimiento: [''],
            fuerza: [''],
            estabilidad: [''],
            descripcion: [''],
            observacion: [''],
            estado: ['', [Validators.required]]
        });

        this.estadoOptions = [
            { label: 'Activo', value: 'activo' },
            { label: 'Inactivo', value: 'inactivo' }
        ];

        this.obtenerPacientes();
        this.obtenerUsuarios();
    }

    obtenerPacientes() {
        this.usuarioService.obtenerPacientes().subscribe(
            (data) => {
                this.pacientes = data as Paciente[];
            },
            (error) => {
                console.error('Error al obtener pacientes', error);
            }
        );
    }

    abrirDialog() {
        this.paciente_dialog = true;
        this.pacienteForm.reset(); // Reiniciar el formulario al abrir el diálogo
    }

    onSubmit(): void {
        if (this.pacienteForm.valid) {
            const paciente: Paciente = this.pacienteForm.value;

            // Convertir la fecha de ingreso a formato YYYY-MM-DD
            if (paciente.fecha_ingreso) {
                const fechaIngreso = new Date(paciente.fecha_ingreso);
                const anio = fechaIngreso.getFullYear();
                const mes = String(fechaIngreso.getMonth() + 1).padStart(2, '0');
                const dia = String(fechaIngreso.getDate()).padStart(2, '0');
                paciente.fecha_ingreso = `${anio}-${mes}-${dia}`;
            }

            this.usuarioService.crearPaciente(paciente).subscribe(
                (response) => {
                    console.log('Paciente creado:', response);
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Paciente creado correctamente.' });
                    this.pacienteForm.reset();
                    this.paciente_dialog = false;
                    this.obtenerPacientes();
                },
                (error) => {
                    console.error('Error al crear el paciente:', error);
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el paciente.' });
                }
            );
        } else {
            console.log('Formulario no válido');
        }
    }

    modificarPaciente(paciente: Paciente): void {
        this.pacienteForm.patchValue(paciente);
        this.paciente_dialog = true;
    }

    guardarCambios(): void {
        if (this.pacienteForm.valid) {
            const pacienteData = this.pacienteForm.value;

            // Formatear la fecha de ingreso
            const fechaIngreso = new Date(pacienteData.fecha_ingreso);
            const anio = fechaIngreso.getFullYear();
            const mes = String(fechaIngreso.getMonth() + 1).padStart(2, '0');
            const dia = String(fechaIngreso.getDate()).padStart(2, '0');
            pacienteData.fecha_ingreso = `${anio}-${mes}-${dia}`;

            if (pacienteData.id_paciente) {
                this.usuarioService.modificarPaciente(pacienteData, pacienteData.id_paciente).subscribe(
                    response => {
                        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Paciente modificado correctamente.' });
                        this.paciente_dialog = false;
                        this.obtenerPacientes();
                    },
                    error => {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo modificar el paciente.' });
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

    desactivarPaciente(paciente: Paciente): void {
        this.usuarioService.desactivarPaciente(paciente.id_paciente).subscribe(
            response => {
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Paciente desactivado correctamente.' });
                this.obtenerPacientes();
            },
            error => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo desactivar el paciente.' });
            }
        );
    }
}