import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { Sesion } from 'src/app/modules/models/game';
import { Paciente } from 'src/app/modules/models/game'; 
import { Doctor } from 'src/app/modules/models/game';
import { UsuarioService } from 'src/app/modules/service/data/usuario.service';

@Component({
    selector: 'sesiones-component',
    templateUrl: './sesiones.component.html',
    providers: [MessageService],
    styleUrls: ['./sesiones.component.css'],
})
export class SesionesComponent implements OnInit {
    sesiones: Sesion[] = [];
    sesionForm: FormGroup;
    sesion_dialog: boolean = false;
    loading: boolean = false;
    estadoOptions: any[];
    items: MenuItem[] | undefined;
    home: MenuItem | undefined;
    pacientes: Paciente[] = []; // Lista de pacientes
    doctores: Doctor[] = []; // Lista de doctores
    pacientesOptions: any[] = []; // Opciones para el dropdown de pacientes
    doctoresOptions: any[] = []; // Opciones para el dropdown de doctores

    constructor(
        private usuarioService: UsuarioService,
        private messageService: MessageService,
        private formBuilder: FormBuilder
    ) { }

    ngOnInit() {
        this.items = [{ label: 'Administrar' }, { label: 'Sesiones', routerLink: '' }];
        this.home = { icon: 'pi pi-home', routerLink: '/' };

        this.sesionForm = this.formBuilder.group({
            id_session: [null],
            id_paciente: [null, [Validators.required]],
            id_doctor: [null, [Validators.required]],
            fecha_sesion: ['', [Validators.required]],
            tiempo_sesion: ['', [Validators.required]],
            puntaje_obtenido: ['', [Validators.required]],
            descripcion: ['', [Validators.required]],
            observaciones: ['', [Validators.required]],
            ejercicios_realizados: ['', [Validators.required]],
            nivel_dificultad: ['', [Validators.required]],
            estado_emocional: ['', [Validators.required]],
            mejoras_observadas: ['', [Validators.required]],
            resultados_prueba: ['', [Validators.required]],
            notas: ['', [Validators.required]],
            feedback: ['', [Validators.required]],
            estado: ['', [Validators.required]]
        });

        this.estadoOptions = [
            { label: 'Activo', value: 'activo' },
            { label: 'Inactivo', value: 'inactivo' }
        ];

        this.obtenerSesiones();
        this.obtenerPacientes();
        this.obtenerDoctores();
    }

    obtenerSesiones() {
        this.usuarioService.obtenerSesiones().subscribe(
            (data) => {
                this.sesiones = data as Sesion[];
            },
            (error) => {
                console.error('Error al obtener sesiones', error);
            }
        );
    }

    abrirDialog() {
        this.sesion_dialog = true;
        this.sesionForm.reset(); // Reiniciar el formulario al abrir el diálogo
    }

    onSubmit(): void {
        if (this.sesionForm.valid) {

            this.sesionForm.value.id_paciente = this.sesionForm.value.id_paciente.value;
            this.sesionForm.value.id_doctor = this.sesionForm.value.id_doctor.value;

            const sesion: Sesion = this.sesionForm.value;

            // Convertir la fecha de sesión a formato YYYY-MM-DD
            if (sesion.fecha_sesion) {
                const fechaSesion = new Date(sesion.fecha_sesion);
                const anio = fechaSesion.getFullYear();
                const mes = String(fechaSesion.getMonth() + 1).padStart(2, '0');
                const dia = String(fechaSesion.getDate()).padStart(2, '0');
                sesion.fecha_sesion = `${anio}-${mes}-${dia}`;
            }

            this.usuarioService.crearSesion(sesion).subscribe(
                (response) => {
                    console.log('Sesión creada:', response);
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Sesión creada correctamente.' });
                    this.sesionForm.reset();
                    this.sesion_dialog = false;
                    this.obtenerSesiones();
                },
                (error) => {
                    console.error('Error al crear la sesión:', error);
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear la sesión.' });
                }
            );
        } else {
            console.log('Formulario no válido');
        }
    }

    modificarSesion(sesion: Sesion): void {
        this.sesionForm.patchValue(sesion);
        this.sesion_dialog = true;
    }

    guardarCambios(): void {
        if (this.sesionForm.valid) {
            const sesionData = this.sesionForm.value;
            sesionData.id_paciente = sesionData.id_paciente.value;
            sesionData.id_doctor = sesionData.id_doctor.value;
            console.log("datos a guardar cambios: ", sesionData);

            // Formatear la fecha de sesión
            const fechaSesion = new Date(sesionData.fecha_sesion);
            const anio = fechaSesion.getFullYear();
            const mes = String(fechaSesion.getMonth() + 1).padStart(2, '0');
            const dia = String(fechaSesion.getDate()).padStart(2, '0');
            sesionData.fecha_sesion = `${anio}-${mes}-${dia}`;

            if (sesionData.id_session) {
                this.usuarioService.modificarSesion(sesionData, sesionData.id_session).subscribe(
                    response => {
                        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Sesión modificada correctamente.' });
                        this.sesion_dialog = false;
                        this.obtenerSesiones();
                    },
                    error => {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo modificar la sesión.' });
                    }
                );
            }
        }
    }

    obtenerPacientes() {
        this.usuarioService.obtenerPacientes().subscribe(
            (data) => {
                this.pacientes = data as Paciente[];
                // Mapear los pacientes a un formato adecuado para el dropdown
                this.pacientesOptions = this.pacientes.map(paciente => ({
                    label: `${paciente.usuario.nombre} ${paciente.usuario.apellido}`, // Mostrar nombre y apellido
                    value: paciente.id_paciente // Usar id_paciente como valor
                }));

                console.log("pacientes: ", this.pacientesOptions)
            },
            (error) => {
                console.error('Error al obtener pacientes', error);
            }
        );
    }

    obtenerDoctores() {
        this.usuarioService.obtenerDoctores().subscribe(
            (data) => {
                this.doctores = data as Doctor[];
                // Mapear los doctores a un formato adecuado para el dropdown
                this.doctoresOptions = this.doctores.map(doctor => ({
                    label: `${doctor.usuario.nombre} ${doctor.usuario.apellido}`, // Mostrar nombre y apellido
                    value: doctor.id_doctor // Usar id_doctor como valor
                }));
                console.log("doctores: ", this.doctoresOptions)
            },
            (error) => {
                console.error('Error al obtener doctores', error);
            }
        );
    }

    desactivarSesion(sesion: Sesion): void {
        this.usuarioService.desactivarSesion(sesion.id_session).subscribe(
            response => {
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Sesión desactivada correctamente.' });
                this.obtenerSesiones();
            },
            error => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo desactivar la sesión.' });
            }
        );
    }
}