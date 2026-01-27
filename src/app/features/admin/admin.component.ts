import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PredictionService } from '../../core/services/prediction.service';
import { CustomerInput, PredictionOutput } from '../../core/models/customer-prediction.model';
import { HistorialService } from '../../core/services/historial.service';
import { HistorialPrediccion, HistorialPrediccionDto } from '../../core/models/historial.model';
import { HistorialTableComponent } from './components/historial-table.component';
import { HistorialDetailModalComponent } from './components/historial-detail-modal.component';
import { UsuarioService } from '../../core/services/usuario.service';
import { Usuario, UsuarioDto } from '../../core/models/usuario.model';
import { UsuarioTableComponent } from './components/users/usuario-table.component';
import { UsuarioDetailModalComponent } from './components/users/usuario-detail-modal.component';
import { UsuarioFormComponent } from './components/users/usuario-form.component';
import { ConfirmModalComponent } from './components/confirm-modal.component';
import { RolesListComponent } from './components/roles/roles-list.component';
import { ApiService } from '../../core/services/api.service';
import { Plan, PlanDto } from '../../core/models/plan.model';
import { Oferta, OfertaDto } from '../../core/models/oferta.model';
import { PlanService } from '../../core/services/plan.service';
import { OfertaService } from '../../core/services/oferta.service';
import { PlanTableComponent } from './components/planes/plan-table.component';
import { PlanFormComponent } from './components/planes/plan-form.component';
import { OfertaTableComponent } from './components/ofertas/oferta-table.component';
import { OfertaFormComponent } from './components/ofertas/oferta-form.component';
import { ServicioTableComponent } from './components/servicios/servicio-table.component';
import { ServicioFormComponent } from './components/servicios/servicio-form.component';
import { Servicio, ServicioDto } from '../../core/models/servicio.model';
import { ServicioService } from '../../core/services/servicio.service';
import { ChurnPredictionComponent } from '../churn-prediction/churn-prediction.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HistorialTableComponent,
    HistorialDetailModalComponent,
    UsuarioTableComponent,
    UsuarioDetailModalComponent,
    UsuarioFormComponent,
    ConfirmModalComponent,
    RolesListComponent,
    PlanTableComponent,
    PlanFormComponent,
    OfertaTableComponent,
    OfertaFormComponent,
    ServicioTableComponent,
    ServicioFormComponent,
    ChurnPredictionComponent
  ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  selectedTab: string = 'history'; // Default selected tab

  // Datos de historial
  historyList: HistorialPrediccion[] = [];
  isLoadingHistory: boolean = false;
  viewingDeleted: boolean = false;
  historyPage: number = 0;
  historySize: number = 10;
  historyTotal: number = 0;

  // Variables para componentes Historial
  selectedHistory: HistorialPrediccion | null = null;
  showDetail: boolean = false;

  // Variables para componentes Usuarios
  userList: Usuario[] = [];
  isLoadingUsers: boolean = false;
  viewingDeletedUsers: boolean = false;
  selectedUser: Usuario | null = null;
  editingUser: Usuario | null = null;
  showUserForm: boolean = false;
  showUserDetail: boolean = false;

  // Variables para Confirmación Personalizada
  showConfirmModal: boolean = false;
  confirmModalTitle: string = '';
  confirmModalMessage: string = '';
  confirmModalType: 'danger' | 'success' | 'info' = 'danger';
  confirmModalButtonText: string = 'Confirmar';
  pendingAction: (() => void) | null = null;

  // Variables para Planes
  planList: Plan[] = [];
  isLoadingPlanes = false;
  selectedPlan: any = null;
  showPlanForm = false;

  // Variables para Ofertas
  ofertaList: Oferta[] = [];
  isLoadingOfertas = false;
  selectedOferta: Oferta | null = null;

  showOfertaForm = false;

  // Variables para Servicios
  servicioList: Servicio[] = [];
  isLoadingServicios = false;
  viewingDeletedServicios = false;
  selectedServicio: Servicio | null = null;
  showServicioForm = false;

  constructor(
    private predictionService: PredictionService,
    private historialService: HistorialService,
    private usuarioService: UsuarioService,
    private fb: FormBuilder,
    private apiService: ApiService,
    private planService: PlanService,
    private ofertaService: OfertaService,
    private servicioService: ServicioService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['tab']) {
        this.selectTab(params['tab'], false);
      } else {
        this.selectTab('history', true);
      }
    });
  }

  selectTab(tab: string, updateUrl: boolean = true): void {
    this.selectedTab = tab;

    if (updateUrl) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { tab: tab },
        queryParamsHandling: 'merge'
      });
    }

    if (tab === 'history') {
      this.historyPage = 0;
      this.loadHistory();
    } else if (tab === 'users') {
      this.loadUsers();
    } else if (tab === 'planes') {
      this.loadPlanes();
    } else if (tab === 'ofertas') {
      this.loadOfertas();
    } else if (tab === 'servicios') {
      this.loadServicios();
    }
  }

  loadHistory(): void {
    this.isLoadingHistory = true;
    const request = this.viewingDeleted
      ? this.historialService.listarEliminados(this.historyPage, this.historySize)
      : this.historialService.listarActivos(this.historyPage, this.historySize);

    request.subscribe({
      next: (response) => {
        if (response.data && (response.data as any).content) {
          this.historyList = (response.data as any).content;
          this.historyTotal = (response.data as any).totalElements || 0;
        } else if (Array.isArray(response.data)) {
          this.historyList = response.data;
          this.historyTotal = response.data.length;
        } else {
          this.historyList = [];
          this.historyTotal = 0;
        }
        this.isLoadingHistory = false;
      },
      error: (error) => {
        console.error('Error al cargar historial:', error);
        this.isLoadingHistory = false;
        this.historyList = [];
        this.historyTotal = 0;
      }
    });
  }

  onHistoryPageChange(page: number): void {
    this.historyPage = page;
    this.loadHistory();
  }

  toggleDeleted(): void {
    this.viewingDeleted = !this.viewingDeleted;
    this.historyPage = 0;
    this.loadHistory();
  }

  viewHistoryDetail(item: HistorialPrediccion): void {
    // Usar directamente el objeto del historial para evitar problemas de sincronización
    // y asegurar que se muestre el customerID correcto
    this.selectedHistory = item;
    this.showDetail = true;
  }

  closeDetail(): void {
    this.showDetail = false;
    this.selectedHistory = null;
  }





  // ================= USERS LOGIC =================

  loadUsers(): void {
    this.isLoadingUsers = true;
    const request = this.viewingDeletedUsers
      ? this.usuarioService.listarEliminados(0, 50)
      : this.usuarioService.listarActivos(0, 50);

    request.subscribe({
      next: (response) => {
        if (response.data && (response.data as any).content) {
          this.userList = (response.data as any).content;
        } else if (Array.isArray(response.data)) {
          this.userList = response.data;
        } else {
          this.userList = [];
        }
        this.isLoadingUsers = false;
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        this.isLoadingUsers = false;
        this.userList = [];
      }
    });
  }

  toggleDeletedUsers(): void {
    this.viewingDeletedUsers = !this.viewingDeletedUsers;
    this.loadUsers();
  }

  viewUserDetail(id: string): void {
    this.usuarioService.buscarPorId(id).subscribe(res => {
      this.selectedUser = res.data;
      this.showUserDetail = true;
    });
  }

  openCreateUserForm(): void {
    this.editingUser = null;
    this.showUserForm = true;
  }

  openEditUserForm(user: Usuario): void {
    this.editingUser = user;
    this.showUserForm = true;
  }

  saveUser(dto: UsuarioDto): void {
    if (this.editingUser) {
      dto.id = this.editingUser.id;
    }
    const request = this.editingUser
      ? this.usuarioService.editar(this.editingUser.id, dto)
      : this.usuarioService.crear(dto);

    request.subscribe({
      next: (response) => {
        const savedUser = response.data;
        const targetRoles = dto.roles || [];

        if (savedUser.id) {
          this.syncRoles(savedUser.id, targetRoles, () => {
            this.confirmModalTitle = 'Éxito';
            this.confirmModalMessage = this.editingUser ? 'Usuario editado correctamente' : 'Usuario creado correctamente';
            this.confirmModalType = 'success';
            this.confirmModalButtonText = 'Aceptar';
            this.pendingAction = () => {
              this.showUserForm = false;
              this.loadUsers();
            };
            this.showConfirmModal = true;
          });
        }
      },
      error: (err) => {
        console.error('Error saving user', err);
      }
    });
  }



  syncRoles(userId: string, targetRoleIds: number[], onComplete: () => void): void {
    this.usuarioService.buscarPorId(userId).subscribe(res => {
      const currentUser = res.data;
      const currentRoleIds = new Set(currentUser.roles.map(r => r.id));
      const targetIds = new Set(targetRoleIds);

      const rolesToAdd = targetRoleIds.filter(id => !currentRoleIds.has(id));
      const rolesToRemove = Array.from(currentRoleIds).filter(id => !targetIds.has(id));

      const promises: Promise<any>[] = [];

      rolesToAdd.forEach(id => {
        promises.push(new Promise((resolve) => {
          this.usuarioService.asignarRol(userId, id).subscribe({
            next: resolve,
            error: (e) => {
              console.error('Error adding role', id, e);
              resolve(null);
            }
          });
        }));
      });

      rolesToRemove.forEach(id => {
        promises.push(new Promise((resolve) => {
          this.usuarioService.removerRol(userId, id).subscribe({
            next: resolve,
            error: (e) => {
              console.error('Error removing role', id, e);
              resolve(null);
            }
          });
        }));
      });

      if (promises.length > 0) {
        Promise.all(promises).then(() => onComplete());
      } else {
        onComplete();
      }
    });
  }

  deleteUser(id: string): void {
    this.confirmModalTitle = 'Eliminar Usuario';
    this.confirmModalMessage = '¿Estás seguro de que deseas eliminar este usuario? Esta acción es un borrado lógico.';
    this.confirmModalType = 'danger';
    this.confirmModalButtonText = 'Eliminar';
    this.pendingAction = () => {
      this.usuarioService.eliminar(id).subscribe(() => {
        this.loadUsers();
      });
    };
    this.showConfirmModal = true;
  }

  deleteHistory(id: number): void {
    this.confirmModalTitle = 'Eliminar Registro';
    this.confirmModalMessage = '¿Estás seguro de que deseas eliminar este registro del historial?';
    this.confirmModalType = 'danger';
    this.confirmModalButtonText = 'Eliminar';
    this.pendingAction = () => {
      this.historialService.eliminar(id).subscribe(() => {
        this.loadHistory();
      });
    };
    this.showConfirmModal = true;
  }

  executePendingAction(): void {
    if (this.pendingAction) {
      this.pendingAction();
      this.pendingAction = null;
    }
    this.showConfirmModal = false;
  }

  cancelPendingAction(): void {
    this.pendingAction = null;
    this.showConfirmModal = false;
  }



  // ================= PLANES LOGIC =================

  loadPlanes(): void {
    this.isLoadingPlanes = true;
    this.planService.listar(0, 100).subscribe({
      next: (res) => {
        if (res.data && (res.data as any).content) {
          this.planList = (res.data as any).content;
        } else if (Array.isArray(res.data)) {
          this.planList = res.data;
        } else {
          this.planList = [];
        }
        this.isLoadingPlanes = false;
      },
      error: (err) => {
        console.error('Error loading planes:', err);
        this.isLoadingPlanes = false;
        this.planList = [];
      }
    });
  }

  openCreatePlanForm(): void {
    this.selectedPlan = null;
    this.showPlanForm = true;
  }

  openEditPlanForm(plan: Plan): void {
    // Load full plan from API to get all editable boolean fields
    this.planService.buscarPorId(plan.id).subscribe({
      next: (res) => {
        this.selectedPlan = res.data;
        this.showPlanForm = true;
      },
      error: (err) => {
        console.error('Error fetching plan details:', err);
      }
    });
  }

  savePlan(dto: any): void {
    const request = this.selectedPlan
      ? this.planService.editar(this.selectedPlan.id, dto)
      : this.planService.crear(dto);

    request.subscribe({
      next: () => {
        this.confirmModalTitle = 'Éxito';
        this.confirmModalMessage = this.selectedPlan ? 'Plan actualizado correctamente' : 'Plan creado correctamente';
        this.confirmModalType = 'success';
        this.confirmModalButtonText = 'Aceptar';
        this.pendingAction = () => {
          this.showPlanForm = false;
          this.loadPlanes();
        };
        this.showConfirmModal = true;
      },
      error: (err) => {
        console.error('Error saving plan:', err);
      }
    });
  }



  deletePlan(id: number): void {
    this.confirmModalTitle = 'Eliminar Plan';
    this.confirmModalMessage = '¿Estás seguro de que deseas eliminar este plan?';
    this.confirmModalType = 'danger';
    this.confirmModalButtonText = 'Eliminar';
    this.pendingAction = () => {
      this.planService.eliminar(id).subscribe(() => {
        this.loadPlanes();
      });
    };
    this.showConfirmModal = true;
  }

  // ================= OFERTAS LOGIC =================

  loadOfertas(): void {
    this.isLoadingOfertas = true;
    this.ofertaService.listar().subscribe({
      next: (res) => {
        if (res.data && (res.data as any).content) {
          this.ofertaList = (res.data as any).content;
        } else if (Array.isArray(res.data)) {
          this.ofertaList = res.data;
        } else {
          this.ofertaList = [];
        }
        this.isLoadingOfertas = false;
      },
      error: (err) => {
        console.error('Error loading ofertas:', err);
        this.isLoadingOfertas = false;
        this.ofertaList = [];
      }
    });
  }

  openCreateOfertaForm(): void {
    this.selectedOferta = null;
    this.showOfertaForm = true;
  }

  openEditOfertaForm(oferta: Oferta): void {
    this.selectedOferta = oferta;
    this.showOfertaForm = true;
  }

  saveOferta(dto: OfertaDto): void {
    const request = this.selectedOferta
      ? this.ofertaService.editar(this.selectedOferta.id, dto)
      : this.ofertaService.crear(dto);

    request.subscribe({
      next: () => {
        this.confirmModalTitle = 'Éxito';
        this.confirmModalMessage = this.selectedOferta ? 'Oferta actualizada correctamente' : 'Oferta creada correctamente';
        this.confirmModalType = 'success';
        this.confirmModalButtonText = 'Aceptar';
        this.pendingAction = () => {
          this.showOfertaForm = false;
          this.loadOfertas();
        };
        this.showConfirmModal = true;
      },
      error: (err) => {
        console.error('Error saving oferta:', err);
      }
    });
  }



  deleteOferta(id: number): void {
    this.confirmModalTitle = 'Eliminar Oferta';
    this.confirmModalMessage = '¿Estás seguro de que deseas eliminar esta oferta?';
    this.confirmModalType = 'danger';
    this.confirmModalButtonText = 'Eliminar';
    this.pendingAction = () => {
      this.ofertaService.eliminar(id).subscribe(() => {
        this.loadOfertas();
      });
    };
    this.showConfirmModal = true;
  }

  // ================= SERVICIOS LOGIC =================

  loadServicios(): void {
    this.isLoadingServicios = true;
    const request = this.viewingDeletedServicios
      ? this.servicioService.listarEliminados(0, 50)
      : this.servicioService.listar(0, 50);

    request.subscribe({
      next: (res) => {
        if (res.data && (res.data as any).content) {
          this.servicioList = (res.data as any).content;
        } else if (Array.isArray(res.data)) {
          this.servicioList = res.data;
        } else {
          this.servicioList = [];
        }
        this.isLoadingServicios = false;
      },
      error: (err) => {
        console.error('Error loading servicios:', err);
        this.isLoadingServicios = false;
        this.servicioList = [];
      }
    });
  }

  toggleDeletedServicios(): void {
    this.viewingDeletedServicios = !this.viewingDeletedServicios;
    this.loadServicios();
  }

  openCreateServicioForm(): void {
    // Ensure dependencies are loaded
    if (this.userList.length === 0) this.loadUsers();
    if (this.planList.length === 0) this.loadPlanes();

    this.selectedServicio = null;
    this.showServicioForm = true;
  }

  openEditServicioForm(servicio: Servicio): void {
    // Ensure dependencies are loaded
    if (this.userList.length === 0) this.loadUsers();
    if (this.planList.length === 0) this.loadPlanes();

    this.selectedServicio = servicio;
    this.showServicioForm = true;
  }

  saveServicio(dto: ServicioDto): void {
    const request = this.selectedServicio
      ? this.servicioService.editar(this.selectedServicio.id, dto)
      : this.servicioService.crear(dto);

    request.subscribe({
      next: () => {
        this.confirmModalTitle = 'Éxito';
        this.confirmModalMessage = this.selectedServicio ? 'Servicio actualizado correctamente' : 'Servicio creado correctamente';
        this.confirmModalType = 'success';
        this.confirmModalButtonText = 'Aceptar';
        this.pendingAction = () => {
          this.showServicioForm = false;
          this.loadServicios();
        };
        this.showConfirmModal = true;
      },
      error: (err) => {
        console.error('Error saving servicio:', err);
        // Could handle error feedback here too
      }
    });
  }

  deleteServicio(id: number): void {
    this.confirmModalTitle = 'Eliminar Servicio';
    this.confirmModalMessage = '¿Estás seguro de que deseas eliminar este servicio?';
    this.confirmModalType = 'danger';
    this.confirmModalButtonText = 'Eliminar';
    this.pendingAction = () => {
      this.servicioService.eliminar(id).subscribe(() => {
        this.loadServicios();
      });
    };
    this.showConfirmModal = true;
  }
}
