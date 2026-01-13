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
      <div class="relative p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <h3 class="text-lg font-medium text-gray-900 border-b pb-2 mb-4">
          {{ editingUser ? 'Editar Usuario' : 'Nuevo Usuario' }}
        </h3>
        
        <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Username</label>
              <input type="text" formControlName="username" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" formControlName="email" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
            </div>
            <div *ngIf="!editingUser">
              <label class="block text-sm font-medium text-gray-700">Password</label>
              <input type="password" formControlName="password" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
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
            username: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['']
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['editingUser'] && this.editingUser) {
            this.userForm.patchValue({
                username: this.editingUser.username,
                email: this.editingUser.email
            });
            this.userForm.get('password')?.clearValidators();
        } else {
            this.userForm.reset();
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
