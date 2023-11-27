import { Role } from './roles.type';
export class Usuario {
    // id: number = 0;
    // usuario: string = '';
    // password: string = '';
    // email: string = '';
    tipo: number | null = null;
    usuid: number | null = null;
	perid: number | null = null;
	rolid: number | null = null;
	usuname: string | null = null;
	usupassword: string = '';
	usupasswordhash: string = '';
	usuemail: string | null = null;
	usuimagen: string | null = null;
	usudescripcion: string = '';
	usuestado: number | null = null;
	usuusureg: string = '';
	usufecreg: any;
	usuusumod: string = '';
	usufecmod: any;

    //
    pernomcompleto: string | null = null;
    pernrodoc: number | null = null;
    rolnombre: string | null = null;
}
interface InventoryStatus {
    label: string;
    value: string;
}



// export interface User {
//   username: string;
//   role: Role;
// }

// export interface UserWithToken extends User {
//   token: string;
// }
