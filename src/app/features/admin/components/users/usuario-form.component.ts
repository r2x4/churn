// src/app/features/admin/components/users/usuario-form.component.ts

import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray, FormControl } from '@angular/forms';
import { Usuario, UsuarioDto } from '../../../../core/models/usuario.model';
import { RolService } from '../../../../core/services/rol.service';
import { Rol } from '../../../../core/models/rol.model';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div class="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
        <div class="bg-indigo-600 px-6 py-4 text-white flex justify-between items-center sticky top-0 z-10">
          <h3 class="text-xl font-bold">{{ editingUser ? 'Editar Usuario' : 'Nuevo Usuario' }}</h3>
          <button (click)="onCancel.emit()" class="text-white hover:text-gray-200 transition-colors text-2xl font-light">&times;</button>
        </div>
        
        <form [formGroup]="userForm" (ngSubmit)="onSubmit()" class="p-8 space-y-8 flex-1 overflow-y-auto custom-scrollbar">
          <!-- Personal Information -->
          <div class="space-y-4">
            <h4 class="text-sm font-bold text-gray-800 uppercase tracking-wide text-indigo-600">👤 Información Personal</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Nombre</label>
                <input type="text" formControlName="nombre" placeholder="Juan"
                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all">
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Primer Apellido</label>
                <input type="text" formControlName="papellido" placeholder="García"
                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all">
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Segundo Apellido</label>
                <input type="text" formControlName="sapellido" placeholder="López"
                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all">
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input type="email" formControlName="email" placeholder="juan@example.com"
                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all">
              </div>
              <div *ngIf="!editingUser" class="md:col-span-1">
                <label class="block text-sm font-semibold text-gray-700 mb-2">Contraseña</label>
                <input type="password" formControlName="password" placeholder="••••••••"
                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all">
              </div>
              <div class="md:col-span-1">
                <label class="block text-sm font-semibold text-gray-700 mb-2">Teléfono</label>
                <input type="text" formControlName="telefono" placeholder="+34 600 123 456"
                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all">
              </div>
            </div>
          </div>

          <!-- Additional Info -->
          <div class="space-y-4 border-t border-gray-200 pt-8">
            <h4 class="text-sm font-bold text-gray-800 uppercase tracking-wide text-indigo-600">📅 Información Adicional</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Fecha de Nacimiento</label>
                <input type="datetime-local" formControlName="fechaNacimiento"
                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all">
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Género</label>
                <select formControlName="genero" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all">
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4 pt-4">
              <label class="flex items-center p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-indigo-50 transition">
                <input type="checkbox" formControlName="tieneConyuge" class="h-5 w-5 text-indigo-600 rounded cursor-pointer" />
                <span class="ml-3 text-sm font-medium text-gray-700">Tiene Cónyuge</span>
              </label>
              <label class="flex items-center p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-indigo-50 transition">
                <input type="checkbox" formControlName="tieneDependientes" class="h-5 w-5 text-indigo-600 rounded cursor-pointer" />
                <span class="ml-3 text-sm font-medium text-gray-700">Tiene Dependientes</span>
              </label>
            </div>
          </div>

          <!-- Roles -->
          <div class="space-y-4 border-t border-gray-200 pt-8">
            <h4 class="text-sm font-bold text-gray-800 uppercase tracking-wide text-indigo-600">🔐 Asignar Roles</h4>
            <div *ngIf="loadingRoles" class="text-center py-8 text-gray-500">
              <div class="inline-block">Cargando roles...</div>
            </div>
            <div class="grid grid-cols-2 gap-3" *ngIf="!loadingRoles">
              <label *ngFor="let rol of availableRoles" 
                     class="flex items-center p-4 bg-gray-50 rounded-lg cursor-pointer transition" 
                     [class.opacity-50]="isRoleDisabled(rol)"
                     [class.hover:bg-indigo-50]="!isRoleDisabled(rol)">
                <input type="checkbox" 
                       [checked]="isRoleSelected(rol.id)" 
                       [disabled]="isRoleDisabled(rol)"
                       (change)="onRoleChange(rol, $event)"
                       class="h-5 w-5 text-indigo-600 rounded cursor-pointer" />
                <span class="ml-3 text-sm font-medium text-gray-700">{{ rol.nombre }}</span>
              </label>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end space-x-3 pt-8 border-t border-gray-200 sticky bottom-0 bg-white">
            <button type="button" (click)="onCancel.emit()" class="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-semibold">
              Cancelar
            </button>
            <button type="submit" [disabled]="userForm.invalid" class="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed font-bold">
              {{ editingUser ? '✓ Actualizar Usuario' : '+ Crear Usuario' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 6px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #ccc; border-radius: 3px; }
  `]
})
export class UsuarioFormComponent implements OnInit, OnChanges {
  @Input() editingUser: Usuario | null = null;
  @Output() onSave = new EventEmitter<UsuarioDto>();
  @Output() onCancel = new EventEmitter<void>();

  userForm: FormGroup;
  availableRoles: Rol[] = [];
  loadingRoles: boolean = false;
  selectedRoleIds: Set<number> = new Set();

  constructor(
    private fb: FormBuilder,
    private rolService: RolService
  ) {
    this.userForm = this.fb.group({
      nombre: ['', Validators.required],
      papellido: ['', Validators.required],
      sapellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      telefono: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      genero: ['Masculino', Validators.required],
      tieneConyuge: [false],
      tieneDependientes: [false]
    });
  }

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.loadingRoles = true;
    this.rolService.listar().subscribe({
      next: (roles) => {
        this.availableRoles = roles;
        this.loadingRoles = false;
        // If editing, sync selection after roles loaded
        if (this.editingUser) {
          this.syncSelectedRoles();
        }
      },
      error: (err) => {
        console.error('Error loading roles', err);
        this.loadingRoles = false;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editingUser']) {
      if (this.editingUser) {
        this.userForm.patchValue({
          nombre: this.editingUser.nombre,
          papellido: this.editingUser.pApellido || this.editingUser.papellido,
          sapellido: this.editingUser.sApellido || this.editingUser.sapellido,
          email: this.editingUser.email,
          telefono: this.editingUser.telefono,
          fechaNacimiento: this.editingUser.fechaNacimiento,
          genero: this.editingUser.genero,
          tieneConyuge: this.editingUser.tieneConyuge,
          tieneDependientes: this.editingUser.tieneDependientes
        });

        this.userForm.get('password')?.clearValidators();
        this.syncSelectedRoles();

      } else {
        this.userForm.reset({ genero: 'Masculino', tieneConyuge: false, tieneDependientes: false });
        this.selectedRoleIds.clear();
        this.userForm.get('password')?.setValidators(Validators.required);
      }
      this.userForm.get('password')?.updateValueAndValidity();
    }
  }

  syncSelectedRoles(): void {
    this.selectedRoleIds.clear();
    if (this.editingUser?.roles) {
      this.editingUser.roles.forEach(r => this.selectedRoleIds.add(r.id));
    }
  }

  isRoleSelected(roleId: number): boolean {
    return this.selectedRoleIds.has(roleId);
  }

  isRoleDisabled(rol: Rol): boolean {
    // Check if ADMIN is selected
    const adminRole = this.availableRoles.find(r => r.nombre.toUpperCase() === 'ADMIN' || r.nombre.toUpperCase() === 'ROLE_ADMIN');
    if (!adminRole) return false;

    const isAdminSelected = this.selectedRoleIds.has(adminRole.id);

    // If this IS the admin role, it's never disabled by this logic
    if (rol.id === adminRole.id) return false;

    // If Admin is selected, all others are disabled
    return isAdminSelected;
  }

  onRoleChange(rol: Rol, event: any): void {
    const isChecked = event.target.checked;
    const isStatsAdmin = rol.nombre.toUpperCase() === 'ADMIN' || rol.nombre.toUpperCase() === 'ROLE_ADMIN';

    if (isChecked) {
      if (isStatsAdmin) {
        // If selecting ADMIN, clear all others (though they should be unchecked if we follow logic, 
        // but to be safe and strict: select ONLY admin)
        this.selectedRoleIds.clear();
        this.selectedRoleIds.add(rol.id);
      } else {
        // Normal selection
        this.selectedRoleIds.add(rol.id);
      }
    } else {
      this.selectedRoleIds.delete(rol.id);
    }
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const formValue = this.userForm.value;
      const dto: UsuarioDto = {
        ...formValue,
        // Send BOTH casings to ensure backend catches one
        papellido: formValue.papellido,
        sapellido: formValue.sapellido,
        pApellido: formValue.papellido,
        sApellido: formValue.sapellido,
        roles: Array.from(this.selectedRoleIds) // Send array of IDs
      };
      this.onSave.emit(dto);
    }
  }
}
