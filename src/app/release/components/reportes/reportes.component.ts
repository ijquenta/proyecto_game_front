import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
// import { listarReportes } from 'src/app/models/constantes';
// import { AuthService } from 'src/app/service/core/auth.service';
// import { ReporteService } from 'src/app/service/data/reporte.service';
import { ReporteService } from '../../service/data/reporte.service';
// import { SharedService } from 'src/app/service/data/shared.service';

@Component({
  selector: 'reintegro-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit, OnDestroy {

  gestion$:Observable<number>;
  partidas: any[] = [{"idPartida": 1, "descripcion": "PLANTA"},{"idPartida": 4, "descripcion": "EVENTUAL"}]
  partidaSelected: any;
  gestionSelected: any;
  meses: any = [{'idMes': 1, 'mes': 'Aportes Enero'}, {'idMes': 2, 'mes': 'Aportes Febrero'}, {'idMes': 3, 'mes': 'Aportes Marzo'}, {'idMes': 4, 'mes': 'Aportes Abril'}]
  mesSelected: any;

  fechaInicioSelected: any;
  fechaFinSelected: any;

//   listarReportes = listarReportes;
  sub: any;

  username: string = ''
  constructor(
    public reporte: ReporteService,
    // shared: SharedService,
    // private authService: AuthService
  )
    {
    //   this.gestion$ = shared.idGestionObs;
  }

  ngOnInit(): void {
    this.sub = this.gestion$.subscribe((result: any)=> {
      this.gestionSelected = result;
    })
    // this.username = this.authService.getUsername();

  }
  ngOnDestroy(): void {
    this.sub.unsubscribe()
  }

}
