export class Persona {
    tipo: number;
    perid: number | null = null;
    pernomcompleto: string = "";
    pernombres: string = "";
    perapepat: string = "";
    perapemat: string;
    perfecnac: any; // Puedes asignar una fecha por defecto si es aplicable
    perdirec: string;
    peremail: string;
    percelular: string;
    pertelefono: string;
    perpais: number;
    paisnombre: string;
    pergenero: number;
    generonombre: string;
    perestcivil: number;
    estadocivilnombre: string;
    perfoto: any;
    perusureg: string = "";
    perobservacion: string = "";
    perfecreg: Date = new Date();
    perusumod: string = "";
    perfecmod: Date = new Date();
    perestado: number = 1;
	pertipodoc: number;
    tipodocnombre: string;
	pernrodoc: any;
	perciudad: number;
    ciudadnombre: string;
    usuid: any;
    usuname: string;
    usuemail: string;

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
    tipo?: number; // tipo de operación a realizar

    perid?: number | null = null;
    pernomcompleto?: string | null;
    pernombres?: string | null;
    perapepat?: string | null;
    perapemat?: string | null;
    pertipodoc?: number | null;;
    tipodocnombre?: string | null;;
    pernrodoc?: any | null;;
    perfecnac?: any | null;;
    pergenero?: number | null;;
    generonombre?: string | null;;
    perfoto?: any | null;;
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
