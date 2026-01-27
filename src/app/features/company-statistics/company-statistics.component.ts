// src/app/features/company-statistics/company-statistics.component.ts

import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { CompanyStatistics, RevenueStats } from '../../core/models/customer.model';
import { forkJoin, Subscription, Observable } from 'rxjs';
import { Chart, registerables } from 'chart.js/auto';
import { shareReplay, tap } from 'rxjs/operators';

@Component({
  selector: 'app-company-statistics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './company-statistics.component.html',
  styleUrls: ['./company-statistics.component.css']
})
export class CompanyStatisticsComponent implements OnInit, AfterViewInit, OnDestroy {
  stats$: Observable<CompanyStatistics> | undefined;
  monthlyRevenue: RevenueStats[] = [];
  private chart: Chart | undefined;
  private dataSubscription: Subscription | undefined;

  constructor(private apiService: ApiService) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.stats$ = this.apiService.getCompanyStatistics().pipe(shareReplay(1));
    this.dataSubscription = forkJoin({
      stats: this.stats$,
      revenue: this.apiService.getRevenueStats('monthly')
    }).subscribe(({ stats, revenue }) => {
      this.monthlyRevenue = revenue;
      this.createRevenueLossChart(stats);
    });
  }

  ngAfterViewInit(): void {
    // Chart is created in ngOnInit after data is available
  }

  ngOnDestroy(): void {
    this.dataSubscription?.unsubscribe();
    this.chart?.destroy();
  }

  private createRevenueLossChart(stats: CompanyStatistics): void {
    const canvas = document.getElementById('revenueLossChart') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      const labels = this.monthlyRevenue.map(item => item.period);
      const revenueData = this.monthlyRevenue.map(item => item.revenue);
      const lossData = this.monthlyRevenue.map(item => item.revenue * (stats.churnRate / 100));
      const numberPipe = new DecimalPipe('en-US');

      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Ingresos',
              data: revenueData,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            },
            {
              label: 'Pérdidas Estimadas',
              data: lossData,
              backgroundColor: 'rgba(255, 99, 132, 0.6)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Monto ($)'
              }
            }
          },
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Comparación Mensual de Ingresos vs. Pérdidas Estimadas'
            }
          }
        },
        plugins: [{
          id: 'customDatalabels',
          afterDraw: (chart) => {
            const ctx = chart.ctx;
            ctx.save();
            ctx.font = 'bold 12px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';

            chart.data.datasets.forEach((dataset, i) => {
              const meta = chart.getDatasetMeta(i);
              meta.data.forEach((bar, index) => {
                const data = dataset.data?.[index] as number;
                if (data) {
                  const formattedValue = '$' + numberPipe.transform(data, '1.0-0');
                  ctx.fillStyle = dataset.borderColor as string;
                  ctx.fillText(formattedValue, bar.x, bar.y - 5);
                }
              });
            });
            ctx.restore();
          }
        }]
      });
    }
  }
}
