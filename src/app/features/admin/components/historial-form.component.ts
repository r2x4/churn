import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HistorialPrediccion, HistorialPrediccionDto } from '../../../core/models/historial.model';

@Component({
    selector: 'app-historial-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div class="relative p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <h3 class="text-lg font-medium text-gray-900 border-b pb-2 mb-4">
          {{ editingItem ? 'Editar Registro' : 'Nuevo Registro de Prueba' }}
        </h3>
        
        <form [formGroup]="historyForm" (ngSubmit)="onSubmit()">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">ID Cliente</label>
              <input type="text" formControlName="customerID" 
                     class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Probabilidad (0-1)</label>
                <input type="number" step="0.01" formControlName="probabilidad" 
                       class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Resultado</label>
                <select formControlName="resultado" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                  <option value="Churn">Churn</option>
                  <option value="No Churn">No Churn</option>
                </select>
              </div>
            </div>
          </div>

          <div class="flex justify-end space-x-3 mt-6 border-t pt-4">
            <button type="button" (click)="onCancel.emit()"
                    class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
              Cancelar
            </button>
            <button type="submit" [disabled]="historyForm.invalid"
                    class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50">
              Guardar
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
