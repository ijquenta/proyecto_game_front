export class Matricula {
    matrid?: number = 0;
	matrgestion?: number = 0;
    matrfec?: any;
    tipmatrid ?: number = 0;
    tipmatrgestion?: string = '';
    tipmatrfecini?: any;
    tipmatrfecfin?: any;
    tipmatrcosto?: number = 0;
    peridestudiante?: number = 0;
    pernomcompleto?: string = '';
    pernrodoc?: string = '';
    perfoto?: string = '';
    pagoidmatricula?: number = 0;
    pagdescripcion?: string = '';
    pagmonto?: number = 0;
    pagarchivo?: string = '';
    pagfecha?: any;
    pagtipo?: number = 0;
    matrusureg?: string = '';
	matrfecreg?: any;
	matrusumod?: string = '';
	matrfecmod?: any;
	matrestado?: number = 0;
    matrdescripcion ?: string = '';
    tipo?: number = 0;
}
export class TipoMatricula {
	tipmatrid?: number = 0;
	tipmatrgestion?: string = '';
	tipmatrfecini?: any;
	tipmatrfecfin?: any;
	tipmatrcosto?: number = 0;
	tipmatrusureg?: string = '';
	tipmatrufecreg: any;
	tipmatrusumod?: string = '';
	tipmatrfecmod: any;
	tipmatrestado?: number = 0;
	tipmatrdescripcion?: string = '';
	tipo?: number = 0;
}

// Tipo Matricula Combo
export class TiposMatricula{
    tipmatrid: number = 0;
    tipmatrgestion: string = '';
    constructor(cod: number, des: string){
        this.tipmatrid = cod;
        this.tipmatrgestion = des;
    }
}

export class TipoPersonaEstudiante{
    perid: number = 0;
    pernomcompleto: string = '';
    perfoto: string = '';
    constructor(cod: number, nom: string, foto: string){
        this.perid = cod;
        this.pernomcompleto = nom;
        this.perfoto = foto;
    }
}
