export class CursoMateria {
	curmatid?: number = 0;
    curid?: number = 0;
    rolid?: number = 0;
    curnombre?: string | null = null;
	matnombre?: string | null = null;
	rolnombre?: string | null = null;
	matid?: number = 0;
    matnivel?: number = 0;
    curnivel?: number = 0;
	pernombres?: string | null = null;
	perapepat?: string | null = null;
	perapemat?: string | null = null;
    pernomcompleto?: string | null = null;
    pernrodoc?: any;
	periddocente?: number = 0;
	curmatfecini?: any;
	curmatfecfin?: any;
	curmatestado?: number = 0;
	curmatestadodescripcion?: string | null = null;
	curmatusureg?: string | null = null;
	curmatfecreg?: string | null = null;
	curmatusumod?: string | null = null;
	curmatfecmod?: string | null = null;
    curmatidrol?: number = 0;
    curmatidroldes?: string | null = null;
    perfoto?: any;
    tipo?: any;
    curmatcosto?: any;

    num_estudiantes?: any;
    num_pagos?: any;
}

export class Curso {
    curid?: number = 0;
    curnombre?: string | null = null;
    curestadodescripcion?: string | null = null;
    curnivel?: number = 0;
    curfchini?: Date | null = null;
    curfchfin?: Date | null = null;
    curusureg?: string | null = null;
    curfecreg?: Date | null = null;
    curusumod?: string | null = null;
    curfecmod?: Date | null = null;
    curestado?: number = 0;
    curdesnivel?: string | null = null;
    curdescripcion?: string | null = null;
}
