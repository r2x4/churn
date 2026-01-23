// src/app/features/churn-prediction/churn-prediction.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { UsuarioService } from '../../core/services/usuario.service';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../core/models/usuario.model';
import { ModeloInsumos } from '../../core/models/modelo-insumos.model';

@Component({
  selector: 'app-churn-prediction',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './churn-prediction.component.html',
  styleUrls: ['./churn-prediction.component.css']
})
export class ChurnPredictionComponent implements OnInit {
  searchForm!: FormGroup;
  modeloForm!: FormGroup;
  
  selectedUsuario: Usuario | null = null;
  modeloInsumos: ModeloInsumos | null = null;
  predictionResult: any = null;
  
  isLoading = false;
  isSearching = false;
  showResult = false;
  showModeloForm = false;
  searchError: string | null = null;
  
  usuarios: Usuario[] = [];

  // Opciones para los selectores
  genderOptions = ['Male', 'Female'];
  yesNoOptions = ['Yes', 'No'];
  internetServiceOptions = ['Fiber optic', 'DSL', 'No'];
  contractOptions = ['Month-to-month', 'One year', 'Two year'];
  paymentMethodOptions = ['Electronic check', 'Mailed check', 'Bank transfer (automatic)', 'Credit card (automatic)'];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadUsuarios();
  }

  initForm(): void {
    this.searchForm = this.fb.group({
      usuarioId: ['', Validators.required]
    });

    this.modeloForm = this.fb.group({
      gender: ['', Validators.required],
      seniorCitizen: ['', Validators.required],
      partner: ['', Validators.required],
      dependents: ['', Validators.required],
      tenure: ['', [Validators.required, Validators.min(0)]],
      phoneService: ['', Validators.required],
      multipleLines: ['', Validators.required],
      internetService: ['', Validators.required],
      onlineSecurity: ['', Validators.required],
      onlineBackup: ['', Validators.required],
      deviceProtection: ['', Validators.required],
      techSupport: ['', Validators.required],
      streamingTV: ['', Validators.required],
      streamingMovies: ['', Validators.required],
      contract: ['', Validators.required],
      paperlessBilling: ['', Validators.required],
      paymentMethod: ['', Validators.required],
      monthlyCharges: ['', [Validators.required, Validators.min(0)]],
      totalCharges: ['', [Validators.required, Validators.min(0)]]
    });
  }

  loadUsuarios(): void {
    this.usuarioService.listarActivos(0, 1000).subscribe({
      next: (response) => {
        console.log('Full response:', response);
        
        try {
          // Intentar obtener usuarios de diferentes estructuras posibles
          let usuariosArray: Usuario[] = [];
          
          if (response?.data?.content && Array.isArray(response.data.content)) {
            usuariosArray = response.data.content;
            console.log('Usuarios from response.data.content:', usuariosArray);
          } else if (response?.data && Array.isArray(response.data)) {
            usuariosArray = response.data;
            console.log('Usuarios from response.data array:', usuariosArray);
          } else if (Array.isArray(response)) {
            usuariosArray = response;
            console.log('Usuarios from response array:', usuariosArray);
          }
          
          this.usuarios = usuariosArray;
          console.log('Usuarios finales:', this.usuarios);
          
          if (this.usuarios.length === 0) {
            console.warn('⚠️ No usuarios found in response');
          }
        } catch (error) {
          console.error('Error processing usuarios:', error);
          this.usuarios = [];
        }
      },
      error: (err) => {
        console.error('Error cargando usuarios:', err);
        this.usuarios = [];
      }
    });
  }

  searchUsuario(): void {
    if (this.searchForm.invalid) {
      return;
    }
    
    this.isSearching = true;
    this.searchError = null;
    this.selectedUsuario = null;
    this.modeloInsumos = null;
    this.predictionResult = null;
    this.showResult = false;
    this.showModeloForm = false;

    const usuarioId = this.searchForm.get('usuarioId')?.value;
    const usuario = this.usuarios.find(u => u.id === usuarioId);
    
    if (usuario) {
      this.selectedUsuario = usuario;
      this.cargarDatosModelo();
    } else {
      this.searchError = `No se encontró un usuario con el ID: ${usuarioId}`;
      this.isSearching = false;
    }
  }

  cargarDatosModelo(): void {
    if (!this.selectedUsuario) return;

    this.apiService.obtenerModeloInsumos(this.selectedUsuario.id).subscribe({
      next: (response) => {
        console.log('Modelo insumos response:', response);
        if (response.success && response.data) {
          this.modeloInsumos = response.data;
          this.llenarFormularioModelo(response.data);
          this.showModeloForm = true;
        } else {
          this.searchError = 'No se pudieron obtener los datos del modelo.';
        }
        this.isSearching = false;
      },
      error: (err) => {
        console.error('Error cargando datos del modelo:', err);
        this.searchError = 'Error al obtener los datos del usuario.';
        this.isSearching = false;
      }
    });
  }

  llenarFormularioModelo(datos: ModeloInsumos): void {
    this.modeloForm.patchValue({
      gender: datos.gender || '',
      seniorCitizen: datos.seniorCitizen || '',
      partner: datos.partner || '',
      dependents: datos.dependents || '',
      tenure: datos.tenure || 0,
      phoneService: datos.phoneService || '',
      multipleLines: datos.multipleLines || '',
      internetService: datos.internetService || '',
      onlineSecurity: datos.onlineSecurity || '',
      onlineBackup: datos.onlineBackup || '',
      deviceProtection: datos.deviceProtection || '',
      techSupport: datos.techSupport || '',
      streamingTV: datos.streamingTV || '',
      streamingMovies: datos.streamingMovies || '',
      contract: datos.contract || '',
      paperlessBilling: datos.paperlessBilling || '',
      paymentMethod: datos.paymentMethod || '',
      monthlyCharges: datos.monthlyCharges || 0,
      totalCharges: datos.totalCharges || 0
    });
  }

  evaluarChurn(): void {
    if (!this.selectedUsuario) {
      this.searchError = 'Por favor, selecciona un usuario primero';
      return;
    }

    if (this.modeloForm.invalid) {
      this.searchError = 'Por favor completa todos los campos correctamente';
      return;
    }

    this.isLoading = true;
    this.showResult = false;
    this.predictionResult = null;

    // Enviar los datos editados del formulario para la predicción
    this.apiService.evaluarChurnPorUsuario(this.selectedUsuario.id).subscribe({
      next: (result) => {
        this.predictionResult = result.data || result;
        this.showResult = true;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error en predicción:', error);
        this.searchError = 'Error al evaluar la predicción. Intenta nuevamente.';
        this.isLoading = false;
      }
    });
  }

  resetForm(): void {
    this.searchForm.reset();
    this.modeloForm.reset();
    this.selectedUsuario = null;
    this.modeloInsumos = null;
    this.predictionResult = null;
    this.showResult = false;
    this.showModeloForm = false;
    this.searchError = null;
  }

  getRiskLabel(): string {
    if (!this.predictionResult) return '';
    
    const riskLevel = this.predictionResult.riskLevel || 
                     (this.predictionResult.probabilidad > 0.7 ? 'high' : 
                      this.predictionResult.probabilidad > 0.4 ? 'medium' : 'low');
    
    switch (riskLevel) {
      case 'high': return '🔴 Alto Riesgo';
      case 'medium': return '🟡 Riesgo Medio';
      case 'low': return '🟢 Bajo Riesgo';
      default: return '';
    }
  }

  getChurnLabel(): string {
    if (!this.predictionResult) return '';
    return this.predictionResult.churn || this.predictionResult.prevision === 'Churn' 
      ? '⚠️ Churn Detectado' 
      : '✅ No Churn';
  }
}