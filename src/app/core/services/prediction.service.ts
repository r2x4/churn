import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CustomerInput, PredictionOutput } from '../models/customer-prediction.model';

@Injectable({
  providedIn: 'root'
})
export class PredictionService {
  private apiUrl = 'http://163.192.138.89:8084/predict'; // Reemplaza con la URL real de tu API

  constructor(private http: HttpClient) { }

  getPrediction(customerData: CustomerInput): Observable<PredictionOutput> {
    return this.http.post<PredictionOutput>(this.apiUrl, customerData);
  }
}
