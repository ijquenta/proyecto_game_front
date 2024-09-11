import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular'; // Importa el módulo FullCalendar
import { HorarioSchedulerComponent } from './horario-scheduler.component';

@NgModule({
  declarations: [
    HorarioSchedulerComponent
  ],
  imports: [
    CommonModule,
    FullCalendarModule
  ],
  exports: [
    HorarioSchedulerComponent
  ]
})
export class HorarioSchedulerModule { }
