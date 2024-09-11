// Importaciones de servicios
import { EstudianteService } from 'src/app/modules/service/data/estudiante.service';
import { HorarioService } from 'src/app/modules/service/data/horario.service';
import { AuthService } from 'src/app/modules/service/core/auth.service';
import { MateriaService } from 'src/app/modules/service/data/materia.service';

// Importaciones de librerías externas
import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { TreeNode } from 'primeng/api';

interface EventItem {
    status?: string;
    date?: string;
    icon?: string;
    color?: string;
    image?: string;
    description?: string;
}

@Component({
    selector: 'app-materia-pensum',
    templateUrl: './materia-pensum.component.html',
    styleUrls: ['./materia-pensum.component.scss'],
})
export class MateriaPensumComponent implements OnInit {
    activeIndex: number = 0;
    events: EventItem[];
    items: MenuItem[];
    home: MenuItem | undefined;
    dataCursoMinisterial: TreeNode[] = [
        {
            expanded: true,
            styleClass: 'bg-indigo-500 text-white',
            type: 'person',
            data: {
                nombre: 'Curso Ministerial ',
                descripcion:
                    'Dirigido Exclusivamente A Pastores y Obreros encargados de obras que estan en ejercicio',
            },
            children: [
                { label: 'Epistolas Pastorales', styleClass: 'bg-indigo-200', },
                { label: 'Primera Corintios', styleClass: 'bg-indigo-200' },
                { label: 'Homiletica Avanzada', styleClass: 'bg-indigo-200', },
                { label: 'Mayordomia', styleClass: 'bg-indigo-200' },
                { label: 'Ética ministerial', styleClass: 'bg-indigo-200' },
                { label: 'Consejería cristiana', styleClass: 'bg-indigo-200', },
                { label: 'Principios de Administración', styleClass: 'bg-indigo-200', },
                { label: 'Iglecrecimiento Integral', styleClass: 'bg-indigo-200', },
                { label: 'Apologética cristiana', styleClass: 'bg-indigo-200', },
                { label: 'La vida de David', styleClass: 'bg-indigo-200' },
                { label: 'Obra Misionera en Hechos', styleClass: 'bg-indigo-200', },
                { label: 'Eclesiología', styleClass: 'bg-indigo-200' },
                { label: 'Epístolas Paulinas', styleClass: 'bg-indigo-200', },
                { label: 'Liderazgo Cristiano', styleClass: 'bg-indigo-200', },
                { label: 'Enseñanza Expositiva', styleClass: 'bg-indigo-200', },
            ],
        },
    ];

    dataDiplomadoFamiliar1: TreeNode[] = [
        {
            expanded: true,
            styleClass: 'bg-teal-500 text-white',
            type: 'person',
            data: {
                nombre: 'Módulo 1. Fundamentos de la Consejeria Bíblica',
                descripcion: '',
            },
            children: [
                { label: 'Definiciones', styleClass: 'bg-teal-200' },
                { label: 'El consejero y la consejería', styleClass: 'bg-teal-200', },
                { label: 'Diez cosas que debes saber sobre la consejería bíblica', styleClass: 'bg-teal-200', },
                { label: 'Ventajas de la consejería en la iglesia', styleClass: 'bg-teal-200', },
                { label: 'Consejería y discipulado', styleClass: 'bg-teal-200', },
                { label: 'Ayudando a las personas difíciles', styleClass: 'bg-teal-200', },
                { label: 'Formas de cultivar una cultura de consejería', styleClass: 'bg-teal-200', },
            ],
        },
    ];

    dataDiplomadoFamiliar2: TreeNode[] = [
        {
            expanded: true,
            styleClass: 'bg-teal-500 text-white',
            type: 'person',
            data: {
                nombre: 'Módulo 2. Bases Psicológicas en el Ciclo de Vida Familiar',
                descripcion: '',
            },
            children: [
                { label: 'El noviazgo', styleClass: 'bg-teal-200' },
                { label: 'El matrimonio y compromiso', styleClass: 'bg-teal-200', },
                { label: 'Sexualidad en el matrimonio', styleClass: 'bg-teal-200', },
                { label: 'La crianza de los hijos y la orientación a los padres', styleClass: 'bg-teal-200', },
                { label: 'Etapa del nido vacío', styleClass: 'bg-teal-200' },
                { label: 'Ancianidad y vejez', styleClass: 'bg-teal-200' },
                { label: 'Procesos de duelo', styleClass: 'bg-teal-200' },
            ],
        },
    ];

    dataDiplomadoFamiliar3: TreeNode[] = [
        {
            expanded: true,
            styleClass: 'bg-teal-500 text-white',
            type: 'person',
            data: {
                nombre: 'Módulo 3. Técnicas de Consejería',
                descripcion: '',
            },
            children: [
                { label: 'La entrevista', styleClass: 'bg-teal-200' },
                { label: 'La observación', styleClass: 'bg-teal-200' },
                { label: 'Genogramas', styleClass: 'bg-teal-200' },
                { label: 'Técnicas en terapia familiar', styleClass: 'bg-teal-200', },
                { label: 'La comunicación en la familia', styleClass: 'bg-teal-200', },
                { label: 'Análisis de casos', styleClass: 'bg-teal-200' },
                { label: 'Ética profesional del consejero', styleClass: 'bg-teal-200', },
            ],
        },
    ];

    dataDiplomadoFamiliar4: TreeNode[] = [
        {
            expanded: true,
            styleClass: 'bg-teal-500 text-white',
            type: 'person',
            data: {
                nombre: 'Módulo 4. Crisis en la Familia',
                descripcion: '',
            },
            children: [
                { label: 'Divorcio', styleClass: 'bg-teal-200' },
                { label: 'Violencia familiar', styleClass: 'bg-teal-200' },
                { label: 'Maltrato infantil', styleClass: 'bg-teal-200' },
                { label: 'Crisis de pareja', styleClass: 'bg-teal-200' },
                { label: 'Violencia Sexual', styleClass: 'bg-teal-200' },
                { label: 'Adicciones', styleClass: 'bg-teal-200' },
                { label: 'COVID19', styleClass: 'bg-teal-200' },
            ],
        },
    ];

    dataModule1: TreeNode[] = [
        {
            expanded: true,
            styleClass: 'bg-indigo-500 text-white',
            type: 'person',
            data: {
                nombre: 'Módulo 1: Certificado Básico en Biblia y Teología',
                descripcion: '',
            },
            children: [
                { label: 'Sumario de la Biblia', styleClass: 'bg-indigo-200', },
                { label: 'Verdades Fundamentales', styleClass: 'bg-indigo-200', },
                { label: 'Como Estudiar la Biblia', styleClass: 'bg-indigo-200', },
                { label: 'Obra Misionera en Hechos', styleClass: 'bg-indigo-200', },
                { label: 'La Vida de David', styleClass: 'bg-indigo-200' },
                { label: 'Santiago', styleClass: 'bg-indigo-200' },
                { label: 'Epistolas Pastorales', styleClass: 'bg-indigo-200', },
                { label: 'Libro de Romanos', styleClass: 'bg-indigo-200' },
                { label: 'Primera de Corintios', styleClass: 'bg-indigo-200', },
                { label: 'Homiletica Básica', styleClass: 'bg-indigo-200' },
            ],
        },
    ];

    dataModule2: TreeNode[] = [
        {
            expanded: true,
            styleClass: 'bg-purple-500 text-white',
            type: 'person',
            data: {
                nombre: 'Módulo 2: Diploma en Biblia y Teología',
                descripcion: '',
            },
            children: [
                { label: 'Mayordomía', styleClass: 'bg-purple-200' },
                { label: 'La Vida de Cristo', styleClass: 'bg-purple-200' },
                { label: 'El Espíritu Santo', styleClass: 'bg-purple-200' },
                { label: 'Los Evangelios', styleClass: 'bg-purple-200' },
                { label: 'Ética Ministerial', styleClass: 'bg-purple-200' },
                { label: 'Plan Profético de Dios', styleClass: 'bg-purple-200' },
                { label: 'Teología Sistemática', styleClass: 'bg-purple-200' },
                { label: 'Tabernáculo', styleClass: 'bg-purple-200' },
                { label: 'Consejería Cristiana', styleClass: 'bg-purple-200' },
                { label: 'Religiones y Sectas', styleClass: 'bg-purple-200' },
            ],
        },
    ];

    dataModule3: TreeNode[] = [
        {
            expanded: true,
            styleClass: 'bg-teal-500 text-white',
            type: 'person',
            data: {
                nombre: 'Módulo 3: Bachiller en Biblia y Teología',
                descripcion: '',
            },
            children: [
                { label: 'Génesis', styleClass: 'bg-teal-200' },
                { label: 'Enseñanza Expositiva', styleClass: 'bg-teal-200' },
                { label: 'Profetas Menores', styleClass: 'bg-teal-200' },
                { label: 'Apologética Cristiana', styleClass: 'bg-teal-200' },
                { label: 'Libros de Restauración', styleClass: 'bg-teal-200' },
                { label: 'Teología Sistemática II', styleClass: 'bg-teal-200' },
                { label: 'Principios de Administración', styleClass: 'bg-teal-200'},
                { label: 'Iglecrecimiento Integral', styleClass: 'bg-teal-200' },
                { label: 'Eclesiología', styleClass: 'bg-teal-200' },
                { label: 'Historia del Cristianismo', styleClass: 'bg-teal-200' },
            ],
        },
    ];

    selectedNodes: TreeNode[] = [];

    constructor(
    ) {
        this.items = [
            { label: 'Materia' },
            { label: 'Pensum', routerLink: '' },
        ];

        this.home = { icon: 'pi pi-home', routerLink: '/principal' };
    }

    ngOnInit(): void {
    }
}
