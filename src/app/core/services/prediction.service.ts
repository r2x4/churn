import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CustomerInput, PredictionOutput } from '../models/customer-prediction.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PredictionService {
  private apiUrl = environment.predictionUrl;

  constructor(private http: HttpClient) { }

  getPrediction(customerData: CustomerInput): Observable<PredictionOutput> {
    return this.http.post<PredictionOutput>(this.apiUrl, customerData);
  }
}
