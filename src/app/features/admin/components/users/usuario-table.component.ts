// src/app/features/admin/components/users/usuario-table.component.ts

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../../../core/models/usuario.model';

@Component({
  selector: 'app-usuario-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="overflow-x-auto shadow-lg rounded-2xl border border-gray-200">
      <table class="w-full divide-y divide-gray-200 bg-white">
        <!-- Header -->
        <thead class="bg-gradient-to-r from-indigo-50 to-indigo-100 border-b border-indigo-200">
          <tr>
            <th class="px-6 py-4 text-left text-xs font-bold text-indigo-900 uppercase tracking-wide">👤 Nombre</th>
            <th class="px-6 py-4 text-left text-xs font-bold text-indigo-900 uppercase tracking-wide">✉️ Email</th>
            <th class="px-6 py-4 text-left text-xs font-bold text-indigo-900 uppercase tracking-wide">🔐 Roles</th>
            <th class="px-6 py-4 text-center text-xs font-bold text-indigo-900 uppercase tracking-wide">⚙️ Acciones</th>
          </tr>
        </thead>
        <!-- Body -->
        <tbody class="divide-y divide-gray-100">
          <tr *ngFor="let user of userList; let i = index" 
              [class.bg-gray-50]="i % 2 === 0"
              class="hover:bg-indigo-50 transition-colors">
            <!-- Name -->
            <td class="px-6 py-4 text-sm font-semibold text-gray-900">
              {{ user.nombre }} {{ user.pApellido || user.papellido || '' }} {{ user.sApellido || user.sapellido || '' }}
            </td>
            <!-- Email -->
            <td class="px-6 py-4 text-sm text-gray-600">
              {{ user.email }}
            </td>
            <!-- Roles -->
            <td class="px-6 py-4 text-sm">
              <ng-container *ngIf="hasAdminRole(user); else showAllRoles">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200">
                  👑 ADMIN
                </span>
              </ng-container>
              <ng-template #showAllRoles>
                <div class="flex flex-wrap gap-2">
                  <span *ngFor="let rol of user.roles" 
                        class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 border border-indigo-200">
                    🔒 {{ rol.nombre }}
                  </span>
                </div>
              </ng-template>
            </td>
            <!-- Actions -->
            <td class="px-6 py-4 text-sm font-medium">
              <div class="flex justify-center gap-2">
                <button (click)="onView.emit(user.id)" 
                        title="Ver"
                        class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 hover:shadow-md transition-all">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                </button>
                <button (click)="onEdit.emit(user)" 
                        title="Editar"
                        class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-amber-50 text-amber-600 hover:bg-amber-100 hover:shadow-md transition-all">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </button>
                <button *ngIf="!isDeletedView" 
                        (click)="onDelete.emit(user.id)" 
                        title="Eliminar"
                        class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-red-50 text-red-600 hover:bg-red-100 hover:shadow-md transition-all">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- Empty State -->
      <div *ngIf="userList.length === 0" class="text-center py-16 bg-gray-50">
        <div class="text-4xl mb-3">👥</div>
        <p class="text-gray-500 font-medium">No hay usuarios disponibles</p>
      </div>
    </div>
  `
})
export class UsuarioTableComponent {
  @Input() userList: Usuario[] = [];
  @Input() isDeletedView: boolean = false;

  @Output() onView = new EventEmitter<string>();
  @Output() onEdit = new EventEmitter<Usuario>();
  @Output() onDelete = new EventEmitter<string>();

  hasAdminRole(user: Usuario): boolean {
    return user.roles && user.roles.some(r => r.nombre.toUpperCase() === 'ADMIN' || r.nombre.toUpperCase() === 'ROLE_ADMIN');
  }
}
