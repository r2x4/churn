// src/app/features/admin/components/users/usuario-table.component.ts

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../../../core/models/usuario.model';

@Component({
    selector: 'app-usuario-table',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
      <table class="min-w-full divide-y divide-gray-300">
        <thead class="bg-gray-50">
          <tr>
            <th class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Username</th>
            <th class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
            <th class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Roles</th>
            <th class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          <tr *ngFor="let user of userList">
            <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
              {{ user.username }}
            </td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              {{ user.email }}
            </td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              <span *ngFor="let rol of user.roles" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mr-1">
                {{ rol.nombre }}
              </span>
            </td>
            <td class="whitespace-nowrap px-3 py-4 text-sm font-medium space-x-2">
              <button (click)="onView.emit(user.id)" class="text-blue-600 hover:text-blue-900">🔍 Ver</button>
              <button (click)="onEdit.emit(user)" class="text-orange-600 hover:text-orange-900">✏️ Editar</button>
              <button (click)="onDelete.emit(user.id)" *ngIf="!isDeletedView" class="text-red-600 hover:text-red-900">🗑️ Borrar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class UsuarioTableComponent {
    @Input() userList: Usuario[] = [];
    @Input() isDeletedView: boolean = false;

    @Output() onView = new EventEmitter<string>();
    @Output() onEdit = new EventEmitter<Usuario>();
    @Output() onDelete = new EventEmitter<string>();
}
