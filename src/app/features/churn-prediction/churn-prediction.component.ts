// src/app/features/churn-prediction/churn-prediction.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { ChurnPredictionRequest, ChurnPredictionResponse, Customer } from '../../core/models/customer.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-churn-prediction',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './churn-prediction.component.html',
  styleUrls: ['./churn-prediction.component.css']
})
export class ChurnPredictionComponent implements OnInit {
  searchForm!: FormGroup;
  predictionForm!: FormGroup;
  
  customer: Customer | null = null;
  predictionResult?: ChurnPredictionResponse;
  
  isLoading = false;
  isSearching = false;
  showResult = false;
  searchError: string | null = null;

  // Opciones para los selectores
  genderOptions = ['Male', 'Female'];
  yesNoOptions = ['Yes', 'No'];
  internetServiceOptions = ['DSL', 'Fiber optic', 'No'];
  contractOptions = ['Month-to-month', 'One year', 'Two year'];
  paymentMethodOptions = [
    'Electronic check',
    'Mailed check',
    'Bank transfer (automatic)',
    'Credit card (automatic)'
  ];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.initForms();
  }

  initForms(): void {
    this.searchForm = this.fb.group({
      customerID: ['5575-GNVDE', Validators.required] // Example ID
    });

    this.predictionForm = this.fb.group({
      customerID: [{ value: '', disabled: true }],
      gender: [{ value: 'Male', disabled: true }, Validators.required],
      SeniorCitizen: [{ value: 0, disabled: true }, Validators.required],
      Partner: [{ value: 'No', disabled: true }, Validators.required],
      Dependents: [{ value: 'No', disabled: true }, Validators.required],
      tenure: [{ value: 1, disabled: true }, [Validators.required, Validators.min(0)]],
      PhoneService: [{ value: 'Yes', disabled: true }, Validators.required],
      MultipleLines: [{ value: 'No', disabled: true }, Validators.required],
      InternetService: [{ value: 'Fiber optic', disabled: true }, Validators.required],
      OnlineSecurity: [{ value: 'No', disabled: true }, Validators.required],
      OnlineBackup: [{ value: 'No', disabled: true }, Validators.required],
      DeviceProtection: [{ value: 'No', disabled: true }, Validators.required],
      TechSupport: [{ value: 'No', disabled: true }, Validators.required],
      StreamingTV: [{ value: 'No', disabled: true }, Validators.required],
      StreamingMovies: [{ value: 'No', disabled: true }, Validators.required],
      Contract: [{ value: 'Month-to-month', disabled: true }, Validators.required],
      PaperlessBilling: [{ value: 'Yes', disabled: true }, Validators.required],
      PaymentMethod: [{ value: 'Electronic check', disabled: true }, Validators.required],
      MonthlyCharges: [{ value: 0, disabled: true }, [Validators.required, Validators.min(0)]],
      TotalCharges: [{ value: 0, disabled: true }, [Validators.required, Validators.min(0)]]
    });
  }

  searchCustomer(): void {
    if (this.searchForm.invalid) {
      return;
    }
    this.isSearching = true;
    this.customer = null;
    this.searchError = null;
    this.resetForm(false);

    const customerId = this.searchForm.get('customerID')?.value;
    this.apiService.getCustomerForPrediction(customerId).subscribe({
      next: (customerData) => {
        if (customerData) {
          this.customer = customerData;
          this.predictionForm.patchValue(customerData);
          this.predictionForm.enable(); // Habilitar el formulario para la predicción
        } else {
          this.searchError = `No se encontró un cliente con el ID: ${customerId}`;
        }
        this.isSearching = false;
      },
      error: (err) => {
        this.searchError = `Error al buscar el cliente: ${err.message}`;
        this.isSearching = false;
      }
    });
  }

  onSubmit(): void {
    if (this.predictionForm.valid) {
      this.isLoading = true;
      this.showResult = false;

      const formData: ChurnPredictionRequest = this.predictionForm.getRawValue();

      this.apiService.predictChurn(formData).subscribe({
        next: (result) => {
          this.predictionResult = result;
          this.showResult = true;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error en predicción:', error);
          this.isLoading = false;
        }
      });
    }
  }

  resetForm(fullReset: boolean = true): void {
    if (fullReset) {
      this.searchForm.reset({ customerID: '5575-GNVDE' });
      this.customer = null;
      this.searchError = null;
    }
    this.predictionForm.reset();
    this.predictionForm.disable();
    this.showResult = false;
    this.predictionResult = undefined;
  }

  getRiskLabel(): string {
    if (!this.predictionResult) return '';
    
    switch (this.predictionResult.riskLevel) {
      case 'high': return 'Alto Riesgo';
      case 'medium': return 'Riesgo Medio';
      case 'low': return 'Bajo Riesgo';
      default: return '';
    }
  }
}