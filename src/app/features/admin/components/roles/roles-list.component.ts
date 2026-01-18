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
      <div class="flex justify-between items-center mb-6">
        <div>
          <h2 class="text-3xl font-bold text-gray-800 dark:text-gray-100">Gestión de Roles</h2>
          <p class="text-gray-600 dark:text-gray-400 mt-1">Configura los roles y sus permisos asociados</p>
        </div>
        <button (click)="openCreateModal()" 
          class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all flex items-center">
          <i class="fas fa-plus mr-2"></i> Nuevo Rol
        </button>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading && roles.length === 0" class="text-center py-20 bg-gray-50 rounded-lg">
        <i class="fas fa-user-shield text-gray-400 text-5xl mb-4"></i>
        <h3 class="text-xl font-medium text-gray-600">No hay roles definidos</h3>
        <p class="text-gray-500 mt-2">Crea el primer rol para comenzar</p>
      </div>

      <!-- Roles Grid -->
      <div *ngIf="!loading && roles.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let rol of roles" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow p-6 relative group">
          
          <div class="flex justify-between items-start mb-4">
            <div class="bg-blue-100 text-blue-800 p-3 rounded-lg">
              <i class="fas fa-shield-alt text-xl"></i>
            </div>
            <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button (click)="openEditModal(rol)" class="text-gray-400 hover:text-blue-600 p-1" title="Editar">
                <i class="fas fa-edit"></i>
              </button>
              <button (click)="confirmDelete(rol)" class="text-gray-400 hover:text-red-600 p-1" title="Eliminar">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>

          <h3 class="text-xl font-bold text-gray-800 mb-2">{{ rol.nombre }}</h3>
          <p class="text-gray-500 text-sm mb-4 min-h-[40px]">{{ rol.descripcion || 'Sin descripción' }}</p>

          <div class="border-t pt-4">
            <h4 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Permisos ({{ rol.permisos?.length || 0 }})</h4>
            <div class="flex flex-wrap gap-1">
              <span *ngFor="let permiso of rol.permisos | slice:0:5" 
                class="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                {{ permiso.nombre }}
              </span>
              <span *ngIf="(rol.permisos?.length || 0) > 5" class="bg-gray-100 text-gray-500 px-2 py-1 rounded text-xs">
                +{{ (rol.permisos?.length || 0) - 5 }} más
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
