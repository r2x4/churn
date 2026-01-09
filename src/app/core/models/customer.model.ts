// src/app/core/models/customer.model.ts

export interface Customer {
  customerID: string;
  gender: string;
  SeniorCitizen: number;
  Partner: string;
  Dependents: string;
  tenure: number;
  PhoneService: string;
  MultipleLines: string;
  InternetService: string;
  OnlineSecurity: string;
  OnlineBackup: string;
  DeviceProtection: string;
  TechSupport: string;
  StreamingTV: string;
  StreamingMovies: string;
  Contract: string;
  PaperlessBilling: string;
  PaymentMethod: string;
  MonthlyCharges: number;
  TotalCharges: number;
  Churn?: string;
}

export interface ChurnPredictionRequest {
  customerID?: string;
  gender: string;
  SeniorCitizen: number;
  Partner: string;
  Dependents: string;
  tenure: number;
  PhoneService: string;
  MultipleLines: string;
  InternetService: string;
  OnlineSecurity: string;
  OnlineBackup: string;
  DeviceProtection: string;
  TechSupport: string;
  StreamingTV: string;
  StreamingMovies: string;
  Contract: string;
  PaperlessBilling: string;
  PaymentMethod: string;
  MonthlyCharges: number;
  TotalCharges: number;
}

export interface ChurnPredictionResponse {
  customerID: string;
  churnProbability: number;
  willChurn: boolean;
  riskLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
}

export interface CompanyStatistics {
  totalCustomers: number;
  activeCustomers: number;
  churnedCustomers: number;
  churnRate: number;
  averageRevenue: number;
  totalRevenue: number;
  averageTenure: number;
  newCustomersThisMonth: number;
}

export interface ChurnByCategory {
  category: string;
  value: string;
  churnCount: number;
  totalCount: number;
  churnRate: number;
}

export interface RevenueStats {
  period: string;
  revenue: number;
  customers: number;
  averagePerCustomer: number;
}