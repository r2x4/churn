import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Permiso, PermisoDto } from '../models/permiso.model';

@Injectable({
    providedIn: 'root'
})
export class PermisoService {
    private apiUrl = `${environment.apiBaseUrl}/permisos`;

    constructor(private http: HttpClient) { }

    listar(): Observable<Permiso[]> {
        return this.http.get<Permiso[]>(this.apiUrl);
    }

    obtenerPorId(id: number): Observable<Permiso> {
        return this.http.get<Permiso>(`${this.apiUrl}/${id}`);
    }

    crear(dto: PermisoDto): Observable<Permiso> {
        return this.http.post<Permiso>(this.apiUrl, dto);
    }

    actualizar(id: number, dto: PermisoDto): Observable<Permiso> {
        return this.http.put<Permiso>(`${this.apiUrl}/${id}`, dto);
    }

    eliminar(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
