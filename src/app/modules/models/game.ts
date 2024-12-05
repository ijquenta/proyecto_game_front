export class Usuario {
    id_usuario?: number = 0;
    nombre?: string = '';
    apellido?: string = '';
    email?: string = '';
    numero_carnet?: string = '';
    telefono?: string = '';
    fecha_nacimiento?: string = '';
    rol?: string = '';
    fecha_creacion?: string = '';
    estado?: 'activo' | 'inactivo' = 'activo';
}

export class Paciente {
    id_paciente?: number = 0;
    id_usuario?: number = 0;
    usuario?: Usuario = new Usuario(); // Added nested Usuario object
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
    id_usuario?: number = 0;
    usuario?: Usuario = new Usuario(); // Added nested Usuario object
    especialidad?: string = '';
    estado?: 'activo' | 'inactivo' = 'activo';
}

export class Administrador {
    id_administrador?: number = 0;
    id_usuario?: number = 0;
    usuario?: Usuario = new Usuario(); // Added nested Usuario object
    estado?: 'activo' | 'inactivo' = 'activo';
}

export class Sesion {
    id_session?: number = 0;
    id_paciente?: number = 0;
    paciente?: Paciente = new Paciente(); // Added nested Paciente object
    id_doctor?: number = 0;
    doctor?: Doctor = new Doctor(); // Added nested Doctor object
    fecha_sesion?: string = '';
    tiempo_sesion?: number = 0;
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