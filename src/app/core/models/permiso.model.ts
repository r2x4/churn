import { Rol } from './rol.model';

export interface Permiso {
    id: number;
    nombre: string;
    descripcion?: string;
    roles?: Rol[];
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
}

export interface PermisoDto {
    nombre: string;
    descripcion?: string;
}
