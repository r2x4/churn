import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { ConfirmModalComponent } from '../../../features/admin/components/confirm-modal.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, ConfirmModalComponent],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  isCollapsed = false;

  // Variables para el modal de cierre de sesión
  showLogoutModal = false;

  menuItems = [
    {
      title: 'Panel',
      icon: 'fas fa-home',
      route: '/dashboard',
      active: false
    },
    {
      title: 'Estadísticas Empresa',
      icon: 'fas fa-chart-bar',
      route: '/company-statistics',
      active: false
    },
    {
      title: 'Administración',
      icon: 'fas fa-cog',
      route: '/admin',
      active: false,
      expanded: false,
      children: [
        { title: 'Predicción de Churn', route: '/admin', queryParams: { tab: 'churn' }, icon: 'fas fa-dna' },
        { title: 'Historial de Datos', route: '/admin', queryParams: { tab: 'history' }, icon: 'fas fa-history' },
        { title: 'Gestión de Usuarios', route: '/admin', queryParams: { tab: 'users' }, icon: 'fas fa-users' },
        { title: 'Roles y Permisos', route: '/admin', queryParams: { tab: 'roles' }, icon: 'fas fa-user-shield' },
        { title: 'Planes', route: '/admin', queryParams: { tab: 'planes' }, icon: 'fas fa-mobile-alt' },
        { title: 'Ofertas', route: '/admin', queryParams: { tab: 'ofertas' }, icon: 'fas fa-gift' },
        { title: 'Servicios', route: '/admin', queryParams: { tab: 'servicios' }, icon: 'fas fa-tools' }
      ]
    }
  ];

  toggleExpand(item: any, event: Event): void {
    event.stopPropagation();
    item.expanded = !item.expanded;
  }

  constructor(
    private router: Router,
    private apiService: ApiService
  ) { }

  logout(): void {
    this.showLogoutModal = true;
  }

  confirmLogout(): void {
    this.apiService.logout();
    this.router.navigate(['/login']);
    this.showLogoutModal = false;
  }

  cancelLogout(): void {
    this.showLogoutModal = false;
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  isLoggedIn(): boolean {
    return this.apiService.isAuthenticated();
  }

  navigate(item: any): void {
    if (item.children && !this.isCollapsed) {
      item.expanded = !item.expanded;
      return;
    }

    this.menuItems.forEach(i => i.active = false);
    item.active = true;

    if (item.queryParams) {
      this.router.navigate([item.route], { queryParams: item.queryParams });
    } else {
      this.router.navigate([item.route]);
    }
  }

  isActive(item: any): boolean {
    const currentUrl = this.router.url;

    if (item.children) {
      return item.children.some((child: any) => {
        const urlWithParams = this.router.serializeUrl(
          this.router.createUrlTree([child.route], { queryParams: child.queryParams })
        );
        return currentUrl === urlWithParams;
      });
    }

    if (item.queryParams) {
      const urlWithParams = this.router.serializeUrl(
        this.router.createUrlTree([item.route], { queryParams: item.queryParams })
      );
      return currentUrl === urlWithParams;
    }

    return currentUrl === item.route;
  }
}