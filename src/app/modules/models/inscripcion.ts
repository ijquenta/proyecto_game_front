export class InscripcionRegistro {
    insid?: number = 0;
    matrid?: number | null = null;
    tipmatrgestion?: string | null = null;
    peridestudiante?: number | null = null;
    pagid?: number | null = null;
    insusureg?: string | null = null;
    insusumod?: string | null = null;
    perfoto?: string | null = null;
    curmatid?: number | null = null;
    insestado?: number | null = null;
    insestadodescripcion?: string | null = null;
    constructor(
        insid?: number,
        matrid?: number | null,
        tipmatrgestion?: string | null,
        peridestudiante?: number | null,
        pagid?: number | null,
        insusureg?: string | null,
        insusumod?: string | null,
        perfoto?: string | null,
        curmatid?: number | null,
        insestado?: number | null,
        insestadodescripcion?: string | null
    ) {
        this.insid = insid;
        this.matrid = matrid;
        this.tipmatrgestion = tipmatrgestion;
        this.peridestudiante = peridestudiante;
        this.pagid = pagid;
        this.insusureg = insusureg;
        this.insusumod = insusumod;
        this.perfoto = perfoto;
        this.curmatid = curmatid;
        this.insestado = insestado;
        this.insestadodescripcion = insestadodescripcion;
    }
}

export class TipoMatriculaEstudiante {
    matrid: number;
    tipmatrid: number;
    tipmatrgestion: string;
    peridestudiante: number;
    pernomcompleto: string;
    perfoto: string;

    constructor(
        matrid: number,
        tipmatrid: number,
        tipmatrgestion: string,
        peridestudiante: number,
        pernomcompleto: string,
        perfoto: string
    ) {
        this.matrid = matrid;
        this.tipmatrid = tipmatrid;
        this.tipmatrgestion = tipmatrgestion;
        this.peridestudiante = peridestudiante;
        this.pernomcompleto = pernomcompleto;
        this.perfoto = perfoto;
    }
}

export class Inscripcion {
    insid?: number;
    perfoto?: string | null;
    pernombrecompleto?: string | null;
    tipo?: number;
    matrid?: number | null;
    matrestado?: number | null;
    matrdescripcion?: string | null;
    tipmatrid?: number | null;
    tipmatrgestion?: string | null;
    peridestudiante?: number | null;
    pernombrecompletoestudiante?: string;
    peridrol?: number | null;
    rolnombre?: string | null;
    pagid?: number | null;
    pagdescripcion?: string;
    pagestado?: number | null;
    pagestadodescripcion?: string | null;
    pagmonto?: number | null;
    insusureg?: string | null;
    insfecreg?: string | null;
    insusumod?: string | null;
    insfecmod?: string | null;
    insestado?: number | null;
    insestadodescripcion?: string | null;
    curmatid?: number | null;
    curmatdescripcion?: string | null;
    curid?: number | null;
    curnombre?: string;
    matid?: number | null;
    matnombre?: string;
    curmatfecini?: string;
    curmatfecfin?: string;
    periddocente?: number | null;
    pernombrecompletodocente?: string;
    curnivel?: number | null;
    perfotoestudiante?: string;
    curfchini: string | null;
    curfchfin: string | null;

    constructor(
        insid?: number,
        perfoto?: string | null,
        pernombrecompleto?: string | null,
        tipo?: number,
        matrid?: number | null,
        matrestado?: number | null,
        matrdescripcion?: string | null,
        tipmatrid?: number | null,
        tipmatrgestion?: string | null,
        peridestudiante?: number | null,
        pernombrecompletoestudiante?: string,
        peridrol?: number | null,
        rolnombre?: string | null,
        pagid?: number | null,
        pagdescripcion?: string,
        pagestado?: number | null,
        pagestadodescripcion?: string | null,
        pagmonto?: number | null,
        insusureg?: string | null,
        insfecreg?: string | null,
        insusumod?: string | null,
        insfecmod?: string | null,
        insestado?: number | null,
        insestadodescripcion?: string | null,
        curmatid?: number | null,
        curmatdescripcion?: string | null,
        curid?: number | null,
        curnombre?: string,
        matid?: number | null,
        matnombre?: string,
        curmatfecini?: string,
        curmatfecfin?: string,
        periddocente?: number | null,
        pernombrecompletodocente?: string,
        curnivel?: number | null,
        perfotoestudiante?: string,
        curfchini?: string,
        curfchfin?: string
    ) {
        this.insid = insid;
        this.perfoto = perfoto;
        this.pernombrecompleto = pernombrecompleto;
        this.tipo = tipo;
        this.matrid = matrid;
        this.matrestado = matrestado;
        this.matrdescripcion = matrdescripcion;
        this.tipmatrid = tipmatrid;
        this.tipmatrgestion = tipmatrgestion;
        this.peridestudiante = peridestudiante;
        this.pernombrecompletoestudiante = pernombrecompletoestudiante;
        this.peridrol = peridrol;
        this.rolnombre = rolnombre;
        this.pagid = pagid;
        this.pagdescripcion = pagdescripcion;
        this.pagestado = pagestado;
        this.pagestadodescripcion = pagestadodescripcion;
        this.pagmonto = pagmonto;
        this.insusureg = insusureg;
        this.insfecreg = insfecreg;
        this.insusumod = insusumod;
        this.insfecmod = insfecmod;
        this.insestado = insestado;
        this.insestadodescripcion = insestadodescripcion;
        this.curmatid = curmatid;
        this.curmatdescripcion = curmatdescripcion;
        this.curid = curid;
        this.curnombre = curnombre;
        this.matid = matid;
        this.matnombre = matnombre;
        this.curmatfecini = curmatfecini;
        this.curmatfecfin = curmatfecfin;
        this.periddocente = periddocente;
        this.pernombrecompletodocente = pernombrecompletodocente;
        this.curnivel = curnivel;
        this.perfotoestudiante = perfotoestudiante;
        this.curfchini = curfchini;
        this.curfchfin = curfchfin;
    }
}
