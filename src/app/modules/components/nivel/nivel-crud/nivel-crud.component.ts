import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ReporteService } from 'src/app/modules/service/data/reporte.service';
import { Nivel } from 'src/app/modules/models/nivel';
import { NivelService } from 'src/app/modules/service/data/nivel.service';
import { TipoModulo } from 'src/app/modules/models/diccionario';
import { TipoNivelEstado } from 'src/app/modules/models/diccionario';
import { DatePipe } from '@angular/common';
// --------------- Importación de Autenticación
import { AuthService } from 'src/app/services/auth.service';

// --------------- Importación para validaciones
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// --------------- Modelo de Usuario
import { Usuario } from 'src/app/modules/models/usuario';

@Component({
    templateUrl: './nivel-crud.component.html',
    providers: [MessageService],
    styleUrls: ['../../../../app.component.css']
})
export class NivelCrudComponent implements OnInit {


    //-----------------Variables-Nivel-------------------//

    listaNiveles: Nivel[] = [];
    nivel: Nivel = {};
    submitted: boolean = false;
    nivelDialog: boolean = false;
    eliminarNivelDialog: boolean = false;
    tipoModulo: TipoModulo[] = [];
    tipoModuloSeleccionado: TipoModulo;
    tipoNivelEstado: TipoNivelEstado[] = [];
    tipoNivelEstadoSeleccionado: TipoNivelEstado;
    registroNivel: Nivel = {};
    pip = new DatePipe('es-BO');
    opcionNivel: boolean = false;
    loading: boolean = false;
    //-----------------Variables-Nivel-------------------//
    es: any;

    //----------------Variables para validación----------------//
    nivelForm: FormGroup;
    //----------------Variables para validación----------------//
    usuario: Usuario;


    constructor(
                private messageService: MessageService,
                public reporte: ReporteService,
                public nivelService: NivelService,
                private authService: AuthService,
                private formBuilder: FormBuilder,)
                {
                    this.tipoModuloSeleccionado = new TipoModulo(0,"");
                    this.tipoNivelEstadoSeleccionado = new TipoNivelEstado(0,"");
                }

    ngOnInit() {
        this.getPerfilUsuario();

        this.listarNivel();

        this.asignacionValidaciones();

        this.tipoModulo = [
            new TipoModulo(1, 'PRIMERO'),
            new TipoModulo(2, 'SEGUNDO'),
            new TipoModulo(3, 'TERCERO'),
            new TipoModulo(4, 'OTRO'),
        ];

        this.tipoNivelEstado = [
            new TipoNivelEstado(0, 'FINALIZADO'),
            new TipoNivelEstado(1, 'VIGENTE'),
            new TipoNivelEstado(2, 'OTRO')
        ]

        this.es = {
            firsDayOfWeek: 1,
            monthNames: ["Enero","Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
            monthNamesShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
            dayNames: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
            dayNamesShort: ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
            dayNamesMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
            today: 'Hoy',
            clear: 'Borrar'
        };
        // console.log("TipoModulo-> ",this.tipoModulo);
        // console.log("TipoNivelEstado-> ",this.tipoNivelEstado);
    }

   //---------------Funciones-Nivel---------------//

    // Método para asignar las variables de React Form Valid
    asignacionValidaciones() {
        //----- Asignación de la validaciones
        this.nivelForm = this.formBuilder.group({
            nf_id: [''],
            nf_curnombre: ['', [Validators.required]],
            nf_curdescripcion: ['', [Validators.required]],
            nf_tipoModulo: ['', [Validators.required]],
            nf_curfchini: ['', [Validators.required]],
            nf_curfchfin: ['', [Validators.required]]
        });
    }
    // Obtener datos del perfil del usuario logeado
    getPerfilUsuario() {
        this.authService.getPerfil().subscribe(usuario => {
            this.usuario = usuario[0];
        });
    }
    // Método de listar los niveles
    listarNivel(){
        this.loading = true;
        this.nivelService.listarNivel().subscribe(
            (result: any) => {
                this.listaNiveles = result;
                this.loading = false;
            }
        )
    }

    abrirNuevo() {
        this.nivelForm.reset();
        // this.nivel = {};
        // this.tipoModuloSeleccionado = new TipoModulo(0,"");
        // this.tipoNivelEstadoSeleccionado = new TipoNivelEstado(0,"");
        this.nivelDialog = true;
        this.opcionNivel = true;
    }
    ocultarDialog() {
        this.nivelDialog = false;
        this.opcionNivel = false;
    }
    editarNivel(data: any) {
        this.nivel = { ...data };
        this.setData();
        this.nivelDialog = true;
        this.opcionNivel = false;
    }
    eliminarNivel(nivel: Nivel) {
        this.eliminarNivelDialog = true;
        this.nivel = { ...nivel };
    }
    confirmarEliminar() {
        console.log("confirmarEliminar: ", this.nivel)
        const criterio = {
            curid: this.nivel.curid
        }
        console.log("criterio: ", criterio)
        this.nivelService.eliminarNivel(criterio).subscribe(
            (result: any) => {
                this.messageService.add({ severity: 'success', summary: 'Exitosa!', detail: 'Nivel Eliminado', life: 3000 });
                this.listarNivel();
                this.eliminarNivelDialog = false;
                this.nivel = {};
            },
            error => {
            console.log("error",error);
            const descripcionError = error.error.message;
                this.messageService.add({severity:'warn', summary:'Error', detail: descripcionError, life: 5000});
            }
        );
    }
    curfechaini: any
    curfechafin: any
    setData(){
        this.nivelForm.reset();
        this.nivelForm.patchValue({
            nf_id: this.nivel.curid,
            nf_curnombre: this.nivel.curnombre,
            nf_curdescripcion: this.nivel.curdescripcion,
            nf_tipoModulo: new TipoModulo(this.nivel.curnivel, this.nivel.curdesnivel),
            nf_curfchini: this.nivel.curfchini,
            nf_curfchfin: this.nivel.curfchfin
        })
        console.log("set: ", this.nivelForm.value);


    }
    obtenerBody(){

        this.nivel = new Nivel();
        this.nivel.curid = this.nivelForm.value.nf_id;
        this.nivel.curnombre = this.nivelForm.value.nf_curnombre;
        this.nivel.curdescripcion = this.nivelForm.value.nf_curdescripcion;
        this.nivel.curnivel = this.nivelForm.value.nf_tipoModulo.codTipoModulo;
        this.nivel.curdesnivel = this.nivelForm.value.nf_tipoModulo.desTipoModulo;
        this.nivel.curfchini = this.nivelForm.value.nf_curfchini;
        this.nivel.curfchfin = this.nivelForm.value.nf_curfchfin;
        this.nivel.curestado = 1;
        this.nivel.curestadodescripcion = "";
        this.nivel.curusureg = this.usuario.usuname;
        this.nivel.curusumod = this.usuario.usuname;
        console.log("Obtener Body: ", this.nivel);
        const body = {...this.nivel}
        return body;
    }
    obtenerEstadoSeverity(estado: number): string {
        switch (estado) {
            case 0:
                return 'danger';
            case 1:
                return 'success';
            default:
                return 'info';
        }
    }
    obtenerNivelSeverity(estado: number): string {
        switch (estado) {
            case 1:
                return 'warning';
            case 2:
                return 'info';
            case 3:
                return 'danger';
            default:
                return 'info';
        }
    }
    guardarNivel(){
        if(this.nivelForm.invalid){
            this.messageService.add({ severity: 'error', summary: 'Error en el Registro', detail: 'Por favor, verifica la información ingresada e intenta nuevamente.', life: 3000 });
            return Object.values(this.nivelForm.controls).forEach(control=>{
                control.markAllAsTouched();
                control.markAsDirty();
            })
        }
        this.obtenerBody();
        if (this.opcionNivel) {
            console.log("Add nivel: ", this.nivel);
            this.nivelService.insertarNivel(this.nivel).subscribe(
                (result: any) => {
                    this.messageService.add({ severity: 'success', summary: 'Exitosamente', detail: 'Nivel Agregado', life: 3000 });
                    this.listarNivel();
                    this.nivelDialog = false;
                    this.opcionNivel = false;
                },
                error => {
                console.log("error",error);
                    this.messageService.add({severity:'warn', summary:'Error', detail:'Algo salio mal, al insertar el Nivel'});
                }
            );
        }
        else{
            this.nivel.curid = this.nivelForm.value.nf_id;
            console.log("Mod nivel: ", this.nivel);
            this.nivelService.modificarNivel(this.nivel).subscribe(
                (result: any) => {
                    this.messageService.add({ severity: 'success', summary: 'Exitosamente', detail: 'Nivel Modificado', life: 3000 });
                    this.listarNivel();
                    this.nivelDialog = false;
                    this.opcionNivel = false;
                },
                error => {
                console.log("error",error);
                    this.messageService.add({severity:'warn', summary:'Error', detail:'Algo salio mal, al modificar el Nivel'});
                }
            );
        }
    }
    // Función para retornar los colores para el tipo de módulo o nivel
    getSeverity(nivdesnivel: string): string {
        switch (nivdesnivel) {
        case 'PRIMERO':
            return 'danger';
        case 'SEGUNDO':
            return 'info';
        case 'TERCERO':
            return 'warning';
        default:
            return 'success';
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
    //---------------Funciones-Nivel---------------//
}
