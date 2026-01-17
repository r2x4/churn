// src/app/features/admin/components/confirm-modal.component.ts

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <!-- Backdrop with blur -->
      <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" (click)="onCancel.emit()"></div>
      
      <!-- Modal Content -->
      <div class="relative bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all border border-gray-100">
        <div class="p-6">
          <!-- Dinamic Icon based on type -->
          <div [ngClass]="{
            'bg-red-100 text-red-600': type === 'danger',
            'bg-green-100 text-green-600': type === 'success',
            'bg-blue-100 text-blue-600': type === 'info'
          }" class="flex items-center justify-center w-12 h-12 mx-auto rounded-full mb-4">
            
            <!-- Danger Icon -->
            <svg *ngIf="type === 'danger'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>

            <!-- Success Icon -->
            <svg *ngIf="type === 'success'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>

            <!-- Info Icon -->
            <svg *ngIf="type === 'info'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h3 class="text-xl font-bold text-center text-gray-900 mb-2">
            {{ title }}
          </h3>
          <p class="text-center text-gray-500">
            {{ message }}
          </p>
        </div>
        
        <div class="bg-gray-50 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <button 
            type="button" 
            (click)="onCancel.emit()"
            class="w-full sm:w-auto px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            {{ cancelText }}
          </button>
          <button 
            type="button" 
            (click)="onConfirm.emit()"
            [ngClass]="{
              'bg-red-600 hover:bg-red-700 focus:ring-red-500': type === 'danger',
              'bg-green-600 hover:bg-green-700 focus:ring-green-500': type === 'success',
              'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500': type === 'info'
            }"
            class="w-full sm:w-auto px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors shadow-sm focus:ring-2 focus:ring-offset-2"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class ConfirmModalComponent {
  @Input() title: string = 'Confirmar Acción';
  @Input() message: string = '¿Estás seguro de que deseas realizar esta acción?';
  @Input() confirmText: string = 'Confirmar';
  @Input() cancelText: string = 'Cancelar';
  @Input() type: 'danger' | 'success' | 'info' = 'danger';

  @Output() onConfirm = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();
}
