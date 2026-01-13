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
    UsuarioFormComponent
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
      alert(this.editingHistory ? 'Registro editado' : 'Registro creado');
      this.showForm = false;
      this.loadHistory();
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
    const request = this.editingUser
      ? this.usuarioService.editar(this.editingUser.id, dto)
      : this.usuarioService.crear(dto);

    request.subscribe(() => {
      alert(this.editingUser ? 'Usuario editado' : 'Usuario creado');
      this.showUserForm = false;
      this.loadUsers();
    });
  }

  deleteUser(id: string): void {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      this.usuarioService.eliminar(id).subscribe(() => {
        alert('Usuario eliminado lógicamente');
        this.loadUsers();
      });
    }
  }

  deleteHistory(id: number): void {
    if (confirm('¿Estás seguro de eliminar este registro (borrado lógico)?')) {
      this.historialService.eliminar(id).subscribe(() => {
        alert('Registro eliminado lógicamente');
        this.loadHistory();
      });
    }
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
