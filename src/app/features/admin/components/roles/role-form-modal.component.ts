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
    <div class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="bg-indigo-600 px-6 py-4 text-white flex justify-between items-center sticky top-0 z-10">
          <h3 class="text-xl font-bold">{{ role ? 'Editar Rol' : 'Nuevo Rol' }}</h3>
          <button (click)="onCancel.emit()" class="text-white hover:text-gray-200 transition-colors text-2xl font-light">&times;</button>
        </div>

        <form [formGroup]="roleForm" (ngSubmit)="onSubmit()" class="p-8 space-y-8 flex-1 overflow-y-auto custom-scrollbar">
          <!-- Basic Information -->
          <div class="space-y-4">
            <h4 class="text-sm font-bold text-gray-800 uppercase tracking-wide text-indigo-600">📋 Información del Rol</h4>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Nombre del Rol</label>
              <input type="text" formControlName="nombre" placeholder="Ej: ADMIN_VENTAS"
                     class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all">
              <div *ngIf="roleForm.get('nombre')?.touched && roleForm.get('nombre')?.invalid" class="text-red-500 text-xs mt-2">El nombre es requerido</div>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
              <textarea formControlName="descripcion" rows="3" placeholder="Describe las responsabilidades y funciones de este rol..."
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"></textarea>
            </div>
          </div>

          <!-- Permissions Selection -->
          <div class="space-y-4 border-t border-gray-200 pt-8">
            <div class="flex justify-between items-center">
              <h4 class="text-sm font-bold text-gray-800 uppercase tracking-wide text-indigo-600">🔑 Permisos Asignados</h4>
              <span class="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">{{ getSelectedPermissionsCount() }} / {{ permisos.length }}</span>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg border border-gray-200 h-64 overflow-y-auto custom-scrollbar">
              <div *ngIf="loadingPermisos" class="flex justify-center items-center h-full text-gray-500">
                Cargando permisos...
              </div>
              
              <div *ngIf="!loadingPermisos" class="grid grid-cols-1 gap-3">
                <label *ngFor="let permiso of permisos" 
                       class="flex items-start p-4 bg-white rounded-lg cursor-pointer hover:shadow-sm transition border border-transparent hover:border-indigo-200">
                  <input type="checkbox" [checked]="isPermisoSelected(permiso.id)"
                         (change)="togglePermiso(permiso.id)"
                         class="h-5 w-5 text-indigo-600 rounded cursor-pointer mt-0.5" />
                  <div class="ml-3 text-sm flex-1">
                    <span class="font-semibold text-gray-800">{{ permiso.nombre }}</span>
                    <p class="text-gray-500 text-xs mt-1">{{ permiso.descripcion || 'Sin descripción' }}</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end space-x-3 pt-8 border-t border-gray-200 sticky bottom-0 bg-white">
            <button type="button" (click)="onCancel.emit()" class="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-semibold">
              Cancelar
            </button>
            <button type="submit" [disabled]="roleForm.invalid || submitting"
                    class="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed font-bold flex items-center">
              {{ role ? '✓ Actualizar Rol' : '+ Crear Rol' }}
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
