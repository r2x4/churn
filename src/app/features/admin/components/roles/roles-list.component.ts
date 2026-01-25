import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RolService } from '../../../../core/services/rol.service';
import { Rol, RolDto } from '../../../../core/models/rol.model';
import { RoleFormModalComponent } from './role-form-modal.component';
import { ConfirmModalComponent } from '../confirm-modal.component';

@Component({
  selector: 'app-roles-list',
  standalone: true,
  imports: [CommonModule, RoleFormModalComponent, ConfirmModalComponent],
  template: `
    <div class="container mx-auto px-4 py-8">
      <!-- Header Section -->
      <div class="mb-8">
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-3xl font-bold text-gray-900">🔐 Gestión de Roles</h2>
            <p class="text-gray-600 mt-2">Configura los roles y sus permisos asociados</p>
          </div>
          <button (click)="openCreateModal()" 
            class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Nuevo Rol
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600"></div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading && roles.length === 0" class="text-center py-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
        <div class="text-6xl mb-4">🛡️</div>
        <h3 class="text-2xl font-bold text-gray-700 mb-2">No hay roles definidos</h3>
        <p class="text-gray-500">Crea el primer rol para comenzar a gestionar permisos</p>
      </div>

      <!-- Roles Grid -->
      <div *ngIf="!loading && roles.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let rol of roles" 
             class="bg-white rounded-xl shadow-md hover:shadow-xl border border-gray-200 hover:border-indigo-300 transition-all p-6 group relative overflow-hidden">
          <!-- Background decoration -->
          <div class="absolute top-0 right-0 w-20 h-20 bg-indigo-50 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform"></div>
          
          <!-- Header -->
          <div class="flex justify-between items-start mb-4 relative z-10">
            <div class="bg-indigo-100 text-indigo-700 p-4 rounded-lg font-bold text-xl">
              🔒
            </div>
            <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button (click)="openEditModal(rol)" 
                      title="Editar"
                      class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-amber-50 text-amber-600 hover:bg-amber-100 shadow-sm hover:shadow-md transition-all">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </button>
              <button (click)="confirmDelete(rol)" 
                      title="Eliminar"
                      class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-red-50 text-red-600 hover:bg-red-100 shadow-sm hover:shadow-md transition-all">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Title and Description -->
          <h3 class="text-xl font-bold text-gray-900 mb-2 relative z-10">{{ rol.nombre }}</h3>
          <p class="text-gray-600 text-sm mb-6 min-h-[40px] relative z-10 line-clamp-2">
            {{ rol.descripcion || '📝 Sin descripción disponible' }}
          </p>

          <!-- Permissions Section -->
          <div class="border-t border-gray-200 pt-4 relative z-10">
            <div class="flex items-center justify-between mb-3">
              <h4 class="text-xs font-bold text-indigo-600 uppercase tracking-widest">✨ Permisos ({{ rol.permisos?.length || 0 }})</h4>
            </div>
            <div class="flex flex-wrap gap-2">
              <span *ngFor="let permiso of rol.permisos | slice:0:5" 
                    class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                {{ permiso.nombre }}
              </span>
              <span *ngIf="(rol.permisos?.length || 0) > 5" 
                    class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-300">
                +{{ (rol.permisos?.length || 0) - 5 }} más
              </span>
              <span *ngIf="(rol.permisos?.length || 0) === 0" 
                    class="text-xs text-gray-500 italic">
                Sin permisos asignados
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Modals -->
      <app-role-form-modal 
        *ngIf="showFormModal" 
        [role]="selectedRole"
        (onSave)="handleSave($event)"
        (onCancel)="closeFormModal()">
      </app-role-form-modal>

      <app-confirm-modal
        *ngIf="showDeleteModal"
        title="Eliminar Rol"
        message="¿Estás seguro de que deseas eliminar este rol? Esta acción no se puede deshacer."
        (onConfirm)="deleteRole()"
        (onCancel)="closeDeleteModal()">
      </app-confirm-modal>
    </div>
  `
})
export class RolesListComponent implements OnInit {
  roles: Rol[] = [];
  loading = true;

  showFormModal = false;
  showDeleteModal = false;
  selectedRole: Rol | null = null;
  roleToDelete: Rol | null = null;

  constructor(private rolService: RolService) { }

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.loading = true;
    this.rolService.listar().subscribe({
      next: (data) => {
        this.roles = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading roles', err);
        this.loading = false;
      }
    });
  }

  openCreateModal(): void {
    this.selectedRole = null;
    this.showFormModal = true;
  }

  openEditModal(rol: Rol): void {
    this.selectedRole = rol;
    this.showFormModal = true;
  }

  closeFormModal(): void {
    this.showFormModal = false;
    this.selectedRole = null;
  }

  handleSave(dto: RolDto): void {
    if (this.selectedRole) {
      this.rolService.actualizar(this.selectedRole.id, dto).subscribe(() => {
        this.loadRoles();
        this.closeFormModal();
      });
    } else {
      this.rolService.crear(dto).subscribe(() => {
        this.loadRoles();
        this.closeFormModal();
      });
    }
  }

  confirmDelete(rol: Rol): void {
    this.roleToDelete = rol;
    this.showDeleteModal = true;
  }

  deleteRole(): void {
    if (this.roleToDelete) {
      this.rolService.eliminar(this.roleToDelete.id).subscribe(() => {
        this.loadRoles();
        this.closeDeleteModal();
      });
    }
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.roleToDelete = null;
  }
}
