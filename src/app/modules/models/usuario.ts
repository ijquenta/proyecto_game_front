import { Role } from './roles.type';

export class Usuario {
    tipo: number | null;
    usuid: number | null;
    perid: number | null;
    rolid: number | null;
    usuname: string | null;
    usupassword: string | null;
    usupasswordhash: string | null;
    usuemail: string | null;
    usudescripcion: string | null;
    usuestado: number | null;
    usuusureg: string | null;
    usufecreg: any | null;
    usuusumod: string | null;
    usufecmod: any | null;

    perfoto: string | null;
    pernomcompleto: string | null;
    pernrodoc: number | null;
    rolnombre: string | null;

    constructor(
        tipo: number | null = null,
        usuid: number | null = null,
        perid: number | null = null,
        rolid: number | null = null,
        usuname: string | null = null,
        usupassword: string | null = null,
        usupasswordhash: string | null = null,
        usuemail: string | null = null,
        usudescripcion: string | null = null,
        usuestado: number | null = null,
        usuusureg: string | null = null,
        usufecreg: any | null = null,
        usuusumod: string | null = null,
        usufecmod: any | null = null,
        perfoto: string | null = null,
        pernomcompleto: string | null = null,
        pernrodoc: number | null = null,
        rolnombre: string | null = null
    ) {
        this.tipo = tipo;
        this.usuid = usuid;
        this.perid = perid;
        this.rolid = rolid;
        this.usuname = usuname;
        this.usupassword = usupassword;
        this.usupasswordhash = usupasswordhash;
        this.usuemail = usuemail;
        this.usudescripcion = usudescripcion;
        this.usuestado = usuestado;
        this.usuusureg = usuusureg;
        this.usufecreg = usufecreg;
        this.usuusumod = usuusumod;
        this.usufecmod = usufecmod;
        this.perfoto = perfoto;
        this.pernomcompleto = pernomcompleto;
        this.pernrodoc = pernrodoc;
        this.rolnombre = rolnombre;
    }
}
