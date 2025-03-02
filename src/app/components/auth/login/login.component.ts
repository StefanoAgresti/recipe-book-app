import { Component, inject, signal } from '@angular/core';
import { AuthFormComponent } from '../auth-form/auth-form.component';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { AuthData } from '../../../models/auth-data.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [AuthFormComponent, RouterLink],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  error = signal<string | null>(null);

  async onSubmit({ email, password }: AuthData) {
    try {
      await this.authService.login({ email, password });
      this.router.navigate(['/']);
    } catch (error: any) {
      console.log(error);
      this.error.set(error);
    }
  }
}
