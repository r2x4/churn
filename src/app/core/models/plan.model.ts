// src/app/core/models/plan.model.ts

export interface Plan {
    id: number;
    nombre: string;
    montoMensual: number;
    internetService: string;
    phoneService: string;
    deletedAt?: string;
}

export interface PlanDto {
    id?: number;
    nombre: string;
    montoMensual: number;
    internetService: string;
    phoneService: string;
}

// Extended interfaces to reflect backend fields (camelCase)
export interface PlanFull {
    id: number;
    nombre?: string;
    servicioTelefono: boolean;
    servicioInternet: string;
    seguridadEnLinea: boolean;
    respaldoEnLinea: boolean;
    proteccionDispositivo: boolean;
    soporteTecnico: boolean;
    lineasMultiples: boolean;
    streamingTv: boolean;
    streamingPeliculas: boolean;
    cargoMensual: number;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string | null;
}

export interface PlanDtoFull {
    id?: number;
    nombre?: string;
    servicioTelefono?: boolean;
    servicioInternet?: string;
    seguridadEnLinea?: boolean;
    respaldoEnLinea?: boolean;
    proteccionDispositivo?: boolean;
    soporteTecnico?: boolean;
    lineasMultiples?: boolean;
    streamingTv?: boolean;
    streamingPeliculas?: boolean;
    cargoMensual?: number;
}
