// Modelo para Matricula
export class Matricula {
    matrid?: number;
    matrgestion?: number;
    matrfec?: any;
    tipmatrid?: number;
    tipmatrgestion?: string;
    tipmatrfecini?: any;
    tipmatrfecfin?: any;
    tipmatrcosto?: number;
    peridestudiante?: number;
    pernomcompleto?: string;
    pernrodoc?: string;
    perfoto?: string;
    pagoidmatricula?: number;
    pagdescripcion?: string;
    pagmonto?: number;
    pagarchivo?: string;
    pagfecha?: any;
    pagtipo?: number;
    pagestado?: number;
    matrusureg?: string;
    matrfecreg?: any;
    matrusumod?: string;
    matrfecmod?: any;
    matrestado?: number;
    matrdescripcion?: string;
    tipo?: number;

    constructor(
        matrid?: number,
        matrgestion?: number,
        matrfec?: any,
        tipmatrid?: number,
        tipmatrgestion?: string,
        tipmatrfecini?: any,
        tipmatrfecfin?: any,
        tipmatrcosto?: number,
        peridestudiante?: number,
        pernomcompleto?: string,
        pernrodoc?: string,
        perfoto?: string,
        pagoidmatricula?: number,
        pagdescripcion?: string,
        pagmonto?: number,
        pagarchivo?: string,
        pagfecha?: any,
        pagtipo?: number,
        pagestado?: number,
        matrusureg?: string,
        matrfecreg?: any,
        matrusumod?: string,
        matrfecmod?: any,
        matrestado?: number,
        matrdescripcion?: string,
        tipo?: number
    ) {
        this.matrid = matrid;
        this.matrgestion = matrgestion;
        this.matrfec = matrfec;
        this.tipmatrid = tipmatrid;
        this.tipmatrgestion = tipmatrgestion;
        this.tipmatrfecini = tipmatrfecini;
        this.tipmatrfecfin = tipmatrfecfin;
        this.tipmatrcosto = tipmatrcosto;
        this.peridestudiante = peridestudiante;
        this.pernomcompleto = pernomcompleto;
        this.pernrodoc = pernrodoc;
        this.perfoto = perfoto;
        this.pagoidmatricula = pagoidmatricula;
        this.pagdescripcion = pagdescripcion;
        this.pagmonto = pagmonto;
        this.pagarchivo = pagarchivo;
        this.pagfecha = pagfecha;
        this.pagtipo = pagtipo;
        this.pagestado = pagestado;
        this.matrusureg = matrusureg;
        this.matrfecreg = matrfecreg;
        this.matrusumod = matrusumod;
        this.matrfecmod = matrfecmod;
        this.matrestado = matrestado;
        this.matrdescripcion = matrdescripcion;
        this.tipo = tipo;
    }
}

// Modelo para TipoMatricula
export class TipoMatricula {
    tipmatrid?: number;
    tipmatrgestion?: string;
    tipmatrfecini?: any;
    tipmatrfecfin?: any;
    tipmatrcosto?: number;
    tipmatrusureg?: string;
    tipmatrufecreg?: any;
    tipmatrusumod?: string;
    tipmatrfecmod?: any;
    tipmatrestado?: number;
    tipmatrdescripcion?: string;
    tipo?: number;

    constructor(
        tipmatrid?: number,
        tipmatrgestion?: string,
        tipmatrfecini?: any,
        tipmatrfecfin?: any,
        tipmatrcosto?: number,
        tipmatrusureg?: string,
        tipmatrufecreg?: any,
        tipmatrusumod?: string,
        tipmatrfecmod?: any,
        tipmatrestado?: number,
        tipmatrdescripcion?: string,
        tipo?: number
    ) {
        this.tipmatrid = tipmatrid;
        this.tipmatrgestion = tipmatrgestion;
        this.tipmatrfecini = tipmatrfecini;
        this.tipmatrfecfin = tipmatrfecfin;
        this.tipmatrcosto = tipmatrcosto;
        this.tipmatrusureg = tipmatrusureg;
        this.tipmatrufecreg = tipmatrufecreg;
        this.tipmatrusumod = tipmatrusumod;
        this.tipmatrfecmod = tipmatrfecmod;
        this.tipmatrestado = tipmatrestado;
        this.tipmatrdescripcion = tipmatrdescripcion;
        this.tipo = tipo;
    }
}

// Modelo para TiposMatricula (Combo)
export class TiposMatricula {
    tipmatrid: number;
    tipmatrgestion: string;

    constructor(tipmatrid: number, tipmatrgestion: string) {
        this.tipmatrid = tipmatrid;
        this.tipmatrgestion = tipmatrgestion;
    }
}

// Modelo para TipoPersonaEstudiante
export class TipoPersonaEstudiante {
    perid: number;
    pernomcompleto: string;
    perfoto: string;

    constructor(perid: number, pernomcompleto: string, perfoto: string) {
        this.perid = perid;
        this.pernomcompleto = pernomcompleto;
        this.perfoto = perfoto;
    }
}
