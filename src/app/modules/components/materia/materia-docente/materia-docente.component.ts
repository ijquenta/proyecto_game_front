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
import { AuthService } from 'src/app/modules/service/core/auth.service';
import { Usuario } from 'src/app/modules/models/usuario';
import { InscripcionRegistro } from 'src/app/modules/models/inscripcion';
@Component({
  selector: 'app-materia-docente',
  templateUrl: './materia-docente.component.html',
  styleUrls: ['./materia-docente.component.scss']
})
export class MateriaDocenteComponent implements OnInit{
    loading: boolean = false;
    loading2: boolean = false;
    verMateriaAsignadaClicked:boolean = false;
    curmatid: any;
    listaMateriasInscritas: any = [];
    displayDelete:boolean = false;
    obsEliminar: string = "";
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
        }

    ngOnInit(): void {


        this.authService.usuario$.subscribe((user => {
            if (user) {
                if (Array.isArray(user) && user.length > 0) {
                    this.usuario = user[0];

                    this.docenteService.obtenerMateriasAsignadas(this.usuario).subscribe(data => {
                        this.inscripciones = data;
                        //  console.log("mis materias", data);
                    },
                    (error => {
                        console.log("error", error)
                    })
                    );
                }
            }
        }));


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
