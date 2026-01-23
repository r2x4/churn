// src/app/core/services/oferta.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Oferta, OfertaDto } from '../models/oferta.model';

interface ApiResponse<T> {
    time: string;
    message: string;
    success: boolean;
    data: T;
}

@Injectable({
    providedIn: 'root'
})
export class OfertaService {
    private apiUrl = `${environment.apiBaseUrl}/ofertas`;

    constructor(private http: HttpClient) { }

    listar(): Observable<ApiResponse<Oferta[]>> {
        return this.http.get<ApiResponse<Oferta[]>>(this.apiUrl);
    }

    crear(dto: OfertaDto): Observable<ApiResponse<Oferta>> {
        return this.http.post<ApiResponse<Oferta>>(this.apiUrl, dto);
    }

    editar(id: number, dto: OfertaDto): Observable<ApiResponse<Oferta>> {
        return this.http.put<ApiResponse<Oferta>>(`${this.apiUrl}/${id}`, dto);
    }

    eliminar(id: number): Observable<ApiResponse<void>> {
        return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
    }
}
