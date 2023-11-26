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
	pernrodoc: number;
	perciudad: number;
    ciudadnombre: string;

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
