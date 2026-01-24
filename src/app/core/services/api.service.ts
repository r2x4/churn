// src/app/core/services/api.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  Customer,
  ChurnPredictionRequest,
  ChurnPredictionResponse,
  CompanyStatistics,
  ChurnByCategory,
  RevenueStats
} from '../models/customer.model';

type LoginRequest = {
  email: string;
  password: string;
};

type LoginApiResponse = {
  username: string;
  message: string;
  jwt: string;
  status: boolean;
};

type ApiResponse<T> = {
  time: string;
  message: string;
  success: boolean;
  data: T;
};

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  // ============= PREDICCIÓN DE CHURN =============

  predictChurn(data: ChurnPredictionRequest): Observable<ChurnPredictionResponse> {
    return this.http.post<ChurnPredictionResponse>(
      `${this.apiUrl}/predict-churn`,
      data,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        console.error('Error en predicción:', error);
        // Datos mock para desarrollo
        return of(this.getMockChurnPrediction(data));
      })
    );
  }

  // Evaluar churn para un usuario específico
  evaluarChurnPorUsuario(usuarioId: string): Observable<any> {
    const url = `${this.apiUrl}/predicciones/evaluar/${usuarioId}`;
    const body = {}; // El backend obtiene los datos desde la vista SQL usando el idUsuario
    const headers = this.getHeaders();

    console.log('═══════════════════════════════════════════════════════════');
    console.log('📡 LLAMADA AL ENDPOINT: evaluarChurnPorUsuario');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('🌐 URL:', url);
    console.log('📋 Método: POST');
    console.log('📦 Body:', JSON.stringify(body, null, 2));
    console.log('📨 Headers:', JSON.stringify(headers.keys().reduce((acc, key) => {
      acc[key] = headers.get(key);
      return acc;
    }, {} as any), null, 2));
    console.log('🆔 ID Usuario:', usuarioId);
    console.log('ℹ️ Nota: El backend obtendrá los datos desde la vista SQL vw_insumos_modelo usando este ID');
    console.log('═══════════════════════════════════════════════════════════');

    return this.http.post<any>(url, body, { headers }).pipe(
      map((response) => {
        console.log('✅ RESPUESTA DEL BACKEND (evaluarChurnPorUsuario):');
        console.log('═══════════════════════════════════════════════════════════');
        console.log(JSON.stringify(response, null, 2));
        console.log('═══════════════════════════════════════════════════════════');
        return response;
      }),
      catchError(error => {
        console.error('❌ ERROR EN evaluarChurnPorUsuario:');
        console.error('═══════════════════════════════════════════════════════════');
        console.error('URL:', url);
        console.error('Error completo:', error);
        if (error.error) {
          console.error('Error body:', JSON.stringify(error.error, null, 2));
        }
        console.error('═══════════════════════════════════════════════════════════');
        return throwError(() => new Error('Error al evaluar predicción de churn'));
      })
    );
  }

  /**
   * Predice churn usando datos personalizados del modelo (datos editados por el usuario).
   * Transforma los datos del formulario al formato que espera el servicio de IA.
   */
  predecirChurnConDatos(datosPersonalizados: any): Observable<any> {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('📡 LLAMADA AL ENDPOINT: predecirChurnConDatos');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('📤 Datos a enviar:', JSON.stringify(datosPersonalizados, null, 2));
    console.log(`🌐 URL: ${this.apiUrl}/predicciones/evaluar-con-datos`);
    console.log('═══════════════════════════════════════════════════════════');

    return this.http.post<any>(
      `${this.apiUrl}/predicciones/evaluar-con-datos`,
      datosPersonalizados,
      { headers: this.getHeaders() }
    ).pipe(
      map(response => {
        console.log('✅ RESPUESTA DEL BACKEND (predecirChurnConDatos):', JSON.stringify(response, null, 2));
        return response;
      }),
      catchError(error => {
        console.error('❌ Error en predicción con datos personalizados (endpoint backend):', error);

        // No intentamos con el servicio externo directamente para evitar CORS.
        // El backend debería manejar la comunicación con servicios externos.
        let errorMessage = 'Error al obtener predicción con datos personalizados';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }

        return throwError(() => new Error(errorMessage));
      })
    );
  }

  // Obtener lista de predicciones
  obtenerPredicciones(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/predicciones`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        console.error('Error obteniendo predicciones:', error);
        return of([]);
      })
    );
  }

  // Obtener estadísticas de predicciones
  obtenerEstadisticasPredicciones(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/predicciones/estadisticas/conteo`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        console.error('Error obteniendo estadísticas:', error);
        return of({ totalEvaluados: 0, totalChurn: 0 });
      })
    );
  }

  // Obtener datos del modelo para predicción
  obtenerModeloInsumos(idUsuario: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/modelo-insumos/${idUsuario}`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        console.error('Error obteniendo datos del modelo:', error);
        return of({ success: false, data: null });
      })
    );
  }

  getCustomerForPrediction(customerId: string): Observable<Customer> {
    return this.http.get<Customer>(
      `${this.apiUrl}/customers/${customerId}`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        console.error('Error obteniendo cliente:', error);
        return of(this.getMockCustomer(customerId));
      })
    );
  }

  // ============= ESTADÍSTICAS DE LA EMPRESA =============

  getCompanyStatistics(): Observable<CompanyStatistics> {
    return this.http.get<CompanyStatistics>(
      `${this.apiUrl}/statistics/company`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        console.error('Error obteniendo estadísticas:', error);
        return of(this.getMockCompanyStats());
      })
    );
  }

  getChurnByCategory(category: string): Observable<ChurnByCategory[]> {
    return this.http.get<ChurnByCategory[]>(
      `${this.apiUrl}/statistics/churn-by/${category}`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        console.error('Error obteniendo churn por categoría:', error);
        return of(this.getMockChurnByCategory(category));
      })
    );
  }

  getRevenueStats(period: string = 'monthly'): Observable<RevenueStats[]> {
    return this.http.get<RevenueStats[]>(
      `${this.apiUrl}/statistics/revenue?period=${period}`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        console.error('Error obteniendo ingresos:', error);
        return of(this.getMockRevenueStats());
      })
    );
  }

  // ============= AUTENTICACIÓN =============

  login(credentials: LoginRequest): Observable<{ token: string }> {
    return this.http
      .post<LoginApiResponse>(`${environment.authBaseUrl}/login`, credentials, { headers: this.getHeaders() })
      .pipe(
        map((response) => {
          if (!response?.status || !response.jwt) {
            throw new Error(response?.message || 'Login inválido');
          }
          return { token: response.jwt };
        }),
        catchError((err: unknown) => {
          if (err instanceof HttpErrorResponse) {
            const backendMessage = (err.error as any)?.message;
            const message = backendMessage || err.message || 'Error de autenticación';
            return throwError(() => new Error(message));
          }

          const message = err instanceof Error ? err.message : 'Error de autenticación';
          return throwError(() => new Error(message));
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getAllCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(
      `${this.apiUrl}/customers`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        console.error('Error obteniendo clientes:', error);
        return of(this.getMockCustomers());
      })
    );
  }

  // ============= DATOS MOCK PARA DESARROLLO =============

  private getMockChurnPrediction(data: ChurnPredictionRequest): ChurnPredictionResponse {
    const probability = Math.random();
    return {
      customerID: data.customerID || 'MOCK-' + Date.now(),
      churnProbability: probability,
      willChurn: probability > 0.5,
      riskLevel: probability > 0.7 ? 'high' : probability > 0.4 ? 'medium' : 'low',
      recommendations: [
        'Ofrecer descuento en el próximo mes',
        'Contactar al cliente para resolver problemas',
        'Proponer upgrade de plan con beneficios'
      ]
    };
  }

  private getMockCustomer(id: string): Customer {
    return {
      customerID: id,
      gender: 'Male',
      SeniorCitizen: 0,
      Partner: 'Yes',
      Dependents: 'No',
      tenure: 12,
      PhoneService: 'Yes',
      MultipleLines: 'No',
      InternetService: 'Fiber optic',
      OnlineSecurity: 'No',
      OnlineBackup: 'Yes',
      DeviceProtection: 'No',
      TechSupport: 'No',
      StreamingTV: 'Yes',
      StreamingMovies: 'Yes',
      Contract: 'Month-to-month',
      PaperlessBilling: 'Yes',
      PaymentMethod: 'Electronic check',
      MonthlyCharges: 85.5,
      TotalCharges: 1026.0,
      Churn: 'No'
    };
  }

  private getMockCompanyStats(): CompanyStatistics {
    return {
      totalCustomers: 7043,
      activeCustomers: 5174,
      churnedCustomers: 1869,
      churnRate: 26.5,
      averageRevenue: 64.76,
      totalRevenue: 456187.50,
      averageTenure: 32.4,
      newCustomersThisMonth: 245
    };
  }

  private getMockChurnByCategory(category: string): ChurnByCategory[] {
    if (category === 'contract') {
      return [
        { category: 'Contract', value: 'Month-to-month', churnCount: 1655, totalCount: 3875, churnRate: 42.7 },
        { category: 'Contract', value: 'One year', churnCount: 166, totalCount: 1473, churnRate: 11.3 },
        { category: 'Contract', value: 'Two year', churnCount: 48, totalCount: 1695, churnRate: 2.8 }
      ];
    }
    if (category === 'InternetService') {
      return [
        { category: 'InternetService', value: 'Fiber optic', churnCount: 1297, totalCount: 3096, churnRate: 41.9 },
        { category: 'InternetService', value: 'DSL', churnCount: 459, totalCount: 2421, churnRate: 19.0 },
        { category: 'InternetService', value: 'No Internet', churnCount: 113, totalCount: 1526, churnRate: 7.4 }
      ];
    }
    if (category === 'gender') {
      return [
        { category: 'Gender', value: 'Masculino', churnCount: 930, totalCount: 3555, churnRate: 26.16 },
        { category: 'Gender', value: 'Femenino', churnCount: 939, totalCount: 3488, churnRate: 26.92 }
      ];
    }
    return [];
  }

  private getMockRevenueStats(): RevenueStats[] {
    return [
      { period: 'Enero', revenue: 38500, customers: 580, averagePerCustomer: 66.38 },
      { period: 'Febrero', revenue: 41200, customers: 620, averagePerCustomer: 66.45 },
      { period: 'Marzo', revenue: 39800, customers: 595, averagePerCustomer: 66.89 },
      { period: 'Abril', revenue: 42100, customers: 640, averagePerCustomer: 65.78 },
      { period: 'Mayo', revenue: 43500, customers: 665, averagePerCustomer: 65.41 },
      { period: 'Junio', revenue: 44800, customers: 685, averagePerCustomer: 65.40 }
    ];
  }

  private getMockCustomers(): Customer[] {
    return [
      {
        customerID: '7590-VHVEG',
        gender: 'Female',
        SeniorCitizen: 0,
        Partner: 'Yes',
        Dependents: 'No',
        tenure: 1,
        PhoneService: 'No',
        MultipleLines: 'No phone service',
        InternetService: 'DSL',
        OnlineSecurity: 'No',
        OnlineBackup: 'Yes',
        DeviceProtection: 'No',
        TechSupport: 'No',
        StreamingTV: 'No',
        StreamingMovies: 'No',
        Contract: 'Month-to-month',
        PaperlessBilling: 'Yes',
        PaymentMethod: 'Electronic check',
        MonthlyCharges: 29.85,
        TotalCharges: 29.85,
        Churn: 'No'
      },
      {
        customerID: '5575-GNVDE',
        gender: 'Male',
        SeniorCitizen: 0,
        Partner: 'No',
        Dependents: 'No',
        tenure: 34,
        PhoneService: 'Yes',
        MultipleLines: 'No',
        InternetService: 'DSL',
        OnlineSecurity: 'Yes',
        OnlineBackup: 'No',
        DeviceProtection: 'Yes',
        TechSupport: 'No',
        StreamingTV: 'No',
        StreamingMovies: 'No',
        Contract: 'One year',
        PaperlessBilling: 'No',
        PaymentMethod: 'Mailed check',
        MonthlyCharges: 56.95,
        TotalCharges: 1889.5,
        Churn: 'No'
      }
    ];
  }
}
