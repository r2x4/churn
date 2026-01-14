import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  isCollapsed = false;

  menuItems = [
    {
      title: 'Panel 📊',
      icon: 'fas fa-home',
      route: '/dashboard',
      active: false
    },
    {
      title: 'Predicción de Churn 📉',
      icon: 'fas fa-user-slash',
      route: '/churn-prediction',
      active: false
    },
    {
      title: 'Estadísticas Empresa 📈',
      icon: 'fas fa-chart-bar',
      route: '/company-statistics',
      active: false
    },
    {
      title: 'Administración ⚙️',
      icon: 'fas fa-cog',
      route: '/admin',
      active: false
    }
  ];

  constructor(
    private router: Router,
    private apiService: ApiService
  ) { }

  logout(): void {
    if (confirm('¿Estás seguro de que deseas cerrar la sesión?')) {
      this.apiService.logout();
      this.router.navigate(['/login']);
    }
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  isLoggedIn(): boolean {
    return this.apiService.isAuthenticated();
  }

  navigate(route: string): void {
    this.menuItems.forEach(item => item.active = false);
    const selectedItem = this.menuItems.find(item => item.route === route);
    if (selectedItem) {
      selectedItem.active = true;
    }
    this.router.navigate([route]);
  }

  isActive(route: string): boolean {
    const currentUrl = this.router.url;
    if (route === '/admin' && currentUrl.includes('/login')) {
      return true;
    }
    return currentUrl === route;
  }
}