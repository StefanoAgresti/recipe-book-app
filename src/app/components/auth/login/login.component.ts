import { Component, inject } from '@angular/core';
import { AuthFormComponent } from '../auth-form/auth-form.component';
import { Router, RouterLink } from '@angular/router';
import { AuthData, AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [AuthFormComponent, RouterLink],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  error: string | null = null;

  async onSubmit({ email, password }: AuthData) {
    try {
      await this.authService.login({ email, password });
      this.router.navigate(['/']);
    } catch (error: any) {
      console.log(error);
      this.error = error;
    }
  }
}
