import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistorialPrediccion } from '../../../core/models/historial.model';

@Component({
    selector: 'app-historial-detail-modal',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div *ngIf="item" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div class="relative p-5 border w-full max-w-lg shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg leading-6 font-medium text-gray-900 border-b pb-2">Detalle de Predicción</h3>
          <div class="mt-4 text-left space-y-2">
            <p><strong>ID Cliente:</strong> {{ item.customerID }}</p>
            <p><strong>Fecha:</strong> {{ item.fechaPrediccion }}</p>
            <p><strong>Probabilidad:</strong> {{ (item.probabilidad * 100).toFixed(2) }}%</p>
            <p><strong>Resultado:</strong> 
              <span [class.text-red-600]="item.resultado === 'Churn'" class="font-bold">{{ item.resultado }}</span>
            </p>
            <p><strong>Nivel de Riesgo:</strong> {{ item.riskLevel }}</p>
            <div>
              <strong>Recomendaciones:</strong>
              <ul class="list-disc ml-5 mt-1 text-sm text-gray-600">
                <li *ngFor="let rec of item.recommendations">{{ rec }}</li>
              </ul>
            </div>
          </div>
          <div class="items-center px-4 py-3 mt-4 border-t">
            <button (click)="onClose.emit()"
                    class="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class HistorialDetailModalComponent {
    @Input() item: HistorialPrediccion | null = null;
    @Output() onClose = new EventEmitter<void>();
}
