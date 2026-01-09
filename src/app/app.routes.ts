import { Routes } from '@angular/router';
import { ChurnPredictionComponent } from './features/churn-prediction/churn-prediction.component';
import { CompanyStatisticsComponent } from './features/company-statistics/company-statistics.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';

export const routes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'churn-prediction', component: ChurnPredictionComponent },
    { path: 'company-statistics', component: CompanyStatisticsComponent },
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: '**', redirectTo: '/dashboard' }
];
