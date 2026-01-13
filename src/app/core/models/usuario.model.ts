// src/app/core/models/usuario.model.ts

export interface Rol {
    id: number;
    nombre: string;
}

export interface Usuario {
    id: string;
    username: string;
    email: string;
    activo: boolean;
    roles: Rol[];
}

export interface UsuarioDto {
    username: string;
    email: string;
    password?: string;
    roles?: number[]; // IDs de los roles
}
