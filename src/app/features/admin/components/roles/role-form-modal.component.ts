import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Rol, RolDto } from '../../../../core/models/rol.model';
import { Permiso } from '../../../../core/models/permiso.model';
import { PermisoService } from '../../../../core/services/permiso.service';

@Component({
    selector: 'app-role-form-modal',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div class="relative p-8 border w-full max-w-2xl shadow-2xl rounded-xl bg-white transform transition-all">
        <!-- Header -->
        <div class="mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
          <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {{ role ? 'Editar Rol' : 'Nuevo Rol' }}
          </h3>
          <p class="text-sm text-gray-500 mt-1">Gestiona los detalles y permisos del rol</p>
        </div>

        <form [formGroup]="roleForm" (ngSubmit)="onSubmit()">
          <!-- Nombre y Descripción -->
          <div class="grid grid-cols-1 gap-6 mb-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Nombre del Rol</label>
              <input type="text" formControlName="nombre"
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                placeholder="Ej: ADMIN_VENTAS">
              <div *ngIf="roleForm.get('nombre')?.touched && roleForm.get('nombre')?.invalid" class="text-red-500 text-xs mt-1">
                El nombre es requerido
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
              <textarea formControlName="descripcion" rows="3"
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                placeholder="Describe las responsabilidades de este rol..."></textarea>
            </div>
          </div>

          <!-- Selección de Permisos -->
          <div class="mb-8">
            <div class="flex justify-between items-center mb-4">
              <label class="block text-sm font-medium text-gray-700">Permisos Asignados</label>
              <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{{ getSelectedPermissionsCount() }} seleccionados</span>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg border border-gray-200 h-60 overflow-y-auto custom-scrollbar">
              <div *ngIf="loadingPermisos" class="flex justify-center items-center h-full text-gray-400">
                <i class="fas fa-spinner fa-spin mr-2"></i> Cargando permisos...
              </div>
              
              <div *ngIf="!loadingPermisos" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div *ngFor="let permiso of permisos" 
                  class="flex items-start p-3 rounded-md transition-colors cursor-pointer hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200"
                  (click)="togglePermiso(permiso.id)">
                  <div class="flex items-center h-5">
                    <input type="checkbox" [checked]="isPermisoSelected(permiso.id)"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer pointer-events-none">
                  </div>
                  <div class="ml-3 text-sm select-none">
                    <label class="font-medium text-gray-700 cursor-pointer">{{ permiso.nombre }}</label>
                    <p class="text-gray-500 text-xs mt-0.5">{{ permiso.descripcion || 'Sin descripción' }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" (click)="onCancel.emit()"
              class="px-6 py-2.5 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 font-medium transition-colors">
              Cancelar
            </button>
            <button type="submit" [disabled]="roleForm.invalid || submitting"
              class="px-6 py-2.5 rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 font-medium shadow-md hover:shadow-lg transform transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center">
              <i *ngIf="submitting" class="fas fa-spinner fa-spin mr-2"></i>
              {{ role ? 'Actualizar Rol' : 'Crear Rol' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
    styles: [`
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: #f1f1f1;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 3px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #555;
    }
  `]
})
export class RoleFormModalComponent implements OnInit {
    @Input() role: Rol | null = null;
    @Output() onSave = new EventEmitter<RolDto>();
    @Output() onCancel = new EventEmitter<void>();

    roleForm: FormGroup;
    permisos: Permiso[] = [];
    selectedPermisoIds: Set<number> = new Set();
    loadingPermisos = false;
    submitting = false;

    constructor(
        private fb: FormBuilder,
        private permisoService: PermisoService
    ) {
        this.roleForm = this.fb.group({
            nombre: ['', Validators.required],
            descripcion: ['']
        });
    }

    ngOnInit(): void {
        this.loadPermisos();
        if (this.role) {
            this.roleForm.patchValue({
                nombre: this.role.nombre,
                descripcion: this.role.descripcion
            });
            // Initialize selected permissions from the role
            if (this.role.permisos) {
                this.role.permisos.forEach(p => this.selectedPermisoIds.add(p.id));
            }
        }
    }

    loadPermisos(): void {
        this.loadingPermisos = true;
        this.permisoService.listar().subscribe({
            next: (data) => {
                this.permisos = data;
                this.loadingPermisos = false;
            },
            error: (err) => {
                console.error('Error loading permissions', err);
                this.loadingPermisos = false;
            }
        });
    }

    togglePermiso(id: number): void {
        if (this.selectedPermisoIds.has(id)) {
            this.selectedPermisoIds.delete(id);
        } else {
            this.selectedPermisoIds.add(id);
        }
    }

    isPermisoSelected(id: number): boolean {
        return this.selectedPermisoIds.has(id);
    }

    getSelectedPermissionsCount(): number {
        return this.selectedPermisoIds.size;
    }

    onSubmit(): void {
        if (this.roleForm.valid) {
            this.submitting = true;
            const formValue = this.roleForm.value;
            const dto: RolDto = {
                nombre: formValue.nombre,
                descripcion: formValue.descripcion,
                permisos: Array.from(this.selectedPermisoIds).map(id => ({ id }))
            };
            this.onSave.emit(dto);
        }
    }
}
