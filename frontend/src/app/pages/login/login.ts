import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { InputComponent } from '../../shared/components/input/input';
import { ButtonComponent } from '../../shared/components/button/button';
import { SupabaseService } from '../../core/services/supabase.service';
import { LoadingService } from '../../core/services/loading.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, ButtonComponent],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private supabase = inject(SupabaseService);
  private loadingService = inject(LoadingService);
  private router = inject(Router);

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  loading = signal(false); // keeping local for button state if desired, or use global
  errorMessage = signal<string | null>(null);
  year = new Date().getFullYear();

  async onSubmit() {
    if (this.loginForm.invalid) return;

    this.loading.set(true);
    this.loadingService.show();
    this.errorMessage.set(null);

    try {
      const { email, password } = this.loginForm.getRawValue();
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        this.errorMessage.set(error.message);
      } else {
        this.router.navigate(['/dashboard']);
      }
    } catch (err: any) {
      this.errorMessage.set('Ocorreu um erro inesperado. Tente novamente.');
    } finally {
      this.loading.set(false);
      this.loadingService.hide();
    }
  }
}
