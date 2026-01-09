// src/app/shared/components/sidebar/sidebar.component.ts

import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

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
      title: 'Dashboard',
      icon: 'fas fa-home',
      route: '/dashboard',
      active: false
    },
    {
      title: 'Predicción de Churn',
      icon: 'fas fa-user-slash',
      route: '/churn-prediction',
      active: false
    },
    {
      title: 'Estadísticas Empresa',
      icon: 'fas fa-chart-bar',
      route: '/company-statistics',
      active: false
    }
  ];

  constructor(private router: Router) {}

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
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
    return this.router.url === route;
  }
}