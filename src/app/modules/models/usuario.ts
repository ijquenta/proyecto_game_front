import { Role } from './roles.type';
export class Usuario {
    tipo: number | null = null;

    usuid: number | null = null;
	perid: number | null = null;
	rolid: number | null = null;
	usuname: string | null = null;
	usupassword: string | null = null;
	usupasswordhash: string | null = null;
	usuemail: string | null = null;
	usudescripcion: string | null = null;
	usuestado: number | null = null;
	usuusureg: string | null = null;
	usufecreg: any | null = null;
	usuusumod: string | null = null;
	usufecmod: any | null = null;

    perfoto: string | null = null;
    pernomcompleto: string | null = null;
    pernrodoc: number | null = null;
    rolnombre: string | null = null;
}

interface InventoryStatus {
    label: string;
    value: string;
}
