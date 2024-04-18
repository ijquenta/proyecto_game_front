export class Nivel {
    tipo?: any;
    curid?: number = 0;
    curnombre?: string = '';
    curdescripcion?: string = '';
    curestadodescripcion?: string | null = null;
    curnivel?: number | null = null;
    curdesnivel?: string | null = null;
    curfchini?: any;
    curfchfin?: any;
    curusureg?: string | null = null;
    curfecreg?: string | null = null; // Puedes usar un formato de fecha adecuado si lo deseas
    curusumod?: string | null = null;
    curfecmod?: string | null = null; // Puedes usar un formato de fecha adecuado si lo deseas
    curestado?: number | null = 1;
}

