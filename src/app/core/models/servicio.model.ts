export interface Servicio {
    id: number;
    idUsuario: string;
    idPlan: number;
    ultimaFechaPago: string; // ISO string
    facturacionElectronica: boolean;
    tipoContrato: string;
    subscripcionActiva: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null;
}

export interface ServicioDto {
    idUsuario: string;
    idPlan: number;
    facturacionElectronica?: boolean;
    tipoContrato: string;
    subscripcionActiva?: boolean;
    ultimaFechaPago?: string;
}
