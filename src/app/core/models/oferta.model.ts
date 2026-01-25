// src/app/core/models/oferta.model.ts

export interface Oferta {
    id: number;
    nombre: string;
    descripcion: string;
    descuentoPorcentaje: number;
    esExclusivaChurn: boolean;
    deletedAt?: string;
}

export interface OfertaDto {
    id?: number;
    nombre: string;
    descripcion: string;
    descuentoPorcentaje: number;
    esExclusivaChurn: boolean;
}
