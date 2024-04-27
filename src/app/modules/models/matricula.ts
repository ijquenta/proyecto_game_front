export class Matricula {
    matrid?: number = 0;
	matrgestion?: number = 0;
	matrestadodescripcion?: string = '';
	matrfchini?: Date | null;
	matrfchfin?: Date | null;
	matrcos?: number = 0;
	matrusureg?: string = '';
	matrfecreg?: Date | null;
	matrusumod?: string = '';
	matrfecmod?: Date | null;
	matrestado?: number = 0;
    tipo?: number = 0;
}
export class TipoMatricula {
	tipmatrid?: number = 0;
	tipmatrgestion?: string = '';
	tipmatrfecini?: Date | null;
	tipmatrfecfin?: Date | null;
	tipmatrcosto?: number = 0;
	tipmatrusureg?: string = '';
	tipmatrufecreg: Date | null;
	tipmatrusumod?: string = '';
	tipmatrfecmod: Date | null;
	tipmatrestado?: number = 0;
	tipmatrdescripcion?: string = '';
	tipo?: number = 0;
}