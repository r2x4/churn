// src/app/features/dashboard/dashboard.component.ts

import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { CompanyStatistics, ChurnByCategory, RevenueStats } from '../../core/models/customer.model';
import Chart, { ArcElement } from 'chart.js/auto'; // Import Chart.js

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  companyStatistics: CompanyStatistics | undefined;
  churnByContract: ChurnByCategory[] = [];
  monthlyRevenue: RevenueStats[] = [];
  churnByInternetService: ChurnByCategory[] = [];
  churnByPaymentMethod: ChurnByCategory[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getCompanyStatistics().subscribe(data => {
      this.companyStatistics = data;
    });

    this.apiService.getChurnByCategory('contract').subscribe(data => {
      this.churnByContract = data;
      this.createChurnByContractChart();
    });

    this.apiService.getRevenueStats('monthly').subscribe(data => {
      this.monthlyRevenue = data;
      this.createMonthlyRevenueChart();
    });

    this.apiService.getChurnByCategory('InternetService').subscribe(data => {
      this.churnByInternetService = data;
      this.createChurnByInternetServiceChart();
    });

    this.apiService.getChurnByCategory('PaymentMethod').subscribe(data => {
      this.churnByPaymentMethod = data;
      this.createChurnByPaymentMethodChart();
    });
  }

  ngAfterViewInit(): void {
    // Charts are created in ngOnInit after data is received
  }

  createChurnByContractChart(): void {
    const canvas = document.getElementById('churnByContractChart') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      const labels = this.churnByContract.map(item => item.value);
      const churnData = this.churnByContract.map(item => item.churnRate);

      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Churn Rate (%)',
            data: churnData,
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Churn Rate (%)'
              }
            }
          },
          plugins: {
            legend: {
              display: false
            },
            title: {
              display: true,
              text: 'Churn Rate by Contract Type'
            }
          }
        }
      });
    }
  }

  createMonthlyRevenueChart(): void {
    const canvas = document.getElementById('monthlyRevenueChart') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      const labels = this.monthlyRevenue.map(item => item.period);
      const revenueData = this.monthlyRevenue.map(item => item.revenue);

      new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Monthly Revenue ($)',
            data: revenueData,
            fill: true,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Revenue ($)'
              }
            }
          },
          plugins: {
            legend: {
              display: false
            },
            title: {
              display: true,
              text: 'Monthly Revenue Trend'
            }
          }
        }
      });
    }
  }

  createChurnByInternetServiceChart(): void {
    const canvas = document.getElementById('churnByInternetServiceChart') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      const labels = this.churnByInternetService.map(item => item.value);
      const churnData = this.churnByInternetService.map(item => item.churnRate);

      new Chart(ctx, {
        type: 'doughnut', // Using doughnut for churn by service
        data: {
          labels: labels,
          datasets: [{
            label: 'Churn Rate (%)',
            data: churnData,
            backgroundColor: [
              'rgba(255, 159, 64, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(153, 102, 255, 0.6)'
            ],
            borderColor: [
              'rgba(255, 159, 64, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Churn by Internet Service Type'
            },
          }
        },
        plugins: [{
          id: 'customDatalabels',
          afterDraw: (chart) => {
            const ctx = chart.ctx;
            ctx.save();
            ctx.font = 'bold 12px sans-serif';
            ctx.fillStyle = '#fff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            const arcs = chart.getDatasetMeta(0).data;
            arcs.forEach((element: any, index: number) => {
              const arc = element as ArcElement;
              const data = chart.data.datasets[0].data[index] as number;
              if (data) {
                const angle = (arc.startAngle + arc.endAngle) / 2;
                const radius = (arc.outerRadius + arc.innerRadius) / 2;
                const x = arc.x + Math.cos(angle) * radius;
                const y = arc.y + Math.sin(angle) * radius;

                ctx.fillText(`${data.toFixed(1)}%`, x, y);
              }
            });
            ctx.restore();
          }
        }]
      });
    }
  }

  createChurnByPaymentMethodChart(): void {
    const canvas = document.getElementById('churnByPaymentMethodChart') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      const labels = this.churnByPaymentMethod.map(item => item.value);
      const churnData = this.churnByPaymentMethod.map(item => item.churnRate);

      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Churn Rate (%)',
            data: churnData,
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(153, 102, 255, 0.6)',
              'rgba(255, 159, 64, 0.6)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Churn Rate (%)'
              }
            }
          },
          plugins: {
            legend: {
              display: false
            },
            title: {
              display: true,
              text: 'Churn Rate by Payment Method'
            }
          }
        }
      });
    }
  }
}
