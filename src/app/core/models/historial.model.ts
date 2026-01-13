// src/app/core/models/historial.model.ts

export interface HistorialPrediccion {
    id: number;
    customerID: string;
    fechaPrediccion: string;
    probabilidad: number;
    resultado: string;
    riskLevel: string;
    recommendations: string[];
}

export interface HistorialPrediccionDto {
    customerID: string;
    fechaPrediccion?: string;
    probabilidad: number;
    resultado: string;
    riskLevel: string;
    recommendations: string[];
}

export interface PageContent<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

export interface ApiResponse<T> {
    data: T;
    message: string;
    success: boolean;
}
