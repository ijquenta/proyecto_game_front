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
}
/*
export class Inscripcion {
    insid?: number;
    perfoto?: string | null;
    pernombrecompleto?: string | null;
    tipo?:number;
    matricula: {
      matrid?: number | null;
      matrestado?: number | null;
      matrdescripcion?: string | null;
      tipmatrid?: number | null;
      tipmatrgestion?: string | null;
    }[] = [];
    estudiante: {
      peridestudiante?: number | null;
      pernombrecompletoestudiante?: string;
      peridrol?: number | null;
      rolnombre?: string | null;
      perfoto?: string | null;
    }[] = [];
    pago: {
      pagid?: number | null;
      pagdescripcion?: string;
      pagestado?: number | null;
      pagestadodescripcion?: string | null;
      pagmonto?: number | null;
    }[] = [];
    insusureg?: string | null;
    insfecreg?: string | null;
    insusumod?: string | null;
    insfecmod?: string | null;
    insestado?: number | null;
    insestadodescripcion?: string | null;
    curso_materia: {
      curmatid?: number | null;
      curmatdescripcion?: string | null;
      curid?: number | null;
      curnombre?: string;
      matid?: number | null;
      matnombre?: string;
      curmatfecini?: string;
      curmatfecfin?: string;
    }[] = [];
    docente: {
      periddocente?: number | null;
      pernombrecompletodocente?: string;
      perfoto?: string;
    }[] = [];
  }*/
//   m.matrid, m.tipmatrid, tm.tipmatrgestion, m.peridestudiante, p.pernomcompleto, p.perfoto
  export class TipoMatriculaEstudiante {
    matrid: number = 0;
    tipmatrid: number = 0;
    tipmatrgestion: string = '';
    peridestudiante: number = 0;
    pernomcompleto: string = '';
    perfoto: string = '';
    constructor(matrid: number, tipmatrid: number, tipmatrgestion: string, peridestudiante: number, pernomcompleto: string, perfoto: string) {
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
    tipo?:number;
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
  }