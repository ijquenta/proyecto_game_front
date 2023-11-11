export class InscripcionRegistro {
    insid?: number = 0;
    matrid?: number | null = null;
    matrgestion?: number | null;
    peridestudiante?: number | null = null;
    pagid?: number | null = null;
    insusureg?: string | null = null;
    insusumod?: string | null = null;
    curmatid?: number | null = null;
    insestado?: number | null = null;
    insestadodescripcion?: string | null = null;
}
export class Inscripcion {
    insid?: number;
    matricula: {
      matrid?: number | null;
      matrgestion?: number | null;
      matrestado?: number | null;
      matrestadodescripcion?: string | null;
    }[] = [];
    estudiante: {
      peridestudiante?: number | null;
      pernombrecompletoestudiante?: string;
      peridrol?: number | null;
      rolnombre?: string | null;
    }[] = [];
    pago: {
      pagid?: number | null;
      pagdescripcion?: string;
      pagestado?: number | null;
      pagestadodescripcion?: string | null;
      pagmonto?: number | null;
    }[] = [];
    insusureg?: string | null;
    insfecreg?: string | null;
    insusumod?: string | null;
    insfecmod?: string | null;
    insestado?: number | null;
    insestadodescripcion?: string | null;
    curso_materia: {
      curmatid?: number | null;
      curmatdescripcion?: string | null;
      curid?: number | null;
      curnombre?: string;
      matid?: number | null;
      matnombre?: string;
    }[] = [];
    docente: {
      periddocente?: number | null;
      pernombrecompletodocente?: string;
    }[] = [];
  }
