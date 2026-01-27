import { Permiso } from './permiso.model';

export interface Rol {
    id: number;
    nombre: string;
    descripcion?: string;
    permisos?: Permiso[];
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
}

export interface RolDto {
    nombre: string;
    descripcion?: string;
    permisos?: { id: number }[];
}
