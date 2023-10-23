export class Materia {
    matid: number = 0;
    matnombre: string = '';
    matusureg: string = '';
    matfecreg: string = ''; // Puedes usar un formato de fecha adecuado si lo deseas
    matusumod: string = '';
    matfecmod: string = ''; // Puedes usar un formato de fecha adecuado si lo deseas
    matestado: number = 1;
    matnivel: number | null = null;
}
