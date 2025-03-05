import { Component, inject, signal } from '@angular/core';
import { AuthFormComponent } from '../auth-form/auth-form.component';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { AuthData } from '../../../models/auth-data.model';
import { ErrorHandlerService } from '../../../services/error-handler/error-handler.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [AuthFormComponent, RouterLink],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private errorHandler = inject(ErrorHandlerService);

  error = signal<string | null>(null);

  async onSubmit({ email, password }: AuthData) {
    try {
      await this.authService.login({ email, password });
      this.router.navigate(['/']);
    } catch (error: any) {
      this.error.set(this.errorHandler.getAuthErrorMessage(error));
    }
  }
}
