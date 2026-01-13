// src/app/core/services/historial.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
    HistorialPrediccion,
    HistorialPrediccionDto,
    ApiResponse,
    PageContent
} from '../models/historial.model';

@Injectable({
    providedIn: 'root'
})
export class HistorialService {
    private apiUrl = `${environment.apiBaseUrl}/historialPredicciones`;

    constructor(private http: HttpClient) { }

    /**
     * Obtiene la lista de historiales activos con soporte para paginación.
     */
    listarActivos(pagina: number = 0, tamanio: number = 10): Observable<ApiResponse<PageContent<HistorialPrediccion>>> {
        const params = new HttpParams()
            .set('pagina', pagina.toString())
            .set('tamanio', tamanio.toString());

        return this.http.get<ApiResponse<PageContent<HistorialPrediccion>>>(this.apiUrl, { params });
    }

    /**
     * Obtiene la lista de historiales eliminados (soft delete).
     */
    listarEliminados(pagina: number = 0, tamanio: number = 10): Observable<ApiResponse<PageContent<HistorialPrediccion>>> {
        const params = new HttpParams()
            .set('pagina', pagina.toString())
            .set('tamanio', tamanio.toString());

        return this.http.get<ApiResponse<PageContent<HistorialPrediccion>>>(`${this.apiUrl}/eliminados`, { params });
    }

    /**
     * Busca un historial específico por su ID.
     */
    buscarPorId(id: number): Observable<ApiResponse<HistorialPrediccion>> {
        return this.http.get<ApiResponse<HistorialPrediccion>>(`${this.apiUrl}/${id}`);
    }

    /**
     * Crea un nuevo registro de historial.
     */
    crear(dto: HistorialPrediccionDto): Observable<ApiResponse<HistorialPrediccion>> {
        return this.http.post<ApiResponse<HistorialPrediccion>>(this.apiUrl, dto);
    }

    /**
     * Edita un registro de historial existente.
     */
    editar(id: number, dto: HistorialPrediccionDto): Observable<ApiResponse<HistorialPrediccion>> {
        return this.http.put<ApiResponse<HistorialPrediccion>>(`${this.apiUrl}/${id}`, dto);
    }

    /**
     * Realiza un borrado lógico de un historial por su ID.
     */
    eliminar(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
