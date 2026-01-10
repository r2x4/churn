import { Routes } from '@angular/router';
import { ChurnPredictionComponent } from './features/churn-prediction/churn-prediction.component';
import { CompanyStatisticsComponent } from './features/company-statistics/company-statistics.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { AdminComponent } from './features/admin/admin.component'; // Import AdminComponent
import { LoginComponent } from './features/auth/login/login.component';
import { AuthGuard } from './features/auth/login/auth.guard';

export const routes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'churn-prediction', component: ChurnPredictionComponent },
    { path: 'company-statistics', component: CompanyStatisticsComponent },
    { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] }, // Proteger la ruta con AuthGuard
    { path: 'login', component: LoginComponent }, // Agregar la ruta de login
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: '**', redirectTo: '/dashboard' }
];
