// src/app/features/admin/components/ofertas/oferta-form.component.ts

import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Oferta, OfertaDto } from '../../../../core/models/oferta.model';

@Component({
    selector: 'app-oferta-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-scaleIn">
        <div class="bg-indigo-600 px-6 py-4 text-white flex justify-between items-center">
          <h3 class="text-lg font-bold">{{ editingItem ? 'Editar Oferta' : 'Nueva Oferta' }}</h3>
          <button (click)="onCancel.emit()" class="text-white hover:text-gray-200 transition-colors text-xl">&times;</button>
        </div>
        
        <form [formGroup]="form" (ngSubmit)="submit()" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Nombre de la Oferta</label>
            <input type="text" formControlName="nombre" placeholder="Ej: Bono Fidelidad"
                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Descripción</label>
            <textarea formControlName="descripcion" rows="3" placeholder="Detalle de la oferta..."
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"></textarea>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Descuento (%)</label>
              <input type="number" formControlName="descuentoPorcentaje" min="0" max="100"
                     class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
            </div>
            <div class="flex items-end pb-3">
              <label class="flex items-center cursor-pointer">
                <input type="checkbox" formControlName="esExclusivaChurn" class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 mr-2">
                <span class="text-sm font-semibold text-gray-700">Exclusiva Churn</span>
              </label>
            </div>
          </div>
          
          <div class="flex justify-end space-x-3 pt-6">
            <button type="button" (click)="onCancel.emit()" class="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium">Cancelar</button>
            <button type="submit" [disabled]="form.invalid"
                    class="px-8 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-md hover:shadow-lg disabled:bg-indigo-300 font-bold">
              {{ editingItem ? 'Actualizar' : 'Crear Oferta' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class OfertaFormComponent implements OnInit {
    @Input() editingItem: Oferta | null = null;
    @Output() onSave = new EventEmitter<OfertaDto>();
    @Output() onCancel = new EventEmitter<void>();

    form: FormGroup;

    constructor(private fb: FormBuilder) {
        this.form = this.fb.group({
            nombre: ['', [Validators.required, Validators.minLength(3)]],
            descripcion: ['', Validators.required],
            descuentoPorcentaje: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
            esExclusivaChurn: [false]
        });
    }

    ngOnInit(): void {
        if (this.editingItem) {
            this.form.patchValue(this.editingItem);
        }
    }

    submit(): void {
        if (this.form.valid) {
            this.onSave.emit(this.form.value);
        }
    }
}
