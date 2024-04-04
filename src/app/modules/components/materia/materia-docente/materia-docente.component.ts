import { EstudianteService } from 'src/app/modules/service/data/estudiante.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Materia } from 'src/app/modules/models/materia';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { MateriaService } from 'src/app/modules/service/data/materia.service';
import { ReporteService } from 'src/app/modules/service/data/reporte.service';
import { DatePipe } from '@angular/common';
import { TipoModulo, TipoEstado } from 'src/app/modules/models/diccionario';
import { DocenteService } from 'src/app/modules/service/data/docente.service';
import { CursoMateria } from 'src/app/modules/models/curso';
import { AuthService } from 'src/app/services/auth.service';
import { Usuario } from 'src/app/modules/models/usuario';
import { InscripcionRegistro } from 'src/app/modules/models/inscripcion';
@Component({
  selector: 'app-materia-docente',
  templateUrl: './materia-docente.component.html',
  styleUrls: ['./materia-docente.component.scss']
})
export class MateriaDocenteComponent implements OnInit{
    datoscalculo: any;
    // docenteSeleccionado: Docente = new Docente();
    idPersona: number = 4905;
    // results: Docente[] = [];
    criterio: any = '';
    idDoc: any = '';
    body: any = {"idGestion": 0,"expresion": ''}
    body2: any = { }
    displayDialog: boolean = false;
    displayPlanilla: boolean = false;
    motivoSelected: string = '';
    itemsPersona: any[] = [];
    itemsSelected: any;
    meses: any[] = [];
    months: any[] = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    // fase: FasePlanilla = new FasePlanilla();
    estadoPersona: any[] = [];
    montoReintegro: any[] = [];
    personasExcluidas: any[] = [];
    nroCi: string = '';
    nomCompleto: string = '';
    nomCi: string = '';
    codDoc: string = '';
    codDoc2: string = '';
    loading: boolean = false;
    loading2: boolean = false;
    typeForm: number = 0;
    sub: any;
    sub2: any;
    sub3: any;
    // gestion$:Observable<number>;
    // admPlanilla = administrarPlanilla;
    verBeneficiosSocialesClicked: boolean = true
    verBeneficiosFacultadClicked: boolean = false
    verBeneficiosDesignacionClicked: boolean = false

    verMateriaAsignadaClicked:boolean = false;
    curmatid: any;
    // Buscar docente
    nroCi2: string = '';
    nomCompleto2: string = '';
    docentedatos: any = {};
    docentedatos1: any = {};
    listabeneficios: any = [];
    listabeneficios2: any = [];
    data=[];
    listaDatosModificar: any = [];

    listaMateriasInscritas: any = [];

    // Variables Formulario
    // recarga$:Observable<boolean>;
    displayDelete:boolean = false;
    obsEliminar: string = "";
    // registroEliminar= new RegistroCalculoBS();
    errors: any;

    inscripciones: InscripcionRegistro;
    listarMateriaEstudianteCurso: any[] = [];
    usuario: Usuario;
    constructor(
        private messageService: MessageService,
        private materiaService: MateriaService,
        public reporte: ReporteService,
        public estudianteService: EstudianteService,
        public authService: AuthService,
        public docenteService: DocenteService
        )
        {
            // this.tipoModuloSeleccionado = new TipoModulo(0,"");
            // this.tipoEstadoSeleccionado = new TipoEstado(0,"");
        }

    ngOnInit(): void {
        // this.sub = this.recarga$.subscribe((result: any)=>{
        //   if(result){
        //     // this.obtenerDatosCalculo();
        //     // this.display = false;
        //   }
        // })

        this.authService.usuario$.subscribe((user => {
            if (user) {
                if (Array.isArray(user) && user.length > 0) {
                    this.usuario = user[0];

                    this.docenteService.obtenerMateriasAsignadas(this.usuario).subscribe(data => {
                        this.inscripciones = data;
                         console.log("mis materias", data);
                    },
                    (error => {
                        console.log("error", error)
                    })
                    );
                }
            }
        }));


      }

    init(){
        // this.docenteSeleccionado = new Persona();
        this.estadoPersona = [];
        this.montoReintegro = [];
        this.personasExcluidas = [];
        this.criterio = '';
        this.nroCi2 = '';
        this.nomCompleto2 = '';
        this.docentedatos = [];
        this.listabeneficios = [];
        this.idDoc = '';
        // this.nomCi = '365361';
        this.nomCi = '2343956';
        // this.datoscalculo = new RegistroCalculoBS();

        this.listaDatosModificar = [];
        this.verBeneficiosSocialesClicked = false;
        this.verBeneficiosFacultadClicked = false;

    }
    buscar() {
        // if(this.nomCi && this.nomCi.length > 0){
        //   this.admCal.mostrarDatosPersonalDocente(this.nomCi, this.nomCi).subscribe
        //   (data => {
        //   this.docentedatos = data; // Almacenar el docente retornado
        //   // console.log("Datos del docente: ", this.docentedatos);
        //   this.listarBenSoc();
        //   });
        // }
        // else {
        //   this.messageService.add({severity:'warn', summary:'Advertencia', detail:`No se ingreso nombre ni c.i. del docente`});
        //   console.log("Error: No se ingreso nombre ni c.i. del docente");
        // }
    }
    listarEstudianteMateria(data: any) {
        this.loading2 = true;
        this.verMateriaAsignadaClicked = true;
        this.curmatid = data.curmatid;
        const criterio = {
            curmatid: data.curmatid,
        }
        this.listarEstudiantes(criterio);
    }
    listarEstudiantes(criterio: any) {
        this.docenteService.listarMateriaEstudianteCurso(criterio).subscribe((result: any) => {
            this.listarMateriaEstudianteCurso = result as any[];
            this.loading2 = false;
        },
        error => {
            this.loading2 = false;
            this.errors = error;
            console.log("error", error);
            this.messageService.add({ severity: 'warn', summary: 'Error', detail: 'Algo salio mal!' });
        });
    }
     // Método de busqueda en la tabla
    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }

}
