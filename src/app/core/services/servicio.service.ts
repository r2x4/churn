
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Servicio, ServicioDto } from '../models/servicio.model';

interface ApiResponse<T> {
    time: string;
    message: string;
    success: boolean;
    data: T;
}

@Injectable({
    providedIn: 'root'
})
export class ServicioService {
    private apiUrl = `${environment.apiBaseUrl}/servicios`;

    constructor(private http: HttpClient) { }

    listar(page: number = 0, size: number = 10): Observable<ApiResponse<any>> {
        return this.http.get<ApiResponse<any>>(`${this.apiUrl}?pagina=${page}&tamanio=${size}`);
    }

    listarEliminados(page: number = 0, size: number = 10): Observable<ApiResponse<any>> {
        return this.http.get<ApiResponse<any>>(`${this.apiUrl}/eliminados?pagina=${page}&tamanio=${size}`);
    }

    buscarPorId(id: number): Observable<ApiResponse<Servicio>> {
        return this.http.get<ApiResponse<Servicio>>(`${this.apiUrl}/${id}`);
    }

    crear(dto: ServicioDto): Observable<ApiResponse<Servicio>> {
        return this.http.post<ApiResponse<Servicio>>(this.apiUrl, dto);
    }

    editar(id: number, dto: ServicioDto): Observable<ApiResponse<Servicio>> {
        return this.http.put<ApiResponse<Servicio>>(`${this.apiUrl}/${id}`, dto);
    }

    eliminar(id: number): Observable<ApiResponse<void>> {
        return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
    }
}
