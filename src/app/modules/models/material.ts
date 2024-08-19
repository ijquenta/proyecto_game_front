export class Material {
    mattexid: any;
    matid: any;
    matnombre: any;
    texid: any;
    texnombre: any;
    textipo: any;
    texdocumento: any;
    texusureg: any;
    texfecreg: any;
    texusumod: any;
    texfecmod: any;
    texestado: any;
}

// Modelo para TipoTexto
export class TipoTexto {
    tiptexid: number;
    tiptexnombre: string;

    constructor(tiptexid: number, tiptexnombre: string) {
        this.tiptexid = tiptexid;
        this.tiptexnombre = tiptexnombre;
    }
}

// Modelo para TipoIdiomaTexto
export class TipoIdiomaTexto {
    tipidiid: number;
    tipidinombre: string;

    constructor(tipidiid: number, tipidinombre: string) {
        this.tipidiid = tipidiid;
        this.tipidinombre = tipidinombre;
    }
}

// Modelo para TipoCategoriaTexto
export class TipoCategoriaTexto {
    tipcatid: number;
    tipcatnombre: string;

    constructor(tipcatid: number, tipcatnombre: string) {
        this.tipcatid = tipcatid;
        this.tipcatnombre = tipcatnombre;
    }
}

// Modelo para TipoExtensionTexto
export class TipoExtensionTexto {
    tipextid: number;
    tipextnombre: string;

    constructor(tipextid: number, tipextnombre: string) {
        this.tipextid = tipextid;
        this.tipextnombre = tipextnombre;
    }
}

// Modelo para TipoExtensionTexto
export class TipoFormatoTexto {
    tipforid: number;
    tipfornombre: string;

    constructor(tipforid: number, tipfornombre: string) {
        this.tipforid = tipforid;
        this.tipfornombre = tipfornombre;
    }
}


// Modelo para Texto
export class Texto {
    texid: number;
    texnombre: string;
    textipo: number;
    texformato: number;
    texdocumento: string;
    texruta: string;
    texdescripcion: string;
    texautor: string;
    texsize: number;
    texextension: number;
    texidioma: number;
    texfecpublicacion: string;
    texcategoria: number;
    texusureg: string;
    texfecreg: string;
    texusumod: string;
    texfecmod: string;
    texestado: number;

    constructor(
        texid: number,
        texnombre: string,
        textipo: number,
        texformato: number,
        texdocumento: string,
        texruta: string,
        texdescripcion: string,
        texautor: string,
        texsize: number,
        texextension: number,
        texidioma: number,
        texfecpublicacion: string,
        texcategoria: number,
        texusureg: string,
        texfecreg: string,
        texusumod: string,
        texfecmod: string,
        texestado: number
    ) {
        this.texid = texid;
        this.texnombre = texnombre;
        this.textipo = textipo;
        this.texformato = texformato;
        this.texdocumento = texdocumento;
        this.texruta = texruta;
        this.texdescripcion = texdescripcion;
        this.texautor = texautor;
        this.texsize = texsize;
        this.texextension = texextension;
        this.texidioma = texidioma;
        this.texfecpublicacion = texfecpublicacion;
        this.texcategoria = texcategoria;
        this.texusureg = texusureg;
        this.texfecreg = texfecreg;
        this.texusumod = texusumod;
        this.texfecmod = texfecmod;
        this.texestado = texestado;
    }
}

// Modelo para MateriaTexto
export class MateriaTexto {
    mattexid: number;
    matid: number;
    texid: number;
    mattexdescripcion: string;
    mattexusureg: string;
    mattexfecreg: string; // Fecha en formato ISO
    mattexusumod: string;
    mattexfecmod: string; // Fecha en formato ISO
    mattexestado: number;

    constructor(
        mattexid: number,
        matid: number,
        texid: number,
        mattexdescripcion: string,
        mattexusureg: string,
        mattexfecreg: string,
        mattexusumod: string,
        mattexfecmod: string,
        mattexestado: number
    ) {
        this.mattexid = mattexid;
        this.matid = matid;
        this.texid = texid;
        this.mattexdescripcion = mattexdescripcion;
        this.mattexusureg = mattexusureg;
        this.mattexfecreg = mattexfecreg;
        this.mattexusumod = mattexusumod;
        this.mattexfecmod = mattexfecmod;
        this.mattexestado = mattexestado;
    }
}
