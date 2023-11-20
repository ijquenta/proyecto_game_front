export class Usuario {
    // id: number = 0;
    // usuario: string = '';
    // password: string = '';
    // email: string = '';
    tipo: number | null = null;
    usuid: number | null = null;
	perid: number | null = null;
	rolid: number | null = null;
	usuname: string = '';
	usupassword: string = '';
	usupasswordhash: string = '';
	usuemail: string = '';
	usuimagen: string = '';
	usudescripcion: string = '';
	usuestado: number | null = null;
	usuusureg: string = '';
	usufecreg: any;
	usuusumod: string = '';
	usufecmod: any;

    //
    pernomcompleto: string = '';
    pernrodoc: number | null = null;
    rolnombre: string = '';
}
interface InventoryStatus {
    label: string;
    value: string;
}
