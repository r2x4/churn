
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Servicio } from '../../../../core/models/servicio.model';

@Component({
  selector: 'app-servicio-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Usuario</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Plan</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contrato</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
            <th class="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr *ngFor="let servicio of servicioList" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">#{{ servicio.id }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ servicio.idUsuario }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-700">{{ servicio.idPlan }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-700">{{ servicio.tipoContrato }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span *ngIf="servicio.subscripcionActiva" class="px-2 py-1 text-xs font-bold rounded-lg bg-green-100 text-green-700">
                Activa
              </span>
              <span *ngIf="!servicio.subscripcionActiva" class="px-2 py-1 text-xs font-bold rounded-lg bg-red-100 text-red-700">
                Inactiva
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex justify-end gap-2">
                <button (click)="onEdit.emit(servicio)" 
                        title="Editar"
                        class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-amber-50 text-amber-600 hover:bg-amber-100 hover:shadow-md transition-all">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </button>
                <button (click)="onDelete.emit(servicio.id)" 
                        title="Eliminar"
                        class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-red-50 text-red-600 hover:bg-red-100 hover:shadow-md transition-all">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
          <tr *ngIf="servicioList.length === 0">
            <td colspan="6" class="px-6 py-10 text-center text-gray-500">
              No se encontraron servicios
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class ServicioTableComponent {
  @Input() servicioList: Servicio[] = [];
  @Output() onEdit = new EventEmitter<Servicio>();
  @Output() onDelete = new EventEmitter<number>();
}
