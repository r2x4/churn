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
        console.log('Modelo insumos response completa:', response);
        if (response.success && response.data) {
          const datosModelo = response.data;
          console.log('Datos del modelo:', datosModelo);
          console.log('Campo gender:', datosModelo.gender);
          console.log('Campo genero (alternativo):', datosModelo.genero);
          
          // Si no viene gender pero viene genero, mapearlo
          if (!datosModelo.gender && datosModelo.genero) {
            datosModelo.gender = datosModelo.genero;
          }
          
          // Si aún no hay gender, intentar obtenerlo del usuario seleccionado
          if (!datosModelo.gender && this.selectedUsuario?.genero) {
            datosModelo.gender = this.selectedUsuario.genero;
          }
          
          this.modeloInsumos = datosModelo;
          this.llenarFormularioModelo(datosModelo);
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

  /**
   * Transforma el género del formato del backend al formato del formulario
   */
  private transformarGenero(genero: string | null | undefined): string {
    if (!genero) return '';
    
    const generoLower = genero.toLowerCase().trim();
    
    // Mapear de español a inglés
    if (generoLower === 'masculino' || generoLower === 'male' || generoLower === 'm') {
      return 'Male';
    }
    if (generoLower === 'femenino' || generoLower === 'female' || generoLower === 'f') {
      return 'Female';
    }
    
    // Si ya está en el formato correcto, devolverlo
    if (generoLower === 'male' || generoLower === 'female') {
      return genero.charAt(0).toUpperCase() + genero.slice(1).toLowerCase();
    }
    
    return '';
  }

  llenarFormularioModelo(datos: ModeloInsumos): void {
    console.log('Datos recibidos del modelo:', datos);
    console.log('Género recibido:', datos.gender);
    
    this.modeloForm.patchValue({
      gender: this.transformarGenero(datos.gender) || '',
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
    
    console.log('Valor de gender en el formulario después de patchValue:', this.modeloForm.get('gender')?.value);
  }

  evaluarChurn(): void {
    if (!this.selectedUsuario) {
      this.searchError = 'Por favor, selecciona un usuario primero';
      return;
    }

    if (this.modeloForm.invalid) {
      this.searchError = 'Por favor completa todos los campos correctamente';
      console.warn('⚠️ Formulario inválido. Errores:', this.getFormErrors());
      return;
    }

    this.isLoading = true;
    this.showResult = false;
    this.predictionResult = null;
    this.searchError = null;

    // Obtener los datos editados del formulario
    const datosEditados = this.modeloForm.getRawValue();
    console.log('═══════════════════════════════════════════════════════════');
    console.log('📋 DATOS DEL FORMULARIO (antes de transformar):');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(JSON.stringify(datosEditados, null, 2));
    console.log('═══════════════════════════════════════════════════════════');

    // Transformar los datos del formulario al formato que espera el backend
    const modeloInsumosData: ModeloInsumos = {
      idCliente: this.modeloInsumos?.idCliente || this.selectedUsuario.id,
      gender: datosEditados.gender,
      seniorCitizen: datosEditados.seniorCitizen,
      partner: datosEditados.partner,
      dependents: datosEditados.dependents,
      tenure: datosEditados.tenure,
      phoneService: datosEditados.phoneService,
      multipleLines: datosEditados.multipleLines,
      internetService: datosEditados.internetService,
      onlineSecurity: datosEditados.onlineSecurity,
      onlineBackup: datosEditados.onlineBackup,
      deviceProtection: datosEditados.deviceProtection,
      techSupport: datosEditados.techSupport,
      streamingTV: datosEditados.streamingTV,
      streamingMovies: datosEditados.streamingMovies,
      contract: datosEditados.contract,
      paperlessBilling: datosEditados.paperlessBilling,
      paymentMethod: datosEditados.paymentMethod,
      monthlyCharges: datosEditados.monthlyCharges,
      totalCharges: datosEditados.totalCharges
    };

    console.log('📦 DATOS TRANSFORMADOS (ModeloInsumos):');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(JSON.stringify(modeloInsumosData, null, 2));
    console.log('═══════════════════════════════════════════════════════════');

    // Verificar si los datos fueron editados comparando con los originales
    const datosOriginales = this.modeloInsumos;
    const datosFueronEditados = datosOriginales && (
      datosOriginales.gender !== datosEditados.gender ||
      datosOriginales.seniorCitizen !== datosEditados.seniorCitizen ||
      datosOriginales.partner !== datosEditados.partner ||
      datosOriginales.dependents !== datosEditados.dependents ||
      datosOriginales.tenure !== Number(datosEditados.tenure) ||
      datosOriginales.phoneService !== datosEditados.phoneService ||
      datosOriginales.multipleLines !== datosEditados.multipleLines ||
      datosOriginales.internetService !== datosEditados.internetService ||
      datosOriginales.onlineSecurity !== datosEditados.onlineSecurity ||
      datosOriginales.onlineBackup !== datosEditados.onlineBackup ||
      datosOriginales.deviceProtection !== datosEditados.deviceProtection ||
      datosOriginales.techSupport !== datosEditados.techSupport ||
      datosOriginales.streamingTV !== datosEditados.streamingTV ||
      datosOriginales.streamingMovies !== datosEditados.streamingMovies ||
      datosOriginales.contract !== datosEditados.contract ||
      datosOriginales.paperlessBilling !== datosEditados.paperlessBilling ||
      datosOriginales.paymentMethod !== datosEditados.paymentMethod ||
      datosOriginales.monthlyCharges !== Number(datosEditados.monthlyCharges) ||
      datosOriginales.totalCharges !== Number(datosEditados.totalCharges)
    );

    console.log('📝 ¿Datos fueron editados?', datosFueronEditados);
    if (datosFueronEditados) {
      console.log('⚠️ ADVERTENCIA: Los datos fueron editados, pero el endpoint para datos personalizados no está disponible.');
      console.log('ℹ️ Se usarán los datos originales de la base de datos para la predicción.');
    }

    // Usar el endpoint estándar que funciona (según la documentación: POST /api/predicciones/evaluar/{idUsuario})
    // Este endpoint obtiene los datos automáticamente desde la vista SQL
    console.log('🚀 Enviando solicitud de predicción al endpoint estándar...');
    console.log(`📤 ID Usuario: ${this.selectedUsuario.id}`);
    console.log('ℹ️ El backend obtendrá los datos desde la vista SQL vw_insumos_modelo');
    
    this.apiService.evaluarChurnPorUsuario(this.selectedUsuario.id).subscribe({
      next: (result) => {
        console.log('✅ RESPUESTA DEL BACKEND:');
        console.log('═══════════════════════════════════════════════════════════');
        console.log(JSON.stringify(result, null, 2));
        console.log('═══════════════════════════════════════════════════════════');
        
        this.predictionResult = result.data || result;
        this.showResult = true;
        this.isLoading = false;
        
        if (datosFueronEditados) {
          this.searchError = '⚠️ Nota: Se usaron los datos originales de la BD para la predicción. Los cambios editados no se aplicaron porque el endpoint para datos personalizados no está disponible en el backend.';
        }
      },
      error: (err) => {
        console.error('❌ Error en predicción:', err);
        console.error('Detalles del error:', JSON.stringify(err, null, 2));
        this.searchError = `Error al evaluar la predicción: ${err.message || 'Error desconocido'}. Intenta nuevamente.`;
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

  /**
   * Obtiene los errores del formulario para debugging
   */
  private getFormErrors(): any {
    const errors: any = {};
    Object.keys(this.modeloForm.controls).forEach(key => {
      const control = this.modeloForm.get(key);
      if (control && control.errors) {
        errors[key] = control.errors;
      }
    });
    return errors;
  }
}