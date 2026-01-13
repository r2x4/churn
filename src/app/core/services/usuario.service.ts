// src/app/core/services/usuario.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Usuario, UsuarioDto } from '../models/usuario.model';
import { ApiResponse, PageContent } from '../models/historial.model';

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {
    private apiUrl = `${environment.apiBaseUrl}/usuarios`;

    constructor(private http: HttpClient) { }

    listarActivos(pagina: number = 0, tamanio: number = 10): Observable<ApiResponse<PageContent<Usuario>>> {
        const params = new HttpParams()
            .set('pagina', pagina.toString())
            .set('tamanio', tamanio.toString());
        return this.http.get<ApiResponse<PageContent<Usuario>>>(this.apiUrl, { params });
    }

    listarEliminados(pagina: number = 0, tamanio: number = 10): Observable<ApiResponse<PageContent<Usuario>>> {
        const params = new HttpParams()
            .set('pagina', pagina.toString())
            .set('tamanio', tamanio.toString());
        return this.http.get<ApiResponse<PageContent<Usuario>>>(`${this.apiUrl}/eliminados`, { params });
    }

    buscarPorId(id: string): Observable<ApiResponse<Usuario>> {
        return this.http.get<ApiResponse<Usuario>>(`${this.apiUrl}/${id}`);
    }

    crear(dto: UsuarioDto): Observable<ApiResponse<Usuario>> {
        return this.http.post<ApiResponse<Usuario>>(this.apiUrl, dto);
    }

    editar(id: string, dto: UsuarioDto): Observable<ApiResponse<Usuario>> {
        return this.http.put<ApiResponse<Usuario>>(`${this.apiUrl}/${id}`, dto);
    }

    eliminar(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    asignarRol(usuarioId: string, rolId: number): Observable<ApiResponse<Usuario>> {
        return this.http.post<ApiResponse<Usuario>>(`${this.apiUrl}/${usuarioId}/roles/${rolId}`, {});
    }

    removerRol(usuarioId: string, rolId: number): Observable<ApiResponse<Usuario>> {
        return this.http.delete<ApiResponse<Usuario>>(`${this.apiUrl}/${usuarioId}/roles/${rolId}`);
    }
}
