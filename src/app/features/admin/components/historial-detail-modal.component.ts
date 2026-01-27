import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistorialPrediccion } from '../../../core/models/historial.model';

@Component({
    selector: 'app-historial-detail-modal',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div *ngIf="item" class="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div class="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
        <!-- Header -->
        <div class="bg-indigo-600 px-6 py-4 text-white flex justify-between items-center sticky top-0 z-10">
          <h3 class="text-xl font-bold flex items-center gap-2">
            📊 Detalle de Predicción
          </h3>
          <button (click)="onClose.emit()" class="text-white hover:text-gray-200 transition-colors text-2xl font-light">&times;</button>
        </div>
        
        <!-- Content -->
        <div class="p-8 space-y-8 flex-1 overflow-y-auto">
          <!-- Main Results Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Risk Level Card -->
            <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border-2 border-gray-200">
              <p class="text-sm text-gray-600 font-semibold mb-2">NIVEL DE RIESGO</p>
              <p class="text-3xl font-bold">{{ getRiskLabel() }}</p>
              <p class="text-sm text-gray-500 mt-2">
                Probabilidad: {{ ((item.probabilidad || 0) * 100).toFixed(1) }}%
              </p>
            </div>

            <!-- Churn Status Card -->
            <div [ngClass]="item.resultado === 'Churn' ? 'bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-300' : 'bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300'"
                 class="rounded-xl p-6">
              <p [ngClass]="item.resultado === 'Churn' ? 'text-red-600' : 'text-green-600'"
                 class="text-sm font-semibold mb-2">
                PREDICCIÓN
              </p>
              <p class="text-3xl font-bold">{{ getChurnLabel() }}</p>
              <p [ngClass]="item.resultado === 'Churn' ? 'text-red-700' : 'text-green-700'"
                 class="text-sm mt-2">
                {{ item.resultado === 'Churn' ? 'El cliente tiene alta probabilidad de abandonar' : 'El cliente probablemente seguirá' }}
              </p>
            </div>

            <!-- ID Card -->
            <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-200">
              <p class="text-sm text-blue-600 font-semibold mb-2">ID CLIENTE</p>
              <p class="text-2xl font-bold text-blue-900">{{ item.customerID }}</p>
              <p class="text-sm text-blue-600 mt-2">
                Registro: {{ item.fechaPrediccion | date:'short' }}
              </p>
            </div>
          </div>

          <!-- Customer Information Section -->
          <div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">👤 Información del Cliente</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-600 font-semibold">ID Cliente</p>
                <p class="text-lg font-bold text-gray-900">{{ item.customerID }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600 font-semibold">ID Registro</p>
                <p class="text-lg font-bold text-gray-900">{{ item.id }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600 font-semibold">Fecha de Predicción</p>
                <p class="text-lg font-bold text-gray-900">{{ item.fechaPrediccion | date:'medium' }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600 font-semibold">Nivel de Riesgo</p>
                <p class="text-lg font-bold text-indigo-600">{{ getRiskLevelText() }}</p>
              </div>
            </div>
          </div>

          <!-- Prediction Details Section -->
          <div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">📈 Detalles de Predicción</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p class="text-sm text-gray-600 font-semibold">Probabilidad Exacta</p>
                <div class="flex items-center gap-3 mt-2">
                  <div class="w-20 bg-gray-200 rounded-full h-3">
                    <div class="bg-gradient-to-r from-green-500 to-red-500 h-3 rounded-full" 
                         [style.width.%]="(item.probabilidad || 0) * 100"></div>
                  </div>
                  <p class="text-lg font-bold text-gray-900">{{ ((item.probabilidad || 0) * 100).toFixed(2) }}%</p>
                </div>
              </div>
              <div>
                <p class="text-sm text-gray-600 font-semibold">Estado</p>
                <p class="text-lg font-bold" 
                   [ngClass]="item.resultado === 'Churn' ? 'text-red-600' : 'text-green-600'">
                  {{ item.resultado }}
                </p>
              </div>
            </div>
          </div>

          <!-- Recommendations Section -->
          <div *ngIf="item.recommendations && item.recommendations.length > 0" class="bg-amber-50 rounded-xl p-6 border border-amber-200">
            <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">💡 Recomendaciones</h3>
            <ul class="space-y-2">
              <li *ngFor="let rec of item.recommendations" class="flex items-start gap-2">
                <span class="text-amber-600 mt-1">•</span>
                <span class="text-gray-700">{{ rec }}</span>
              </li>
            </ul>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-4 pt-8 border-t border-gray-200 sticky bottom-0 bg-white">
            <button (click)="onClose.emit()" 
                    class="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-semibold">
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

    getRiskLabel(): string {
        if (!this.item) return '';
        
        const riskLevel = this.item.riskLevel || 
                         (this.item.probabilidad > 0.7 ? 'high' : 
                          this.item.probabilidad > 0.4 ? 'medium' : 'low');
        
        switch (riskLevel) {
            case 'high': return '🔴 Alto Riesgo';
            case 'medium': return '🟡 Riesgo Medio';
            case 'low': return '🟢 Bajo Riesgo';
            default: return '';
        }
    }

    getChurnLabel(): string {
        if (!this.item) return '';
        return this.item.resultado === 'Churn' 
            ? '⚠️ Churn Detectado' 
            : '✅ No Churn';
    }

    getRiskLevelText(): string {
        if (!this.item) return '';
        
        const riskLevel = this.item.riskLevel || 
                         (this.item.probabilidad > 0.7 ? 'high' : 
                          this.item.probabilidad > 0.4 ? 'medium' : 'low');
        
        switch (riskLevel) {
            case 'high': return 'Alto - Acción Requerida';
            case 'medium': return 'Medio - Monitorear';
            case 'low': return 'Bajo - Cliente Estable';
            default: return 'No definido';
        }
    }
}
