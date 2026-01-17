import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required)
    });
  }

  onSubmit(): void {
    this.errorMessage = null;
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.apiService.login({ email, password }).subscribe({
        next: (response) => {
          // Login exitoso: guardamos token y redirigimos
          localStorage.setItem('token', response.token);
          this.router.navigate(['/admin']);
        },
        error: (err) => {
          this.errorMessage = err?.message || 'Error al iniciar sesión.';
          console.error('Login error:', err);
        }
      });
    } else {
      this.errorMessage = 'Por favor, ingrese un usuario y contraseña válidos.';
    }
  }
}
