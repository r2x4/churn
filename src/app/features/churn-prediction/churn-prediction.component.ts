// src/app/features/churn-prediction/churn-prediction.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { UsuarioService } from '../../core/services/usuario.service';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../core/models/usuario.model';
import { ModeloInsumos, PrediccionDatosPersonalizados } from '../../core/models/modelo-insumos.model';
import { DataTransformUtils } from '../../core/utils/data-transform.utils';

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
      gender: ['', [Validators.required, this.validarGenero.bind(this)]],
      seniorCitizen: ['', [Validators.required, this.validarYesNo.bind(this)]],
      partner: ['', [Validators.required, this.validarYesNo.bind(this)]],
      dependents: ['', [Validators.required, this.validarYesNo.bind(this)]],
      tenure: ['', [Validators.required, Validators.min(0), Validators.max(600)]],
      phoneService: ['', [Validators.required, this.validarYesNo.bind(this)]],
      multipleLines: ['', [Validators.required, this.validarYesNo.bind(this)]],
      internetService: ['', [Validators.required, this.validarInternetService.bind(this)]],
      onlineSecurity: ['', [Validators.required, this.validarYesNo.bind(this)]],
      onlineBackup: ['', [Validators.required, this.validarYesNo.bind(this)]],
      deviceProtection: ['', [Validators.required, this.validarYesNo.bind(this)]],
      techSupport: ['', [Validators.required, this.validarYesNo.bind(this)]],
      streamingTV: ['', [Validators.required, this.validarYesNo.bind(this)]],
      streamingMovies: ['', [Validators.required, this.validarYesNo.bind(this)]],
      contract: ['', [Validators.required, this.validarContract.bind(this)]],
      paperlessBilling: ['', [Validators.required, this.validarYesNo.bind(this)]],
      paymentMethod: ['', [Validators.required, this.validarPaymentMethod.bind(this)]],
      monthlyCharges: ['', [Validators.required, Validators.min(0), Validators.max(1000)]],
      totalCharges: ['', [Validators.required, Validators.min(0), Validators.max(10000)]]
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
   * @deprecated Usar DataTransformUtils.transformarGeneroBackendToFrontend()
   */
  private transformarGenero(genero: string | null | undefined): string {
    return DataTransformUtils.transformarGeneroBackendToFrontend(genero);
  }

  llenarFormularioModelo(datos: ModeloInsumos): void {
    console.log('Datos recibidos del modelo:', datos);
    console.log('Género recibido:', datos.gender);
    
this.modeloForm.patchValue({
      gender: DataTransformUtils.transformarGeneroBackendToFrontend(datos.gender),
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
      console.log('✅ Los datos fueron editados. Usando endpoint de datos personalizados...');
      
      // Transformar los datos del formulario al formato que espera el backend
      const datosPersonalizados: PrediccionDatosPersonalizados = {
        id_cliente: this.modeloInsumos?.idCliente || this.selectedUsuario.id,
        genero: DataTransformUtils.transformarGeneroFrontendToBackend(datosEditados.gender),
        adulto_mayor: DataTransformUtils.yesNoToNumber(datosEditados.seniorCitizen),
        tiene_pareja: datosEditados.partner,
        tiene_dependientes: datosEditados.dependents,
        antiguedad_meses: Number(datosEditados.tenure),
        servicio_telefono: datosEditados.phoneService,
        lineas_multiples: datosEditados.multipleLines,
        servicio_internet: datosEditados.internetService,
        seguridad_en_linea: datosEditados.onlineSecurity,
        respaldo_en_linea: datosEditados.onlineBackup,
        proteccion_dispositivo: datosEditados.deviceProtection,
        soporte_tecnico: datosEditados.techSupport,
        streaming_tv: datosEditados.streamingTV,
        streaming_peliculas: datosEditados.streamingMovies,
        tipo_contrato: datosEditados.contract,
        facturacion_electronica: datosEditados.paperlessBilling,
        metodo_pago: datosEditados.paymentMethod,
        cargo_mensual: Number(datosEditados.monthlyCharges),
        cargos_totales: Number(datosEditados.totalCharges)
      };

      console.log('📦 DATOS TRANSFORMADOS (para endpoint personalizado):');
      console.log('═════════════════════════════════════════════════════════');
      console.log(JSON.stringify(datosPersonalizados, null, 2));
      console.log('═════════════════════════════════════════════════════════');
      
      // Usar el nuevo endpoint para datos personalizados
      this.apiService.predecirChurnConDatos(datosPersonalizados).subscribe({
        next: (result) => {
          console.log('✅ RESPUESTA DEL BACKEND (datos personalizados):');
          console.log('═════════════════════════════════════════════════════════');
          console.log(JSON.stringify(result, null, 2));
          console.log('═════════════════════════════════════════════════════════');
          
          this.predictionResult = result.data || result;
          this.showResult = true;
          this.isLoading = false;
          this.searchError = null; // Limpiar cualquier error anterior
        },
        error: (err) => {
          console.error('❌ Error en predicción con datos personalizados:', err);
          console.error('🔄 Intentando con endpoint estándar como fallback...');
          
          // Fallback al endpoint estándar si falla el personalizado
          this.fallbackToStandardEndpoint();
        }
      });
    } else {
      console.log('🚀 No hay cambios. Usando endpoint estándar...');
      console.log(`📤 ID Usuario: ${this.selectedUsuario.id}`);
      console.log('ℹ️ El backend obtendrá los datos desde la vista SQL vw_insumos_modelo usando este ID');
      
      this.fallbackToStandardEndpoint();
    }
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
   * Método fallback al endpoint estándar cuando falla el personalizado
   */
  private fallbackToStandardEndpoint(): void {
    this.apiService.evaluarChurnPorUsuario(this.selectedUsuario!.id).subscribe({
      next: (result) => {
        console.log('✅ RESPUESTA DEL BACKEND (fallback endpoint estándar):');
        console.log('═════════════════════════════════════════════════════════');
        console.log(JSON.stringify(result, null, 2));
        console.log('═════════════════════════════════════════════════════════');
        
        this.predictionResult = result.data || result;
        this.showResult = true;
        this.isLoading = false;
        this.searchError = null;
      },
      error: (err) => {
        console.error('❌ Error en predicción (fallback):', err);
        console.error('Detalles del error:', JSON.stringify(err, null, 2));
        this.searchError = `Error al evaluar la predicción: ${err.message || 'Error desconocido'}. Intenta nuevamente.`;
        this.isLoading = false;
      }
    });
  }

  // ================= VALIDACIONES PERSONALIZADAS =================

  /**
   * Validador personalizado para campo género
   */
  private validarGenero(control: any): { [key: string]: any } | null {
    const value = control.value;
    if (!value) return null;
    
    if (!DataTransformUtils.esGeneroValido(value)) {
      return { generoInvalido: true };
    }
    
    return null;
  }

  /**
   * Validador personalizado para campos Yes/No
   */
  private validarYesNo(control: any): { [key: string]: any } | null {
    const value = control.value;
    if (!value) return null;
    
    if (!DataTransformUtils.esYesNoValido(value)) {
      return { yesNoInvalido: true };
    }
    
    return null;
  }

  /**
   * Validador personalizado para servicio de internet
   */
  private validarInternetService(control: any): { [key: string]: any } | null {
    const value = control.value;
    if (!value) return null;
    
    const opcionesValidas = ['Fiber optic', 'DSL', 'No'];
    if (!opcionesValidas.includes(value)) {
      return { internetServiceInvalido: true };
    }
    
    return null;
  }

  /**
   * Validador personalizado para tipo de contrato
   */
  private validarContract(control: any): { [key: string]: any } | null {
    const value = control.value;
    if (!value) return null;
    
    const opcionesValidas = ['Month-to-month', 'One year', 'Two year'];
    if (!opcionesValidas.includes(value)) {
      return { contractInvalido: true };
    }
    
    return null;
  }

  /**
   * Validador personalizado para método de pago
   */
  private validarPaymentMethod(control: any): { [key: string]: any } | null {
    const value = control.value;
    if (!value) return null;
    
    const opcionesValidas = [
      'Electronic check', 
      'Mailed check', 
      'Bank transfer (automatic)', 
      'Credit card (automatic)'
    ];
    if (!opcionesValidas.includes(value)) {
      return { paymentMethodInvalido: true };
    }
    
    return null;
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