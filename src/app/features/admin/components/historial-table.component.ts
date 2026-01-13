import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistorialPrediccion } from '../../../core/models/historial.model';

@Component({
    selector: 'app-historial-table',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
      <table class="min-w-full divide-y divide-gray-300">
        <thead class="bg-gray-50">
          <tr>
            <th class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">ID Cliente</th>
            <th class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Resultado</th>
            <th class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          <tr *ngFor="let item of historyList">
            <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
              {{ item.customerID }} <br>
              <span class="text-xs text-gray-400">ID: {{ item.id }}</span>
            </td>
            <td class="whitespace-nowrap px-3 py-4 text-sm">
              <span [class.text-red-600]="item.resultado === 'Churn'" 
                    [class.text-green-600]="item.resultado !== 'Churn'"
                    class="font-semibold">
                {{ item.resultado }}
              </span>
            </td>
            <td class="whitespace-nowrap px-3 py-4 text-sm font-medium space-x-2">
              <button (click)="onView.emit(item.id)" 
                      class="text-blue-600 hover:text-blue-900 border border-blue-200 px-2 py-1 rounded">
                 🔍 Detalle
              </button>
              <button (click)="onEdit.emit(item)" 
                      class="text-orange-600 hover:text-orange-900 border border-orange-200 px-2 py-1 rounded">
                 ✏️ Editar
              </button>
              <button (click)="onDelete.emit(item.id)" 
                      *ngIf="!isDeletedView"
                      class="text-red-600 hover:text-red-900 border border-red-200 px-2 py-1 rounded">
                 🗑️ Borrar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class HistorialTableComponent {
    @Input() historyList: HistorialPrediccion[] = [];
    @Input() isDeletedView: boolean = false;

    @Output() onView = new EventEmitter<number>();
    @Output() onEdit = new EventEmitter<HistorialPrediccion>();
    @Output() onDelete = new EventEmitter<number>();
}
