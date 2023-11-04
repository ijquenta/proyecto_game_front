export class Cargo {
    idRhaCargo: number;
    descripcion: string;
    constructor(idRhaCargo: number,descripcion: string){
        this.idRhaCargo = idRhaCargo;
        this.descripcion = descripcion;
    }
}

export class Nivel {
    descripcion16: string = ""
    idRhaNivel: number = 0
    constructor(idRhaNivel: number,descripcion16: string){
        this.idRhaNivel = idRhaNivel;
        this.descripcion16 = descripcion16;
    }
}

export class Apertura {
    descripcion: string = ""
    idApertura: number = 0
    constructor(idApertura: number,descripcion: string){
        this.idApertura = idApertura;
        this.descripcion = descripcion;
    }
}

export class TipoAportante {
}
export class TipoEstudio {
    idRhaTipoEstudio:number|null = null;
    descripcion:string|null = null;
    constructor(idRhaTipoEstudio:number|null, descripcion:string|null){
        this.idRhaTipoEstudio=idRhaTipoEstudio;
        this.descripcion=descripcion;
    }
}
export class TipoAFP {
}
export class Mes {
    codigoMes :number = 12;
    descripcionMes:string = "";

    constructor(mes: number, descripcionMes:string ){
        this.codigoMes = mes;
        this.descripcionMes = descripcionMes;
    }
}

export class Autoridad{
    idRhaTipoAutoridad:number = 0;
    descripcionAutoridad: string = '';
    constructor(idRhaTipoAutoridad: number,descripcionAutoridad: string){
        this.idRhaTipoAutoridad = idRhaTipoAutoridad;
        this.descripcionAutoridad = descripcionAutoridad;
    }
}
export class TipoAutoridad{
    idRhaTipoTipoAutoridad: number = 0;
    descripcionTipoAutoridad: string = '';
    constructor(idRhaTipoTipoAutoridad: number,descripcionTipoAutoridad: string){
        this.idRhaTipoTipoAutoridad = idRhaTipoTipoAutoridad;
        this.descripcionTipoAutoridad = descripcionTipoAutoridad;
    }
}
export class TipoModificacion{
    idTipoModificacion: number =  1;
    descripcionTipoModificacion: string = 'ADICIONAL';
}

//mod
export class TipoMotivo{
    codTipoMotivo: number = 0;
    desTipoMotivo: string = '';
    constructor(codTipoMotivo: number,desTipoMotivo: string){
        this.codTipoMotivo = codTipoMotivo;
        this.desTipoMotivo = desTipoMotivo;
    }
}


//Deduciones
export class TipoDeduccion{
    codTipoDeduccion: number = 0;
    desTipoDeduccion: string = '';
    constructor(codTipoDeduccion: number,desTipoDeduccion: string){
        this.codTipoDeduccion = codTipoDeduccion;
        this.desTipoDeduccion = desTipoDeduccion;
    }
}


//--------------------- CursoMateria ---------------------//
export class TipoCurso {
    curid: number = 0;
    curnombre: string = '';
    curnivel: number = 0;
    constructor(codTipoCurso: number,desTipoCurso: string, codCurnivel: number){
        this.curid = codTipoCurso;
        this.curnombre = desTipoCurso;
        this.curnivel = codCurnivel;
    }
}
// export class TipoRol {
//     codTipoRol: number = 0;
//     desTipoRolNombre: string = '';
//     desTipoRolApePat: string = '';
//     desTipoRolApeMat: string = '';
//     constructor(codTipoRol: number, desTipoRolApePat: string, desTipoRolApeMat: string, desTipoRolNombre: string){
//         this.codTipoRol = codTipoRol;
//         this.desTipoRolApePat = desTipoRolApePat;
//         this.desTipoRolApeMat = desTipoRolApeMat;
//         this.desTipoRolNombre = desTipoRolNombre;
//     }
// }
export class TipoRol {
    rolid: number = 0;
	rolnombre: string = '';
    constructor(codrolid: number, desrolnombre: string){
        this.rolid = codrolid;
        this.rolnombre = desrolnombre;
    }
}
export class TipoPersona {
    perid: number = 0;
    pernombrecompleto: string = '';
    constructor(codperid: number, despernombrecompleto: string){
        this.perid = codperid;
        this.pernombrecompleto = despernombrecompleto;
    }
}
//--------------------- CursoMateria ---------------------//
export class TipoModulo {
    codTipoModulo: number = 0;
    desTipoModulo: string = '';
    constructor(codTipoModulo: number,desTipoModulo: string){
        this.codTipoModulo = codTipoModulo;
        this.desTipoModulo = desTipoModulo;
    }
}
export class TipoEstado {
    codTipoEstado: number = 0;
    desTipoEstado: string = '';
    constructor(codTipoEstado: number,desTipoEstado: string){
        this.codTipoEstado = codTipoEstado;
        this.desTipoEstado = desTipoEstado;
    }
}
export class TipoNivelEstado {
    codTipoNivelEstado: number = 0;
    desTipoNivelEstado: string = '';
    constructor(codTipoNivelEstado: number,desTipoNivelEstado: string){
        this.codTipoNivelEstado = codTipoNivelEstado;
        this.desTipoNivelEstado = desTipoNivelEstado;
    }
}
export class TipoMateria {
    matid: number = 0;
    matnombre: string = '';
    matnivel: number = 0;
    constructor(codTipoMateria: number, desTipoMateria: string, codMatNivel: number){
        this.matid = codTipoMateria;
        this.matnombre = desTipoMateria;
        this.matnivel = codMatNivel;
    }
}
//--------------------- CursoMatricuña ---------------------//
export class TipoEstadoMatricula {
    matrestado: number = 0;
    matrestadodescripcion: string = '';
    constructor(matrestado: number, matrestadodescripcion: string){
        this.matrestado = matrestado;
        this.matrestadodescripcion = matrestadodescripcion;
    }
}
