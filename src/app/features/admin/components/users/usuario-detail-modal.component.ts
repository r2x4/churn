import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../../../core/models/usuario.model';
import { Rol } from '../../../../core/models/rol.model';
import { RolService } from '../../../../core/services/rol.service';
import { UsuarioService } from '../../../../core/services/usuario.service';


@Component({
  selector: 'app-usuario-detail-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="user" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div class="relative p-6 border w-full max-w-2xl shadow-xl rounded-xl bg-white flex flex-col max-h-[90vh]">
        
        <!-- Header -->
        <div class="flex justify-between items-center pb-4 border-b border-gray-100">
          <div>
            <h3 class="text-xl font-bold text-gray-800">Detalle de Usuario</h3>
            <p class="text-sm text-gray-500">ID: {{ user.id }}</p>
          </div>
          <button (click)="onClose.emit()" class="text-gray-400 hover:text-gray-600 transition-colors">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>

        <div class="overflow-y-auto custom-scrollbar flex-1 pr-2 mt-4">
          <!-- Info Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm mb-8">
            <div class="space-y-1">
              <label class="block text-xs font-semibold text-gray-500 uppercase">Nombre Completo</label>
              <p class="text-gray-900 font-medium">{{ user.nombre }} {{ user.papellido }} {{ user.sapellido }}</p>
            </div>
            <div class="space-y-1">
              <label class="block text-xs font-semibold text-gray-500 uppercase">Email</label>
              <p class="text-gray-900">{{ user.email }}</p>
            </div>
            <div class="space-y-1">
              <label class="block text-xs font-semibold text-gray-500 uppercase">Teléfono</label>
              <p class="text-gray-900">{{ user.telefono }}</p>
            </div>
            <div class="space-y-1">
              <label class="block text-xs font-semibold text-gray-500 uppercase">Fecha Nacimiento</label>
              <p class="text-gray-900">{{ user.fechaNacimiento | date:'mediumDate' }}</p>
            </div>
            <div class="space-y-1">
              <label class="block text-xs font-semibold text-gray-500 uppercase">Género</label>
              <p class="text-gray-900">{{ user.genero }}</p>
            </div>
            <div class="space-y-1">
              <label class="block text-xs font-semibold text-gray-500 uppercase">Estado</label>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                [ngClass]="(user.activo !== undefined ? user.activo : user.isEnabled) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                {{ (user.activo !== undefined ? user.activo : user.isEnabled) ? 'Activo' : 'Inactivo' }}
              </span>
            </div>
          </div>

          <!-- Roles Management Section -->
          <div class="bg-gray-50 rounded-lg p-5 border border-gray-100">
            <h4 class="text-base font-bold text-gray-800 mb-4 flex items-center">
              <i class="fas fa-user-shield text-blue-500 mr-2"></i> Gestión de Roles
            </h4>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div *ngFor="let rol of availableRoles" 
                class="flex items-center justify-between p-3 rounded-md border transition-all"
                [ngClass]="hasRole(rol.id) ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-white border-gray-200 hover:border-blue-300'">
                
                <div class="flex items-center">
                  <div class="h-8 w-8 rounded-full flex items-center justify-center mr-3"
                    [ngClass]="hasRole(rol.id) ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'">
                    <i class="fas fa-shield-alt text-sm"></i>
                  </div>
                  <div>
                    <p class="text-sm font-medium" [ngClass]="hasRole(rol.id) ? 'text-blue-900' : 'text-gray-700'">
                      {{ rol.nombre }}
                    </p>
                  </div>
                </div>

                <button class="ml-2 focus:outline-none transition-transform active:scale-95"
                  [disabled]="loadingRoleAction"
                  (click)="toggleRole(rol.id)">
                  <div *ngIf="hasRole(rol.id)" class="text-red-500 hover:text-red-700 p-1" title="Remover Rol">
                    <i class="fas fa-minus-circle"></i>
                  </div>
                  <div *ngIf="!hasRole(rol.id)" class="text-green-500 hover:text-green-700 p-1" title="Asignar Rol">
                    <i class="fas fa-plus-circle"></i>
                  </div>
                </button>
              </div>
            </div>
            
            <div *ngIf="loadingRoles" class="text-center py-4 text-gray-400 text-sm">
              <i class="fas fa-spinner fa-spin mr-2"></i> Cargando roles disponibles...
            </div>
          </div>
        </div>

        <div class="mt-6 pt-4 border-t border-gray-100 flex justify-end">
          <button (click)="onClose.emit()" 
            class="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors">
            Cerrar
          </button>
        </div>
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
      background: #ccc;
      border-radius: 3px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #999;
    }
  `]
})
export class UsuarioDetailModalComponent implements OnInit, OnChanges {
  @Input() user: Usuario | null = null;
  @Output() onClose = new EventEmitter<void>();
  @Output() onUserUpdated = new EventEmitter<void>(); // To notify parent to refresh list

  availableRoles: Rol[] = [];
  loadingRoles = false;
  loadingRoleAction = false;

  constructor(
    private rolService: RolService,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
    this.loadRoles();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user'] && this.user) {
      // Refresh logic if needed when user changes
    }
  }

  loadRoles(): void {
    this.loadingRoles = true;
    this.rolService.listar().subscribe({
      next: (data) => {
        this.availableRoles = data;
        this.loadingRoles = false;
        // Check for 'alertService' existence in your project, if not remove it.
        // Assuming user has alertService based on context, or use console/standard alert
      },
      error: (err) => {
        console.error('Error loading roles', err);
        this.loadingRoles = false;
      }
    });
  }

  hasRole(rolId: number): boolean {
    if (!this.user || !this.user.roles) return false;
    return this.user.roles.some(r => r.id === rolId);
  }

  toggleRole(rolId: number): void {
    if (!this.user) return;

    this.loadingRoleAction = true;
    const userId = this.user.id;
    const isAssigned = this.hasRole(rolId);

    if (isAssigned) {
      // Remove Role
      this.usuarioService.removerRol(userId, rolId).subscribe({
        next: (response) => {
          // Provide feedback
          // Update local user state
          this.updateLocalRoles(response.data);
          this.loadingRoleAction = false;
          this.onUserUpdated.emit();
        },
        error: (err) => {
          console.error('Error removing role', err);
          this.loadingRoleAction = false;
        }
      });
    } else {
      // Assign Role
      this.usuarioService.asignarRol(userId, rolId).subscribe({
        next: (response) => {
          this.updateLocalRoles(response.data);
          this.loadingRoleAction = false;
          this.onUserUpdated.emit();
        },
        error: (err) => {
          console.error('Error assigning role', err);
          this.loadingRoleAction = false;
        }
      });
    }
  }

  updateLocalRoles(updatedUser: Usuario): void {
    if (this.user && updatedUser) {
      this.user.roles = updatedUser.roles;
    }
  }
}
