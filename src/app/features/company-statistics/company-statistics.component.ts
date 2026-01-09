// src/app/features/company-statistics/company-statistics.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { CompanyStatistics } from '../../core/models/customer.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-company-statistics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './company-statistics.component.html',
  styleUrls: ['./company-statistics.component.css']
})
export class CompanyStatisticsComponent implements OnInit {
  stats$: Observable<CompanyStatistics> | undefined;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.stats$ = this.apiService.getCompanyStatistics();
  }
}
