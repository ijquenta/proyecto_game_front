import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ReporteService } from '../../service/data/reporte.service';

@Component({
    selector: 'reintegro-reportes',
    templateUrl: './reportes.component.html',
    styleUrls: ['./reportes.component.css'],
})
export class ReportesComponent implements OnInit, OnDestroy {
    gestion$: Observable<number>;
    partidas: any[] = [
        { idPartida: 1, descripcion: 'PLANTA' },
        { idPartida: 4, descripcion: 'EVENTUAL' },
    ];
    partidaSelected: any;
    gestionSelected: any;
    meses: any = [
        { idMes: 1, mes: 'Aportes Enero' },
        { idMes: 2, mes: 'Aportes Febrero' },
        { idMes: 3, mes: 'Aportes Marzo' },
        { idMes: 4, mes: 'Aportes Abril' },
    ];
    mesSelected: any;
    fechaInicioSelected: any;
    fechaFinSelected: any;
    sub: any;
    username: string = '';
    constructor(public reporte: ReporteService) {}

    ngOnInit(): void {
        this.sub = this.gestion$.subscribe((result: any) => {
            this.gestionSelected = result;
        });
    }
    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }
}
