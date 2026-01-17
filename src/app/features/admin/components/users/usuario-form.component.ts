// src/app/features/admin/components/users/usuario-form.component.ts

import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Usuario, UsuarioDto } from '../../../../core/models/usuario.model';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div class="relative p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white my-8">
        <h3 class="text-lg font-medium text-gray-900 border-b pb-2 mb-4">
          {{ editingUser ? 'Editar Usuario' : 'Nuevo Usuario' }}
        </h3>
        
        <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
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
            <div class="flex items-center mt-6">
              <input type="checkbox" formControlName="tieneConyuge" id="tieneConyuge" class="h-4 w-4 text-indigo-600 border-gray-300 rounded">
              <label for="tieneConyuge" class="ml-2 block text-sm text-gray-900">Tiene Cónyuge</label>
            </div>
            <div class="flex items-center mt-6">
              <input type="checkbox" formControlName="tieneDependientes" id="tieneDependientes" class="h-4 w-4 text-indigo-600 border-gray-300 rounded">
              <label for="tieneDependientes" class="ml-2 block text-sm text-gray-900">Tiene Dependientes</label>
            </div>
          </div>

          <div class="flex justify-end space-x-3 mt-6 border-t pt-4">
            <button type="button" (click)="onCancel.emit()" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancelar</button>
            <button type="submit" [disabled]="userForm.invalid" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class UsuarioFormComponent implements OnChanges {
  @Input() editingUser: Usuario | null = null;
  @Output() onSave = new EventEmitter<UsuarioDto>();
  @Output() onCancel = new EventEmitter<void>();

  userForm: FormGroup;

  constructor(private fb: FormBuilder) {
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editingUser'] && this.editingUser) {
      this.userForm.patchValue({
        nombre: this.editingUser.nombre,
        papellido: this.editingUser.papellido,
        sapellido: this.editingUser.sapellido,
        email: this.editingUser.email,
        telefono: this.editingUser.telefono,
        fechaNacimiento: this.editingUser.fechaNacimiento,
        genero: this.editingUser.genero,
        tieneConyuge: this.editingUser.tieneConyuge,
        tieneDependientes: this.editingUser.tieneDependientes
      });

      this.userForm.get('password')?.clearValidators();
    } else {
      this.userForm.reset({ genero: 'Masculino', tieneConyuge: false, tieneDependientes: false });
      this.userForm.get('password')?.setValidators(Validators.required);
    }
    this.userForm.get('password')?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.onSave.emit(this.userForm.value);
    }
  }
}
