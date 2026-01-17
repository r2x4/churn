import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PredictionService } from '../../core/services/prediction.service';
import { CustomerInput, PredictionOutput } from '../../core/models/customer-prediction.model';
import { HistorialService } from '../../core/services/historial.service';
import { HistorialPrediccion, HistorialPrediccionDto } from '../../core/models/historial.model';
import { HistorialTableComponent } from './components/historial-table.component';
import { HistorialDetailModalComponent } from './components/historial-detail-modal.component';
import { HistorialFormComponent } from './components/historial-form.component';
import { UsuarioService } from '../../core/services/usuario.service';
import { Usuario, UsuarioDto } from '../../core/models/usuario.model';
import { UsuarioTableComponent } from './components/users/usuario-table.component';
import { UsuarioDetailModalComponent } from './components/users/usuario-detail-modal.component';
import { UsuarioFormComponent } from './components/users/usuario-form.component';
import { ConfirmModalComponent } from './components/confirm-modal.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    HistorialTableComponent,
    HistorialDetailModalComponent,
    HistorialFormComponent,
    UsuarioTableComponent,
    UsuarioDetailModalComponent,
    UsuarioFormComponent,
    ConfirmModalComponent
  ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  selectedTab: string = 'predictions'; // Default selected tab
  predictionResult: PredictionOutput | null = null;
  predictionError: string | null = null;

  // Datos de historial
  historyList: HistorialPrediccion[] = [];
  isLoadingHistory: boolean = false;
  viewingDeleted: boolean = false;

  // Variables para componentes Historial
  selectedHistory: HistorialPrediccion | null = null;
  editingHistory: HistorialPrediccion | null = null;
  showForm: boolean = false;
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

  // Sample customer data for demonstration
  sampleCustomerInput: CustomerInput = {
    id_cliente: "7590-VHVEG",
    genero: "Male",
    adulto_mayor: 0,
    tiene_pareja: "Yes",
    tiene_dependientes: "No",
    antiguedad_meses: 12,
    servicio_telefono: "Yes",
    lineas_multiples: "No",
    servicio_internet: "Fiber optic",
    seguridad_en_linea: "No",
    respaldo_en_linea: "Yes",
    proteccion_dispositivo: "No",
    soporte_tecnico: "No",
    streaming_tv: "Yes",
    streaming_peliculas: "Yes",
    tipo_contrato: "Month-to-month",
    facturacion_electronica: "Yes",
    metodo_pago: "Electronic check",
    cargo_mensual: 85.5,
    cargos_totales: 1026.0
  };

  constructor(
    private predictionService: PredictionService,
    private historialService: HistorialService,
    private usuarioService: UsuarioService
  ) { }

  selectTab(tab: string): void {
    this.selectedTab = tab;
    if (tab === 'history') {
      this.loadHistory();
    } else if (tab === 'users') {
      this.loadUsers();
    }
  }

  loadHistory(): void {
    this.isLoadingHistory = true;
    const request = this.viewingDeleted
      ? this.historialService.listarEliminados(0, 50)
      : this.historialService.listarActivos(0, 50);

    request.subscribe({
      next: (response) => {
        if (response.data && (response.data as any).content) {
          this.historyList = (response.data as any).content;
        } else if (Array.isArray(response.data)) {
          this.historyList = response.data;
        } else {
          this.historyList = [];
        }
        this.isLoadingHistory = false;
      },
      error: (error) => {
        console.error('Error al cargar historial:', error);
        this.isLoadingHistory = false;
        this.historyList = [];
      }
    });
  }

  toggleDeleted(): void {
    this.viewingDeleted = !this.viewingDeleted;
    this.loadHistory();
  }

  viewHistoryDetail(id: number): void {
    this.historialService.buscarPorId(id).subscribe(res => {
      this.selectedHistory = res.data;
      this.showDetail = true;
    });
  }

  closeDetail(): void {
    this.showDetail = false;
    this.selectedHistory = null;
  }

  openCreateForm(): void {
    this.editingHistory = null;
    this.showForm = true;
  }

  openEditForm(item: HistorialPrediccion): void {
    this.editingHistory = item;
    this.showForm = true;
  }

  saveHistory(dto: HistorialPrediccionDto): void {
    const request = this.editingHistory
      ? this.historialService.editar(this.editingHistory.id, dto)
      : this.historialService.crear(dto);

    request.subscribe(() => {
      this.confirmModalTitle = this.editingHistory ? 'Éxito' : 'Éxito';
      this.confirmModalMessage = this.editingHistory ? 'Registro editado correctamente' : 'Registro creado correctamente';
      this.confirmModalType = 'success';
      this.confirmModalButtonText = 'Aceptar';
      this.pendingAction = () => {
        this.showUserForm = false;
        this.showForm = false;
        this.loadHistory();
      };
      this.showConfirmModal = true;
    });
  }

  // ================= USERS LOGIC =================

  loadUsers(): void {
    this.isLoadingUsers = true;
    const request = this.viewingDeletedUsers
      ? this.usuarioService.listarEliminados(0, 50)
      : this.usuarioService.listarActivos(0, 50);

    request.subscribe({
      next: (response) => {
        // Manejar tanto si el backend devuelve un objeto Page (con .content) 
        // como si devuelve el array directo en .data
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

    request.subscribe(() => {
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

  // Método simplificado para probar el POST/PUT
  testSaveSample(): void {
    const sampleDto = {
      customerID: 'TEST-' + Math.floor(Math.random() * 1000),
      probabilidad: 0.95,
      resultado: 'Churn',
      riskLevel: 'high',
      recommendations: ['Llamar cliente pronto']
    };

    this.historialService.crear(sampleDto).subscribe(res => {
      alert('Historial creado con éxito: ' + res.data.id);
      this.loadHistory();
    });
  }

  testEdit(item: HistorialPrediccion): void {
    const nuevoResultado = item.resultado === 'Churn' ? 'No Churn' : 'Churn';
    const dto: HistorialPrediccionDto = {
      ...item,
      resultado: nuevoResultado
    };

    this.historialService.editar(item.id, dto).subscribe(res => {
      alert(`Registro ${item.id} editado. Resultado cambiado a: ${nuevoResultado}`);
      this.loadHistory();
    });
  }

  makePrediction(): void {
    this.predictionResult = null;
    this.predictionError = null;

    this.predictionService.getPrediction(this.sampleCustomerInput).subscribe({
      next: (data) => {
        this.predictionResult = data;
        console.log('Prediction successful:', data);
      },
      error: (error) => {
        this.predictionError = 'Error al obtener la predicción: ' + error.message;
        console.error('Error fetching prediction:', error);
      }
    });
  }
}
