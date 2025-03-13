import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../services/auth/auth.service';
import { EmailAuthProvider } from '@angular/fire/auth';

@Component({
  selector: 'app-delete-user',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './delete-user.component.html',
})
export class DeleteUserComponent {
  fb = inject(FormBuilder);
  auth = inject(AuthService);

  showPasswordField = signal(false);
  error = signal<string | null>(null);
  isLoading = signal(false);

  deleteForm = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  async onDeleteAccount() {
    if (this.deleteForm.invalid) return;

    if (
      !confirm(
        'Are you sure you want to delete your account? This action cannot be undone.'
      )
    ) {
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    try {
      const password = this.deleteForm.get('password')?.value;
      const currentUser = this.auth.currentUser();

      if (!currentUser) throw new Error('User not authenticated.');

      // Reauthenticate the user before deleting account
      const credential = EmailAuthProvider.credential(
        currentUser.email!,
        password!
      );
      await this.auth.reauthenticateUser(credential);

      // Delete account
      await this.auth.deleteUser(currentUser);
    } catch (error: any) {
      if (error.code === 'auth/invalid-credential') {
        this.error.set('Invalid Credential');
      } else {
        this.error.set(error.message);
      }
    } finally {
      this.isLoading.set(false);
    }
  }

  onCancel() {
    this.deleteForm.reset();
    this.showPasswordField.set(false);
  }
}
