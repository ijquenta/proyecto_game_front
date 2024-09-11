import { Component } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';

@Component({
  selector: 'app-horario-scheduler',
  templateUrl: './horario-scheduler.component.html',
  styleUrls: ['./horario-scheduler.component.scss']
})
export class HorarioSchedulerComponent {
  calendarOptions: CalendarOptions = {
    initialView: 'timeGridWeek', // Vista semanal con horarios
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    events: [
      { title: 'Evento de Prueba', start: new Date() }
    ],
    editable: true, // Permite arrastrar y soltar eventos
  };
}
