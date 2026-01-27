import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HistorialPrediccion, HistorialPrediccionDto } from '../../../core/models/historial.model';

@Component({
    selector: 'app-historial-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
        <!-- Header -->
        <div class="bg-indigo-600 px-6 py-4 text-white flex justify-between items-center sticky top-0 z-10">
          <h3 class="text-xl font-bold">{{ editingItem ? 'Editar Registro' : 'Nuevo Registro de Predicción' }}</h3>
          <button (click)="onCancel.emit()" class="text-white hover:text-gray-200 transition-colors text-2xl font-light">&times;</button>
        </div>
        
        <form [formGroup]="historyForm" (ngSubmit)="onSubmit()" class="p-8 space-y-8 flex-1 overflow-y-auto custom-scrollbar">
          <!-- Client Information -->
          <div class="space-y-4">
            <h4 class="text-sm font-bold text-gray-800 uppercase tracking-wide text-indigo-600">📱 Información del Cliente</h4>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">ID del Cliente</label>
              <input type="text" formControlName="customerID" placeholder="Ej: 5575-GNVDE"
                     class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                     [class.bg-gray-100]="editingItem">
            </div>
          </div>

          <!-- Prediction Results -->
          <div class="space-y-4 border-t border-gray-200 pt-8">
            <h4 class="text-sm font-bold text-gray-800 uppercase tracking-wide text-indigo-600">📊 Resultados de Predicción</h4>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Probabilidad de Churn (0-1)</label>
                <div class="relative">
                  <input type="number" step="0.01" min="0" max="1" formControlName="probabilidad" 
                         class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                         placeholder="0.50">
                  <div *ngIf="historyForm.get('probabilidad')?.value !== null" 
                       class="mt-2 text-xs font-semibold text-indigo-600">
                    {{ ((historyForm.get('probabilidad')?.value || 0) * 100).toFixed(1) }}%
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Resultado</label>
                <select formControlName="resultado" 
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all">
                  <option value="No Churn">✅ No Churn (Retiene)</option>
                  <option value="Churn">⚠️ Churn (Abandona)</option>
                </select>
              </div>
            </div>

            <!-- Visual Probability Bar -->
            <div class="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p class="text-xs font-semibold text-gray-600 mb-2">Visualización de Riesgo</p>
              <div class="w-full bg-gray-300 rounded-full h-3 overflow-hidden">
                <div class="bg-gradient-to-r from-green-500 to-red-500 h-3 rounded-full transition-all" 
                     [style.width.%]="(historyForm.get('probabilidad')?.value || 0) * 100"></div>
              </div>
              <div class="flex justify-between mt-2 text-xs text-gray-500">
                <span>Bajo Riesgo</span>
                <span>Alto Riesgo</span>
              </div>
            </div>
          </div>

          <!-- Additional Information -->
          <div class="space-y-4 border-t border-gray-200 pt-8">
            <h4 class="text-sm font-bold text-gray-800 uppercase tracking-wide text-indigo-600">💡 Información Adicional</h4>
            
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Nivel de Riesgo</label>
              <select formControlName="riskLevel" 
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all">
                <option value="low">🟢 Bajo - Cliente Estable</option>
                <option value="medium">🟡 Medio - Monitorear</option>
                <option value="high">🔴 Alto - Acción Requerida</option>
              </select>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end space-x-3 pt-8 border-t border-gray-200 sticky bottom-0 bg-white">
            <button type="button" (click)="onCancel.emit()" 
                    class="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-semibold">
              Cancelar
            </button>
            <button type="submit" [disabled]="historyForm.invalid"
                    class="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed font-bold">
              {{ editingItem ? '✓ Actualizar Registro' : '+ Crear Registro' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class HistorialFormComponent implements OnChanges {
    @Input() editingItem: HistorialPrediccion | null = null;
    @Output() onSave = new EventEmitter<HistorialPrediccionDto>();
    @Output() onCancel = new EventEmitter<void>();

    historyForm: FormGroup;

    constructor(private fb: FormBuilder) {
        this.historyForm = this.fb.group({
            customerID: ['', Validators.required],
            probabilidad: [0.5, [Validators.required, Validators.min(0), Validators.max(1)]],
            resultado: ['No Churn', Validators.required],
            riskLevel: ['low'],
            recommendations: [[]]
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['editingItem'] && this.editingItem) {
            this.historyForm.patchValue(this.editingItem);
        } else if (changes['editingItem'] && !this.editingItem) {
            this.historyForm.reset({
                customerID: 'TEST-' + Math.floor(Math.random() * 1000),
                probabilidad: 0.5,
                resultado: 'No Churn',
                riskLevel: 'medium',
                recommendations: []
            });
        }
    }

    onSubmit(): void {
        if (this.historyForm.valid) {
            this.onSave.emit(this.historyForm.value);
        }
    }
}
