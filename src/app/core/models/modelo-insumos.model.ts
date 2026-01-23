export interface ModeloInsumos {
  gender: string;
  seniorCitizen: string;
  partner: string;
  dependents: string;
  tenure: number;
  phoneService: string;
  multipleLines: string;
  internetService: string;
  onlineSecurity: string;
  onlineBackup: string;
  deviceProtection: string;
  techSupport: string;
  streamingTV: string;
  streamingMovies: string;
  contract: string;
  paperlessBilling: string;
  paymentMethod: string;
  monthlyCharges: number;
  totalCharges: number;
}

export interface ModeloInsumosResponse {
  time: string;
  message: string;
  success: boolean;
  data: ModeloInsumos;
}
