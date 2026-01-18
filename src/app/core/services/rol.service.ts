import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Rol, RolDto } from '../models/rol.model';

@Injectable({
    providedIn: 'root'
})
export class RolService {
    private apiUrl = `${environment.apiBaseUrl}/roles`;

    constructor(private http: HttpClient) { }

    listar(): Observable<Rol[]> {
        return this.http.get<Rol[]>(this.apiUrl);
    }

    obtenerPorId(id: number): Observable<Rol> {
        return this.http.get<Rol>(`${this.apiUrl}/${id}`);
    }

    crear(dto: RolDto): Observable<Rol> {
        return this.http.post<Rol>(this.apiUrl, dto);
    }

    actualizar(id: number, dto: RolDto): Observable<Rol> {
        return this.http.put<Rol>(`${this.apiUrl}/${id}`, dto);
    }

    eliminar(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
