export class CursoMateria {
    curmatid?: number;
    curid?: number;
    rolid?: number;
    curnombre?: string | null;
    matnombre?: string | null;
    rolnombre?: string | null;
    matid?: number;
    matnivel?: number;
    curnivel?: number;
    curfchini?: any;
    curfchfin?: any;
    pernombres?: string | null;
    perapepat?: string | null;
    perapemat?: string | null;
    pernomcompleto?: string | null;
    pernrodoc?: any;
    periddocente?: number;
    curmatfecini?: any;
    curmatfecfin?: any;
    curmatestado?: number;
    curmatestadodescripcion?: string | null;
    curmatusureg?: string | null;
    curmatfecreg?: string | null;
    curmatusumod?: string | null;
    curmatfecmod?: string | null;
    curmatidrol?: number;
    curmatidroldes?: string | null;
    perfoto?: any;
    tipo?: any;
    curmatcosto?: any;
    num_estudiantes?: any;
    num_pagos?: any;

    constructor(
        curmatid?: number,
        curid?: number,
        rolid?: number,
        curnombre?: string | null,
        matnombre?: string | null,
        rolnombre?: string | null,
        matid?: number,
        matnivel?: number,
        curnivel?: number,
        pernombres?: string | null,
        perapepat?: string | null,
        perapemat?: string | null,
        pernomcompleto?: string | null,
        pernrodoc?: any,
        periddocente?: number,
        curmatfecini?: any,
        curmatfecfin?: any,
        curmatestado?: number,
        curmatestadodescripcion?: string | null,
        curmatusureg?: string | null,
        curmatfecreg?: string | null,
        curmatusumod?: string | null,
        curmatfecmod?: string | null,
        curmatidrol?: number,
        curmatidroldes?: string | null,
        perfoto?: any,
        tipo?: any,
        curmatcosto?: any,
        num_estudiantes?: any,
        num_pagos?: any
    ) {
        this.curmatid = curmatid;
        this.curid = curid;
        this.rolid = rolid;
        this.curnombre = curnombre;
        this.matnombre = matnombre;
        this.rolnombre = rolnombre;
        this.matid = matid;
        this.matnivel = matnivel;
        this.curnivel = curnivel;
        this.pernombres = pernombres;
        this.perapepat = perapepat;
        this.perapemat = perapemat;
        this.pernomcompleto = pernomcompleto;
        this.pernrodoc = pernrodoc;
        this.periddocente = periddocente;
        this.curmatfecini = curmatfecini;
        this.curmatfecfin = curmatfecfin;
        this.curmatestado = curmatestado;
        this.curmatestadodescripcion = curmatestadodescripcion;
        this.curmatusureg = curmatusureg;
        this.curmatfecreg = curmatfecreg;
        this.curmatusumod = curmatusumod;
        this.curmatfecmod = curmatfecmod;
        this.curmatidrol = curmatidrol;
        this.curmatidroldes = curmatidroldes;
        this.perfoto = perfoto;
        this.tipo = tipo;
        this.curmatcosto = curmatcosto;
        this.num_estudiantes = num_estudiantes;
        this.num_pagos = num_pagos;
    }
}

export class Curso {
    curid?: number;
    curnombre?: string | null;
    curestadodescripcion?: string | null;
    curnivel?: number;
    curfchini?: Date | null;
    curfchfin?: Date | null;
    curusureg?: string | null;
    curfecreg?: Date | null;
    curusumod?: string | null;
    curfecmod?: Date | null;
    curestado?: number;
    curdesnivel?: string | null;
    curdescripcion?: string | null;

    constructor(
        curid?: number,
        curnombre?: string | null,
        curestadodescripcion?: string | null,
        curnivel?: number,
        curfchini?: Date | null,
        curfchfin?: Date | null,
        curusureg?: string | null,
        curfecreg?: Date | null,
        curusumod?: string | null,
        curfecmod?: Date | null,
        curestado?: number,
        curdesnivel?: string | null,
        curdescripcion?: string | null
    ) {
        this.curid = curid;
        this.curnombre = curnombre;
        this.curestadodescripcion = curestadodescripcion;
        this.curnivel = curnivel;
        this.curfchini = curfchini;
        this.curfchfin = curfchfin;
        this.curusureg = curusureg;
        this.curfecreg = curfecreg;
        this.curusumod = curusumod;
        this.curfecmod = curfecmod;
        this.curestado = curestado;
        this.curdesnivel = curdesnivel;
        this.curdescripcion = curdescripcion;
    }
}
