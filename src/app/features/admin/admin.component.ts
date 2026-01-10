import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PredictionService } from '../../core/services/prediction.service'; // Adjust path as needed
import { CustomerInput, PredictionOutput } from '../../core/models/customer-prediction.model'; // Adjust path as needed

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  selectedTab: string = 'predictions'; // Default selected tab
  predictionResult: PredictionOutput | null = null;
  predictionError: string | null = null;

  // Sample customer data for demonstration
  sampleCustomerInput: CustomerInput = {
    id_cliente: "7590-VHVEG",
    genero: "Male",
    adulto_mayor: 0,
    tiene_pareja: "Yes",
    tiene_dependientes: "No",
    antiguedad_meses: 12,
    servicio_telefono: "Yes",
    lineas_multiples: "No",
    servicio_internet: "Fiber optic",
    seguridad_en_linea: "No",
    respaldo_en_linea: "Yes",
    proteccion_dispositivo: "No",
    soporte_tecnico: "No",
    streaming_tv: "Yes",
    streaming_peliculas: "Yes",
    tipo_contrato: "Month-to-month",
    facturacion_electronica: "Yes",
    metodo_pago: "Electronic check",
    cargo_mensual: 85.5,
    cargos_totales: 1026.0
  };

  constructor(private predictionService: PredictionService) {}

  selectTab(tab: string): void {
    this.selectedTab = tab;
  }

  makePrediction(): void {
    this.predictionResult = null;
    this.predictionError = null;

    this.predictionService.getPrediction(this.sampleCustomerInput).subscribe({
      next: (data) => {
        this.predictionResult = data;
        console.log('Prediction successful:', data);
      },
      error: (error) => {
        this.predictionError = 'Error al obtener la predicción: ' + error.message;
        console.error('Error fetching prediction:', error);
      }
    });
  }
}
