// src/app/core/services/plan.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Plan, PlanDto } from '../models/plan.model';

interface ApiResponse<T> {
    time: string;
    message: string;
    success: boolean;
    data: T;
}

@Injectable({
    providedIn: 'root'
})
export class PlanService {
    private apiUrl = `${environment.apiBaseUrl}/planes`;

    constructor(private http: HttpClient) { }

    listar(page: number = 0, size: number = 10): Observable<ApiResponse<any>> {
        return this.http.get<any>(`${this.apiUrl}?page=${page}&size=${size}`).pipe(
            map((resp) => {
                // Normalize wrapper if needed
                const wrapper: ApiResponse<any> = (resp && resp.data !== undefined)
                    ? resp as ApiResponse<any>
                    : {
                        time: new Date().toISOString(),
                        message: '',
                        success: true,
                        data: resp
                    } as ApiResponse<any>;

                // If data is an array, map backend field names to our `Plan` model
                if (Array.isArray(wrapper.data)) {
                    const mapped = (wrapper.data as any[]).map(item => ({
                        id: item.id,
                        nombre: item.nombre || item.name || item.plan || item.planName || (`Plan ${item.id}`),
                        montoMensual: item.montoMensual ?? item.cargoMensual ?? item.monthlyCharge ?? 0,
                        internetService: item.internetService || item.servicioInternet || '',
                        phoneService: (item.phoneService !== undefined)
                            ? item.phoneService
                            : (item.servicioTelefono === true ? 'Yes' : (item.servicioTelefono === false ? 'No' : (item.servicioTelefono || 'No'))),
                        deletedAt: item.deletedAt
                    }));

                    return {
                        ...wrapper,
                        data: mapped
                    } as ApiResponse<any>;
                }

                return wrapper;
            })
        );
    }

    crear(dto: PlanDto): Observable<ApiResponse<Plan>> {
        const payload = this.toBackendPayload(dto);
        return this.http.post<ApiResponse<Plan>>(this.apiUrl, payload);
    }

    editar(id: number, dto: PlanDto): Observable<ApiResponse<Plan>> {
        const payload = this.toBackendPayload(dto);
        return this.http.put<ApiResponse<Plan>>(`${this.apiUrl}/${id}`, payload);
    }

    buscarPorId(id: number): Observable<ApiResponse<any>> {
        return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
            map((resp) => {
                const wrapper: ApiResponse<any> = (resp && resp.data !== undefined)
                    ? resp as ApiResponse<any>
                    : { time: new Date().toISOString(), message: '', success: true, data: resp } as ApiResponse<any>;

                // If data is a single item, map to frontend-friendly shape but keep full payload in data
                const item = wrapper.data;
                if (item) {
                    const mapped = {
                        id: item.id,
                        nombre: item.nombre || item.name || (`Plan ${item.id}`),
                        montoMensual: item.montoMensual ?? item.cargoMensual ?? 0,
                        internetService: item.internetService || item.servicioInternet || null,
                        phoneService: (item.phoneService !== undefined) ? item.phoneService : (item.servicioTelefono ? 'Yes' : 'No'),
                        // include backend booleans so form can edit them
                        seguridadEnLinea: item.seguridadEnLinea ?? false,
                        respaldoEnLinea: item.respaldoEnLinea ?? false,
                        proteccionDispositivo: item.proteccionDispositivo ?? false,
                        soporteTecnico: item.soporteTecnico ?? false,
                        lineasMultiples: item.lineasMultiples ?? false,
                        streamingTv: item.streamingTv ?? false,
                        streamingPeliculas: item.streamingPeliculas ?? false,
                        cargoMensual: item.cargoMensual ?? item.montoMensual ?? 0,
                        createdAt: item.createdAt,
                        updatedAt: item.updatedAt,
                        deletedAt: item.deletedAt
                    };

                    return { ...wrapper, data: mapped } as ApiResponse<any>;
                }

                return wrapper;
            })
        );
    }

    private toBackendPayload(dto: any): any {
        // Map frontend DTO fields to backend expected camelCase Spanish fields
        const servicioTelefono = (dto.servicioTelefono !== undefined)
            ? !!dto.servicioTelefono
            : (dto.phoneService === true || dto.phoneService === 'Yes' || dto.phoneService === 'yes');

        return {
            servicioTelefono: servicioTelefono,
            servicioInternet: dto.servicioInternet ?? dto.internetService ?? null,
            seguridadEnLinea: !!(dto.seguridadEnLinea),
            respaldoEnLinea: !!(dto.respaldoEnLinea),
            proteccionDispositivo: !!(dto.proteccionDispositivo),
            soporteTecnico: !!(dto.soporteTecnico),
            lineasMultiples: !!(dto.lineasMultiples),
            streamingTv: !!(dto.streamingTv),
            streamingPeliculas: !!(dto.streamingPeliculas),
            cargoMensual: Number(dto.cargoMensual ?? dto.montoMensual ?? 0)
        };
    }

    eliminar(id: number): Observable<ApiResponse<void>> {
        return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
    }
}
