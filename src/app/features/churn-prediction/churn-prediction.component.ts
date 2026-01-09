// src/app/features/churn-prediction/churn-prediction.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { ChurnPredictionRequest, ChurnPredictionResponse } from '../../core/models/customer.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-churn-prediction',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './churn-prediction.component.html',
  styleUrls: ['./churn-prediction.component.css']
})
export class ChurnPredictionComponent implements OnInit {
  predictionForm!: FormGroup;
  predictionResult?: ChurnPredictionResponse;
  isLoading = false;
  showResult = false;

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
    this.initForm();
  }

  initForm(): void {
    this.predictionForm = this.fb.group({
      customerID: [''],
      gender: ['Male', Validators.required],
      SeniorCitizen: [0, Validators.required],
      Partner: ['No', Validators.required],
      Dependents: ['No', Validators.required],
      tenure: [1, [Validators.required, Validators.min(0)]],
      PhoneService: ['Yes', Validators.required],
      MultipleLines: ['No', Validators.required],
      InternetService: ['Fiber optic', Validators.required],
      OnlineSecurity: ['No', Validators.required],
      OnlineBackup: ['No', Validators.required],
      DeviceProtection: ['No', Validators.required],
      TechSupport: ['No', Validators.required],
      StreamingTV: ['No', Validators.required],
      StreamingMovies: ['No', Validators.required],
      Contract: ['Month-to-month', Validators.required],
      PaperlessBilling: ['Yes', Validators.required],
      PaymentMethod: ['Electronic check', Validators.required],
      MonthlyCharges: [0, [Validators.required, Validators.min(0)]],
      TotalCharges: [0, [Validators.required, Validators.min(0)]]
    });
  }

  onSubmit(): void {
    if (this.predictionForm.valid) {
      this.isLoading = true;
      this.showResult = false;

      const formData: ChurnPredictionRequest = this.predictionForm.value;

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
    } else {
      this.markFormGroupTouched(this.predictionForm);
    }
  }

  resetForm(): void {
    this.predictionForm.reset();
    this.initForm();
    this.showResult = false;
    this.predictionResult = undefined;
  }

  getRiskColorClass(): string {
    if (!this.predictionResult) return '';
    
    switch (this.predictionResult.riskLevel) {
      case 'high': return 'risk-high';
      case 'medium': return 'risk-medium';
      case 'low': return 'risk-low';
      default: return '';
    }
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

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }
}