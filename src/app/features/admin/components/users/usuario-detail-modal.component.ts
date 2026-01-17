// src/app/features/admin/components/users/usuario-detail-modal.component.ts

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../../../core/models/usuario.model';

@Component({
  selector: 'app-usuario-detail-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="user" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div class="relative p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <h3 class="text-lg font-medium text-gray-900 border-b pb-2">Detalle de Usuario</h3>
        <div class="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <p><strong>ID:</strong></p><p>{{ user.id }}</p>
          <p><strong>Nombre:</strong></p><p>{{ user.nombre }} {{ user.papellido }} {{ user.sapellido }}</p>
          <p><strong>Email:</strong></p><p>{{ user.email }}</p>
          <p><strong>Teléfono:</strong></p><p>{{ user.telefono }}</p>
          <p><strong>Nacimiento:</strong></p><p>{{ user.fechaNacimiento | date:'shortDate' }}</p>
          <p><strong>Género:</strong></p><p>{{ user.genero }}</p>
          <p><strong>Cónyuge:</strong></p><p>{{ user.tieneConyuge ? 'Sí' : 'No' }}</p>
          <p><strong>Dependientes:</strong></p><p>{{ user.tieneDependientes ? 'Sí' : 'No' }}</p>
          <p><strong>Estado:</strong></p><p>{{ (user.activo !== undefined ? user.activo : user.isEnabled) ? 'Activo' : 'Inactivo' }}</p>
          <div class="col-span-2 mt-2">
            <strong>Roles:</strong>
            <div class="mt-1 flex flex-wrap gap-1">
              <span *ngFor="let rol of user.roles" class="px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-800">
                {{ rol.nombre }}
              </span>
            </div>
          </div>
        </div>
        <div class="mt-6 border-t pt-4">
          <button (click)="onClose.emit()" class="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">Cerrar</button>
        </div>
      </div>
    </div>
  `
})
export class UsuarioDetailModalComponent {
  @Input() user: Usuario | null = null;
  @Output() onClose = new EventEmitter<void>();
}
