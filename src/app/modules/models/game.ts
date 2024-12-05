
export class Paciente {
    id_paciente?: number = 0;
    id_usuario?: number = 0;
    diagnostico?: string = '';
    fecha_ingreso?: string = '';
    rango_movimiento?: string = '';
    fuerza?: string = '';
    estabilidad?: string = '';
    descripcion?: string = '';
    observacion?: string = '';
    estado?: 'activo' | 'inactivo' = 'activo';
}

export class Doctor {
    id_doctor?: number = 0;
    id_usuario?: number = 0; // Referencia al usuario
    especialidad?: string = '';
    estado?: 'activo' | 'inactivo' = 'activo';
}

export class Administrador {
    id_administrador?: number = 0;
    id_usuario?: number = 0; // Referencia al usuario
    estado?: 'activo' | 'inactivo' = 'activo';
}

export class Sesion {
    id_session?: number = 0;
    id_paciente?: number = 0; // Referencia al paciente
    id_doctor?: number = 0; // Referencia al doctor
    fecha_sesion?: Date = new Date();
    tiempo_sesion?: number = 0; // En minutos
    puntaje_obtenido?: number = 0;
    descripcion?: string = '';
    observaciones?: string = '';
    ejercicios_realizados?: string = '';
    nivel_dificultad?: 'bajo' | 'medio' | 'alto' = 'bajo';
    estado_emocional?: 'bueno' | 'regular' | 'malo' = 'bueno';
    mejoras_observadas?: string = '';
    resultados_prueba?: string = '';
    notas?: string = '';
    feedback?: string = '';
    estado?: 'activo' | 'inactivo' = 'activo';
}