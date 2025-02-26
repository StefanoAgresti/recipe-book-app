import { Component, inject } from '@angular/core';
import { AuthFormComponent } from '../auth-form/auth-form.component';
import { AuthData, AuthService } from '../../../services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [AuthFormComponent, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  error: string | null = null;

  async onSubmit({ email, username, photoURL, password }: AuthData) {
    try {
      await this.auth.signup({ email, username, photoURL, password });
      this.router.navigate(['/']);
    } catch (error: any) {
      this.error = error;
    }
  }
}
