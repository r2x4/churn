// src/app/features/admin/components/ofertas/oferta-table.component.ts

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Oferta } from '../../../../core/models/oferta.model';

@Component({
    selector: 'app-oferta-table',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Oferta</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Descripción</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Descuento</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Exclusiva Churn</th>
            <th class="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr *ngFor="let oferta of ofertaList" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-bold text-gray-900">{{ oferta.nombre }}</div>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm text-gray-600 truncate max-w-xs">{{ oferta.descripcion }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 py-1 text-xs font-bold rounded-lg bg-green-100 text-green-700">
                {{ oferta.descuentoPorcentaje }}%
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span *ngIf="oferta.esExclusivaChurn" class="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
                <i class="fas fa-exclamation-triangle mr-1"></i> Sí
              </span>
              <span *ngIf="!oferta.esExclusivaChurn" class="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                No
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button (click)="onEdit.emit(oferta)" class="text-indigo-600 hover:text-indigo-900 mr-4 transition-colors">
                <i class="fas fa-edit"></i>
              </button>
              <button (click)="onDelete.emit(oferta.id)" class="text-red-600 hover:text-red-900 transition-colors">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class OfertaTableComponent {
    @Input() ofertaList: Oferta[] = [];
    @Output() onEdit = new EventEmitter<Oferta>();
    @Output() onDelete = new EventEmitter<number>();
}
