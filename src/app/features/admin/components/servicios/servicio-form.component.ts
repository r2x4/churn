
import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Servicio, ServicioDto } from '../../../../core/models/servicio.model';
import { Usuario } from '../../../../core/models/usuario.model';
import { Plan } from '../../../../core/models/plan.model';

@Component({
    selector: 'app-servicio-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-scaleIn">
        <div class="bg-indigo-600 px-6 py-4 text-white flex justify-between items-center">
          <h3 class="text-lg font-bold">{{ editingItem ? 'Editar Servicio' : 'Nuevo Servicio' }}</h3>
          <button (click)="onCancel.emit()" class="text-white hover:text-gray-200 transition-colors text-xl">&times;</button>
        </div>
        
        <form [formGroup]="form" (ngSubmit)="submit()" class="p-6 space-y-4">
          
          <!-- Seleccionar Usuario -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Usuario</label>
            <select formControlName="idUsuario" 
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
              <option value="">Seleccione un usuario...</option>
              <option *ngFor="let user of usuarioList" [value]="user.id">
                {{ user.nombre }} {{ user.papellido }} ({{ user.email }})
              </option>
            </select>
            <div *ngIf="form.get('idUsuario')?.touched && form.get('idUsuario')?.invalid" class="text-red-500 text-xs mt-1">
              El usuario es obligatorio.
            </div>
          </div>

          <!-- Seleccionar Plan -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Plan</label>
            <select formControlName="idPlan" 
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
              <option [ngValue]="null">Seleccione un plan...</option>
              <option *ngFor="let plan of planList" [value]="plan.id">
                {{ plan.nombre }} - {{ plan.montoMensual | currency }}
              </option>
            </select>
             <div *ngIf="form.get('idPlan')?.touched && form.get('idPlan')?.invalid" class="text-red-500 text-xs mt-1">
              El plan es obligatorio.
            </div>
          </div>

          <!-- Fecha Pago -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Última Fecha de Pago</label>
            <input type="datetime-local" formControlName="ultimaFechaPago"
                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
          </div>
          
          <!-- Tipo Contrato -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Tipo de Contrato</label>
            <select formControlName="tipoContrato" 
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
              <option value="">Seleccione...</option>
              <option value="Month-to-month">Mensual (Month-to-month)</option>
              <option value="One year">Un Año (One year)</option>
              <option value="Two year">Dos Años (Two year)</option>
            </select>
          </div>

          <!-- Checkboxes -->
          <div class="space-y-3 pt-2">
            <label class="flex items-center cursor-pointer">
              <input type="checkbox" formControlName="facturacionElectronica" class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 mr-2">
              <span class="text-sm font-semibold text-gray-700">Facturación Electrónica</span>
            </label>

            <label class="flex items-center cursor-pointer">
              <input type="checkbox" formControlName="subscripcionActiva" class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 mr-2">
              <span class="text-sm font-semibold text-gray-700">Suscripción Activa</span>
            </label>
          </div>
          
          <div class="flex justify-end space-x-3 pt-6">
            <button type="button" (click)="onCancel.emit()" class="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium">Cancelar</button>
            <button type="submit" [disabled]="form.invalid"
                    class="px-8 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-md hover:shadow-lg disabled:bg-indigo-300 font-bold">
              {{ editingItem ? 'Actualizar' : 'Crear' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class ServicioFormComponent implements OnInit {
    @Input() editingItem: Servicio | null = null;
    @Input() usuarioList: Usuario[] = [];
    @Input() planList: Plan[] = [];

    @Output() onSave = new EventEmitter<ServicioDto>();
    @Output() onCancel = new EventEmitter<void>();

    form: FormGroup;

    constructor(private fb: FormBuilder) {
        this.form = this.fb.group({
            idUsuario: ['', [Validators.required, Validators.maxLength(255)]],
            idPlan: [null, [Validators.required]],
            ultimaFechaPago: [new Date().toISOString().slice(0, 16), Validators.required],
            facturacionElectronica: [true, Validators.required],
            tipoContrato: ['Month-to-month', Validators.required],
            subscripcionActiva: [true, Validators.required]
        });
    }

    ngOnInit(): void {
        if (this.editingItem) {
            this.form.patchValue({
                idUsuario: this.editingItem.idUsuario,
                idPlan: this.editingItem.idPlan,
                ultimaFechaPago: this.editingItem.ultimaFechaPago ? new Date(this.editingItem.ultimaFechaPago).toISOString().slice(0, 16) : '',
                facturacionElectronica: this.editingItem.facturacionElectronica,
                tipoContrato: this.editingItem.tipoContrato,
                subscripcionActiva: this.editingItem.subscripcionActiva
            });
            // Disable idUsuario in edit mode if needed? Usually OK to reassign.
        }
    }

    submit(): void {
        if (this.form.valid) {
            const formValue = this.form.value;
            const dto: ServicioDto = {
                idUsuario: formValue.idUsuario,
                idPlan: Number(formValue.idPlan),
                ultimaFechaPago: new Date(formValue.ultimaFechaPago).toISOString(),
                facturacionElectronica: !!formValue.facturacionElectronica,
                tipoContrato: formValue.tipoContrato,
                subscripcionActiva: !!formValue.subscripcionActiva
            };
            this.onSave.emit(dto);
        }
    }
}
