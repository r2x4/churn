// src/app/core/models/usuario.model.ts

export interface Rol {
    id: number;
    nombre: string;
}

export interface Usuario {
    id: string;
    nombre: string;
    papellido: string;  // Backend devuelve en minúsculas
    sapellido: string;  // Backend devuelve en minúsculas
    email: string;
    telefono: string;
    fechaNacimiento: string;
    genero: string;  // Backend devuelve "Masculino" no "MASCULINO"
    tieneConyuge: boolean;
    tieneDependientes: boolean;
    activo?: boolean;  // Opcional porque el backend usa isEnabled
    isEnabled?: boolean;  // Campo adicional del backend
    roles: Rol[];
}

export interface UsuarioDto {
    id?: string;
    nombre: string;
    papellido: string;  // Backend espera en minúsculas
    sapellido: string;  // Backend espera en minúsculas
    email: string;
    password?: string;
    telefono: string;
    fechaNacimiento: string;
    genero: string;
    tieneConyuge: boolean;
    tieneDependientes: boolean;
    roles?: number[]; // IDs de los roles
}
