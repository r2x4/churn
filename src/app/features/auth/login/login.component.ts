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

  loading = false;

  onSubmit(): void {
    this.errorMessage = null;
    if (this.loginForm.valid) {
      this.loading = true;
      const { email, password } = this.loginForm.value;
      this.apiService.login({ email, password }).subscribe({
        next: (response) => {
          localStorage.setItem('token', response.token);
          this.router.navigate(['/admin']);
          this.loading = false;
        },
        error: (err) => {
          this.errorMessage = err?.message || 'Error al iniciar sesión.';
          this.loading = false;
        }
      });
    } else {
      this.errorMessage = 'Por favor, ingrese un usuario y contraseña válidos.';
    }
  }
}
