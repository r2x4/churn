// src/app/features/admin/components/planes/plan-form.component.ts

import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Plan, PlanDto, PlanDtoFull } from '../../../../core/models/plan.model';

@Component({
    selector: 'app-plan-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="bg-indigo-600 px-6 py-4 text-white flex justify-between items-center sticky top-0 z-10">
          <h3 class="text-xl font-bold">{{ editingItem ? 'Editar Plan' : 'Nuevo Plan' }}</h3>
          <button (click)="onCancel.emit()" class="text-white hover:text-gray-200 transition-colors text-2xl font-light">&times;</button>
        </div>

        <form [formGroup]="form" (ngSubmit)="submit()" class="p-8 space-y-8">
          <!-- Basic Information Section -->
          <div class="space-y-4">
            <h4 class="text-sm font-bold text-gray-800 uppercase tracking-wide text-indigo-600">📋 Información Básica</h4>
            
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Nombre del Plan</label>
              <input type="text" formControlName="nombre" placeholder="Ej: Plan Premium Fibra"
                     class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all">
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Cargo Mensual ($)</label>
                <input type="number" formControlName="cargoMensual" step="0.01" min="0"
                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                       placeholder="0.00">
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Servicio Internet</label>
                <select formControlName="internetService" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all">
                  <option value="">Seleccionar...</option>
                  <option value="Fiber optic">Fibra Óptica</option>
                  <option value="DSL">DSL</option>
                  <option value="Cable Coaxial">Cable Coaxial</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Servicio Telefonía</label>
              <select formControlName="phoneService" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all">
                <option value="No">No incluido</option>
                <option value="Yes">Incluido</option>
              </select>
            </div>
          </div>

          <!-- Services Section -->
          <div class="space-y-4 border-t border-gray-200 pt-8">
            <h4 class="text-sm font-bold text-gray-800 uppercase tracking-wide text-indigo-600">✨ Servicios Adicionales</h4>
            
            <div class="grid grid-cols-2 gap-3">
              <label class="flex items-center p-4 bg-gradient-to-r from-gray-50 to-gray-50 rounded-lg cursor-pointer hover:from-indigo-50 hover:to-indigo-50 transition group">
                <input type="checkbox" formControlName="seguridadEnLinea" class="h-5 w-5 text-indigo-600 rounded cursor-pointer" />
                <span class="ml-3 text-sm font-medium text-gray-700 group-hover:text-indigo-700">Seguridad en Línea</span>
              </label>

              <label class="flex items-center p-4 bg-gradient-to-r from-gray-50 to-gray-50 rounded-lg cursor-pointer hover:from-indigo-50 hover:to-indigo-50 transition group">
                <input type="checkbox" formControlName="respaldoEnLinea" class="h-5 w-5 text-indigo-600 rounded cursor-pointer" />
                <span class="ml-3 text-sm font-medium text-gray-700 group-hover:text-indigo-700">Respaldo en Línea</span>
              </label>

              <label class="flex items-center p-4 bg-gradient-to-r from-gray-50 to-gray-50 rounded-lg cursor-pointer hover:from-indigo-50 hover:to-indigo-50 transition group">
                <input type="checkbox" formControlName="proteccionDispositivo" class="h-5 w-5 text-indigo-600 rounded cursor-pointer" />
                <span class="ml-3 text-sm font-medium text-gray-700 group-hover:text-indigo-700">Protección Dispositivo</span>
              </label>

              <label class="flex items-center p-4 bg-gradient-to-r from-gray-50 to-gray-50 rounded-lg cursor-pointer hover:from-indigo-50 hover:to-indigo-50 transition group">
                <input type="checkbox" formControlName="soporteTecnico" class="h-5 w-5 text-indigo-600 rounded cursor-pointer" />
                <span class="ml-3 text-sm font-medium text-gray-700 group-hover:text-indigo-700">Soporte Técnico</span>
              </label>

              <label class="flex items-center p-4 bg-gradient-to-r from-gray-50 to-gray-50 rounded-lg cursor-pointer hover:from-indigo-50 hover:to-indigo-50 transition group">
                <input type="checkbox" formControlName="lineasMultiples" class="h-5 w-5 text-indigo-600 rounded cursor-pointer" />
                <span class="ml-3 text-sm font-medium text-gray-700 group-hover:text-indigo-700">Líneas Múltiples</span>
              </label>

              <label class="flex items-center p-4 bg-gradient-to-r from-gray-50 to-gray-50 rounded-lg cursor-pointer hover:from-indigo-50 hover:to-indigo-50 transition group">
                <input type="checkbox" formControlName="streamingTv" class="h-5 w-5 text-indigo-600 rounded cursor-pointer" />
                <span class="ml-3 text-sm font-medium text-gray-700 group-hover:text-indigo-700">Streaming TV</span>
              </label>

              <label class="flex items-center p-4 bg-gradient-to-r from-gray-50 to-gray-50 rounded-lg cursor-pointer hover:from-indigo-50 hover:to-indigo-50 transition group col-span-2">
                <input type="checkbox" formControlName="streamingPeliculas" class="h-5 w-5 text-indigo-600 rounded cursor-pointer" />
                <span class="ml-3 text-sm font-medium text-gray-700 group-hover:text-indigo-700">Streaming Películas</span>
              </label>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end space-x-3 pt-8 border-t border-gray-200">
            <button type="button" (click)="onCancel.emit()" class="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-semibold">
              Cancelar
            </button>
            <button type="submit" [disabled]="form.invalid"
                    class="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed font-bold">
              {{ editingItem ? '✓ Actualizar Plan' : '+ Crear Plan' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class PlanFormComponent implements OnInit {
    @Input() editingItem: any | null = null;
    @Output() onSave = new EventEmitter<PlanDtoFull>();
    @Output() onCancel = new EventEmitter<void>();

    form: FormGroup;

    constructor(private fb: FormBuilder) {
        this.form = this.fb.group({
          nombre: ['', [Validators.required, Validators.minLength(3)]],
          cargoMensual: [0, [Validators.required, Validators.min(0)]],
          internetService: ['', Validators.required],
          phoneService: ['No', Validators.required],
          seguridadEnLinea: [false],
          respaldoEnLinea: [false],
          proteccionDispositivo: [false],
          soporteTecnico: [false],
          lineasMultiples: [false],
          streamingTv: [false],
          streamingPeliculas: [false]
        });
    }

    ngOnInit(): void {
        if (this.editingItem) {
          // editingItem may contain camelCase backend fields or frontend names
          const patch: any = {
              nombre: this.editingItem.nombre ?? this.editingItem.name ?? '',
              cargoMensual: this.editingItem.cargoMensual ?? this.editingItem.montoMensual ?? 0,
              internetService: this.editingItem.servicioInternet ?? this.editingItem.internetService ?? 'No',
              phoneService: (this.editingItem.servicioTelefono !== undefined) ? (this.editingItem.servicioTelefono ? 'Yes' : 'No') : (this.editingItem.phoneService ?? 'No'),
            seguridadEnLinea: this.editingItem.seguridadEnLinea ?? false,
            respaldoEnLinea: this.editingItem.respaldoEnLinea ?? false,
            proteccionDispositivo: this.editingItem.proteccionDispositivo ?? false,
            soporteTecnico: this.editingItem.soporteTecnico ?? false,
            lineasMultiples: this.editingItem.lineasMultiples ?? false,
            streamingTv: this.editingItem.streamingTv ?? false,
            streamingPeliculas: this.editingItem.streamingPeliculas ?? false
          };

          this.form.patchValue(patch);
        }
    }

    submit(): void {
        if (this.form.valid) {
            this.onSave.emit(this.form.value);
        }
    }
}
