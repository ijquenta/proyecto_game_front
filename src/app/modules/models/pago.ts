export class Pago {
    tipo: any;
    pagid: any;
    pagdescripcion: any;
    pagmonto: any;
    pagdoc: any;
    pagusureg: any;
    pagfecreg: any;
    pagusumod: any;
    pagfecmod: any;
    pagfecha: any;
    pagtipo: any;
    insid: any ;
    matrid: any ;
    matrgestion: any ;
    curmatid: any ;
    curnombre: any ;
    matnombre: any ;
    peridestudiante: any ;
    pernomcompleto: any;
    pagarchivo: any;
    archivobol: any;
    perfoto:any;
    pagestado: any;
    curid: any;
    matid: any;
}


export class TipoPago {
    tpagid: number = 0;
    tpagnombre: string = '';
    constructor(tpagid: number, tpagnombre: string){
        this.tpagid = tpagid;
        this.tpagnombre = tpagnombre;
    }
}
