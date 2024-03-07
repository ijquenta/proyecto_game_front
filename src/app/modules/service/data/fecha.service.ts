import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FechaService {

  formatearFecha(fecha: Date): string {
    const dia = fecha.getDate();
    const mes = fecha.getMonth() + 1;
    const año = fecha.getFullYear();
    const horas = fecha.getHours() + 4;
    const minutos = fecha.getMinutes();
    const segundos = fecha.getSeconds();

    const mesStr = mes < 10 ? '0' + mes : mes;
    const diaStr = dia < 10 ? '0' + dia : dia;
    const horasStr = horas < 10 ? '0' + horas : horas;
    const minutosStr = minutos < 10 ? '0' + minutos : minutos;
    const segundosStr = segundos < 10 ? '0' + segundos : segundos;

    return `${diaStr}/${mesStr}/${año} ${horasStr}:${minutosStr}:${segundosStr}`;
  }
}
