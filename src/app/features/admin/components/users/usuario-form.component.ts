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
    <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div class="relative p-5 border w-full max-w-3xl shadow-lg rounded-md bg-white my-8 max-h-[90vh] flex flex-col">
        <h3 class="text-lg font-medium text-gray-900 border-b pb-2 mb-4">
          {{ editingUser ? 'Editar Usuario' : 'Nuevo Usuario' }}
        </h3>
        
        <form [formGroup]="userForm" (ngSubmit)="onSubmit()" class="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Nombre</label>
              <input type="text" formControlName="nombre" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Primer Apellido</label>
              <input type="text" formControlName="papellido" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Segundo Apellido</label>
              <input type="text" formControlName="sapellido" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" formControlName="email" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
            </div>
            <div *ngIf="!editingUser">
              <label class="block text-sm font-medium text-gray-700">Password</label>
              <input type="password" formControlName="password" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Teléfono</label>
              <input type="text" formControlName="telefono" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
              <input type="datetime-local" formControlName="fechaNacimiento" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Género</label>
              <select formControlName="genero" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
              </select>
            </div>
            
            <div class="md:col-span-2 mt-4 border-t pt-4">
               <h4 class="text-sm font-bold text-gray-700 mb-3 block">Asignar Roles</h4>
               <div *ngIf="loadingRoles" class="text-sm text-gray-500">Cargando roles...</div>
               <div class="grid grid-cols-2 gap-2" *ngIf="!loadingRoles">
                  <div *ngFor="let rol of availableRoles" class="flex items-center p-2 border rounded hover:bg-gray-50"
                       [class.opacity-50]="isRoleDisabled(rol)">
                    <input type="checkbox" 
                           [checked]="isRoleSelected(rol.id)" 
                           [disabled]="isRoleDisabled(rol)"
                           (change)="onRoleChange(rol, $event)"
                           class="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 disabled:cursor-not-allowed">
                    <label class="ml-2 block text-sm text-gray-900 cursor-pointer w-full" 
                           [class.cursor-not-allowed]="isRoleDisabled(rol)">
                      <span class="font-medium">{{ rol.nombre }}</span>
                    </label>
                  </div>
               </div>
            </div>

            <div class="flex items-center mt-4">
              <input type="checkbox" formControlName="tieneConyuge" id="tieneConyuge" class="h-4 w-4 text-indigo-600 border-gray-300 rounded">
              <label for="tieneConyuge" class="ml-2 block text-sm text-gray-900">Tiene Cónyuge</label>
            </div>
            <div class="flex items-center mt-6">
              <input type="checkbox" formControlName="tieneDependientes" id="tieneDependientes" class="h-4 w-4 text-indigo-600 border-gray-300 rounded">
              <label for="tieneDependientes" class="ml-2 block text-sm text-gray-900">Tiene Dependientes</label>
            </div>
          </div>

          <div class="flex justify-end space-x-3 mt-6 border-t pt-4 sticky bottom-0 bg-white">
            <button type="button" (click)="onCancel.emit()" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancelar</button>
            <button type="submit" [disabled]="userForm.invalid" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50">Guardar</button>
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
