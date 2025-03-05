import { Component, inject, signal } from '@angular/core';
import { AuthFormComponent } from '../auth-form/auth-form.component';
import { AuthService } from '../../../services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { AuthData } from '../../../models/auth-data.model';
import { ErrorHandlerService } from '../../../services/error-handler/error-handler.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [AuthFormComponent, RouterLink],
  templateUrl: './signup.component.html',
})
export class SignupComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private errorHandler = inject(ErrorHandlerService);

  error = signal<string | null>(null);

  async onSubmit({ email, username, photoURL, password }: AuthData) {
    try {
      await this.auth.signup({ email, username, photoURL, password });
      this.router.navigate(['/']);
    } catch (error: any) {
      this.error.set(this.errorHandler.getAuthErrorMessage(error));
    }
  }
}
