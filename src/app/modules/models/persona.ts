export class Persona {
    perid: number;
    pernombres: string = "";
    perapepat: string = "";
    perapemat?: string;
    perfecnac: Date | null;
    perdomicilio?: string;
    peridpais: number | null;
    perpais?: string;
    peridgenero: number | null;
    pergenero?: string;
    percorreoelectronico?: string;
    percelular?: string;
    pertelefono?: string;
    perfoto?: any; // Puedes ajustar el tipo según cómo estés manejando las imágenes
    perusureg: string = "";
    perfecreg: any;
    perusumod: string = "";
    perfecmod: any;
    perestado: number = 1;
}
