/**
 * Modelo de Insumos para Predicción de Churn
 * 
 * Esta interfaz representa los datos de entrada que la IA analiza para predecir el churn.
 * Los datos se extraen automáticamente de la vista SQL `vw_modelo_insumos` que combina
 * información de las tablas de usuarios, servicios y planes.
 * 
 * Según la documentación del backend:
 * - Los datos se mapean desde ModeloInsumoView (clase Java)
 * - La vista SQL combina datos de usuarios, servicios y planes
 * - Estos son los "ingredientes" que la IA necesita para hacer la predicción
 */
export interface ModeloInsumos {
  // Identificación
  /** ID único del usuario/cliente */
  idCliente: string;
  
  // Demográficos
  /** Género: "Male" o "Female" */
  gender: string;
  /** Es adulto mayor: "Yes" o "No" */
  seniorCitizen: string;
  /** Tiene cónyuge: "Yes" o "No" */
  partner: string;
  /** Tiene personas a cargo: "Yes" o "No" */
  dependents: string;
  
  // Fidelidad
  /** Meses de antigüedad en la empresa (campo vital para la predicción) */
  tenure: number;
  
  // Servicios
  /** Tiene servicio telefónico: "Yes" o "No" */
  phoneService: string;
  /** Tiene líneas múltiples: "Yes" o "No" */
  multipleLines: string;
  /** Tipo de servicio de internet: "Fiber optic", "DSL" o "No" */
  internetService: string;
  /** Tiene seguridad en línea: "Yes" o "No" */
  onlineSecurity: string;
  /** Tiene respaldo en línea: "Yes" o "No" */
  onlineBackup: string;
  /** Tiene protección de dispositivo: "Yes" o "No" */
  deviceProtection: string;
  /** Tiene soporte técnico: "Yes" o "No" */
  techSupport: string;
  /** Tiene streaming de TV: "Yes" o "No" */
  streamingTV: string;
  /** Tiene streaming de películas: "Yes" o "No" */
  streamingMovies: string;
  
  // Contrato
  /** Tipo de contrato: "Month-to-month", "One year", "Two year", etc. */
  contract: string;
  /** Facturación sin papel: "Yes" o "No" */
  paperlessBilling: string;
  /** Método de pago: "Electronic check", "Mailed check", "Bank transfer (automatic)", "Credit card (automatic)" */
  paymentMethod: string;
  
  // Cargos
  /** Cargo mensual actual */
  monthlyCharges: number;
  /** Total acumulado histórico */
  totalCharges: number;
}

export interface ModeloInsumosResponse {
  time: string;
  message: string;
  success: boolean;
  data: ModeloInsumos;
}
