export class Materia {
    tipo?: any;
    matid?: number;
    matnombre?: string;
    matdescripcion?: string;
    matusureg?: string;
    matfecreg?: string;
    matusumod?: string;
    matfecmod?: string;
    matestado?: number;
    matnivel?: number | null;
    matdesnivel?: string;
    matestadodescripcion?: string;

    constructor(
        tipo?: any,
        matid?: number,
        matnombre?: string,
        matdescripcion?: string,
        matusureg?: string,
        matfecreg?: string,
        matusumod?: string,
        matfecmod?: string,
        matestado?: number,
        matnivel?: number | null,
        matdesnivel?: string,
        matestadodescripcion?: string
    ) {
        this.tipo = tipo;
        this.matid = matid;
        this.matnombre = matnombre;
        this.matdescripcion = matdescripcion;
        this.matusureg = matusureg;
        this.matfecreg = matfecreg;
        this.matusumod = matusumod;
        this.matfecmod = matfecmod;
        this.matestado = matestado;
        this.matnivel = matnivel;
        this.matdesnivel = matdesnivel;
        this.matestadodescripcion = matestadodescripcion;
    }
}
