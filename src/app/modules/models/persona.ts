export class Persona {

    tipo: number;

    perid: number | null = null;
    pernomcompleto: string = "";
    pernombres: string = "";
    perapepat: string = "";
    perapemat: string;
    perfecnac: any;
    perdirec: string;
    peremail: string;
    percelular: string;
    pertelefono: string;
    perpais: number;
    paisnombre: string;
    pergenero: number;
    perestcivil: number;
    perfoto: any;
    perusureg: string = "";
    perobservacion: string = "";
    perfecreg: Date = new Date();
    perusumod: string = "";
    perfecmod: Date = new Date();
    perestado: number = 1;
	pertipodoc: number;
	pernrodoc: any;
	perciudad: number;

    generonombre: string;
    estadocivilnombre: string;
    tipodocnombre: string;
    ciudadnombre: string;
    usuid: any;
    usuname: string;
    usuemail: string;
    pernrohijos: number;
    perprofesion: string;
    perfeclugconversion: string;
    perbautismoaguas: number;
    perbautismoespiritu: number;
    pernomdiriglesia: string;
    pernompastor: string;

    // constructor(
    //     tipo: number,
    //     perid: number,
    //     pernomcompleto: string,
    //     pernombres: string,
    //     perapepat: string,
    //     perapemat: string,
    //     perfecnac: Date | null,
    //     perdirec: string,
    //     peremail: string,
    //     percelular: string,
    //     pertelefono: string,
    //     perpais: number,
    //     pergenero: number,
    //     perestcivil: number,
    //     perfoto: any,
    //     perusureg: string,
    //     perobservacion: string,
    //     perfecreg: Date,
    //     perusumod: string,
    //     perfecmod: Date,
    //     perestado: number
    // ) {
    //     this.tipo = tipo;
    //     this.perid = perid;
    //     this.pernomcompleto = pernomcompleto;
    //     this.pernombres = pernombres;
    //     this.perapepat = perapepat;
    //     this.perapemat = perapemat;
    //     this.perfecnac = perfecnac;
    //     this.perdirec = perdirec;
    //     this.peremail = peremail;
    //     this.percelular = percelular;
    //     this.pertelefono = pertelefono;
    //     this.perpais = perpais;
    //     this.pergenero = pergenero;
    //     this.perestcivil = perestcivil;
    //     this.perfoto = perfoto;
    //     this.perusureg = perusureg;
    //     this.perobservacion = perobservacion;
    //     this.perfecreg = perfecreg;
    //     this.perusumod = perusumod;
    //     this.perfecmod = perfecmod;
    //     this.perestado = perestado;
    // }

    // // Método de ejemplo
    // obtenerEdad(): number | null {
    //     if (this.perfecnac) {
    //         const hoy = new Date();
    //         const nacimiento = new Date(this.perfecnac);
    //         const edadMilisegundos = hoy.getTime() - nacimiento.getTime();
    //         const edadAnios = edadMilisegundos / (1000 * 60 * 60 * 24 * 365.25);
    //         return Math.floor(edadAnios);
    //     } else {
    //         return null;
    //     }
    // }
}
export class PersonaExpanded {
    tipo?: number;
    perid?: number | null = null;
    pernomcompleto?: string | null;
    pernombres?: string | null;
    perapepat?: string | null;
    perapemat?: string | null;
    pertipodoc?: number | null;
    tipodocnombre?: string | null;
    pernrodoc?: any | null;
    perfecnac?: Date = new Date();
    pergenero?: number | null;;
    generonombre?: string | null;
    perfoto?: any | null;
    perusureg?: string | null;
    perobservacion?: string | null;
    perfecreg?: Date = new Date();
    perusumod?: string | null;
    perfecmod?: Date = new Date();
    perestado?: number | null;
    datos: {
        percod?: number | null;
        perdirec?: string | null; // dirección
        peremail?: string | null; // correo electronico
        percelular?: string | null; // celular
        pertelefono?: string | null; // telefono
        perestcivil?: number | null; // id estado civil
        estadocivilnombre?: string | null; // name estado civil
        perpais?: number | null; // id pais
        paisnombre?: string | null; // nombre del pais
        perciudad?: number | null; // id pais
        ciudadnombre?: string | null; // nombre de la ciudad
    }[] = [];
    usuid?: any | null;
    usuname?: string | null;
    usuemail?: string | null;
  }



  export class PersonaInfoPersonal {
    perid: any;
    peredad: number | null = null;
    pernrohijos: number | null = null;
    perprofesion: number | null = null;
    perfecconversion: Date | null = null;
    perlugconversion: string = "";
    perbautizoagua: number | null = null;
    perbautizoespiritu: number | null = null;
    pernomiglesia: string = "";
    perdiriglesia: string = "";
    pernompastor: string = "";
    percelpastor: number | null = null;
    perusureg: string = "";
    perfecreg: Date = new Date();
    perusumod: string = "";
    perfecmod: Date = new Date();
    perobservacion: string = "";
    perestado: number | null = null;
    perexperiencia: number | null = null;
    permotivo: string = "";
    perplanesmetas: string = "";

    pronombre: string = "";

    constructor(init?: Partial<PersonaInfoPersonal>) {
        Object.assign(this, init);
    }
}


export class PersonaInfoAcademica {

    perinfoaca: number| null = null;
    perid: number | null = null;
    pereducacion: number | null = null;
    pernominstitucion: string = "";
    perdirinstitucion: string = "";
    pergescursadas: string = "";
    perfechas: string = "";
    pertitulo: string = "";
    perusureg: string = "";
    perfecreg: Date = new Date();
    perusumod: string = "";
    perfecmod: Date = new Date();
    perobservacion: string = "";
    perestado: number | null = null;

    edunombre: string = "";

    constructor(init?: Partial<PersonaInfoAcademica>) {
        Object.assign(this, init);
    }
}


export class PersonaInfoMinisterial {
    perinfomin: number| null = null;
    perid: number | null = null;
    pernomiglesia: string = "";
    percargo: number | null = null;
    pergestion: number | null = null;
    perusureg: string = "";
    perfecreg: Date = new Date();
    perusumod: string = "";
    perfecmod: Date = new Date();
    perobservacion: string = "";
    perestado: number | null = null;


    carnombre: string = "";

    constructor(init?: Partial<PersonaInfoMinisterial>) {
        Object.assign(this, init);
    }
}

export class PersonaDocAdmision {
    perid: number | null = null;
    perfoto: File;
    perfotoci: File;
    perfototitulo: File;
    percartapastor: File;
    perusureg: string = "";
    perfecreg: Date = new Date();
    perusumod: string = "";
    perfecmod: Date = new Date();
    perobservacion: string = "";
    perestado: number | null = null;
}

export class TipoProfesion {
    proid: number | null = null;
    pronombre: string | null = null;
    constructor(proid:number|null, pronombre:string|null){
        this.proid=proid;
        this.pronombre=pronombre;
    }
}

export class tipoProfesion {
    proid: number | null = null;
    pronombre: string | null = null;
    proobservacion: string | null = null;
    proestado: number | null = null;
    profecreg: Date = new Date();
    profecmod: Date = new Date();
    prousureg: string | null = null;
    prousumod: string | null = null;
}


export class TipoEducacion {
    eduid: number | null = null;
    edunombre: string | null = null;
    constructor(eduid:number|null, edunombre:string|null){
        this.eduid=eduid;
        this.edunombre=edunombre;
    }
}

export class tipoEducacion {
    eduid: number | null = null;
    edunombre: string | null = null;
    eduobservacion: string | null = null;
    eduestado: number | null = null;
    edufecreg: Date = new Date();
    edufecmod: Date = new Date();
    eduusureg: string | null = null;
    eduusumod: string | null = null;
}

export class TipoCargo {
    carid: number | null = null;
    carnombre: string | null = null;
    constructor(carid:number|null, carnombre:string|null){
        this.carid=carid;
        this.carnombre=carnombre;
    }
}

export class tipoCargo {
    carid: number | null = null;
    carnombre: string | null = null;
    carobservacion: string | null = null;
    carestado: number | null = null;
    carfecreg: Date = new Date();
    carfecmod: Date = new Date();
    carusureg: string | null = null;
    carusumod: string | null = null;
}

export class TipoGestion {
    gesid: number | null = null;
    constructor(gesid:number|null){
        this.gesid=gesid;
    }
}


