import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../services/auth/auth.service';
import { EmailAuthProvider } from '@angular/fire/auth';

@Component({
  selector: 'app-update-password',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './update-password.component.html',
})
export class UpdatePasswordComponent {
  fb = inject(FormBuilder);
  auth = inject(AuthService);

  error = signal<string | null>(null);
  isLoading = signal(false);

  passwordForm = this.fb.group({
    currentPassword: ['', [Validators.required, Validators.minLength(6)]],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
  });

  isFormValid(): boolean {
    const { currentPassword, newPassword, confirmPassword } =
      this.passwordForm.controls;

    return (
      currentPassword.valid &&
      newPassword.valid &&
      confirmPassword.valid &&
      newPassword.value === confirmPassword.value
    );
  }

  async onUpdatePassword() {
    if (!this.isFormValid()) return;

    this.isLoading.set(true);
    this.error.set(null);

    try {
      const currentPassword = this.passwordForm.get('currentPassword')?.value;
      const newPassword = this.passwordForm.get('newPassword')?.value;
      const currentUser = this.auth.currentUser();

      if (!currentUser) throw new Error('User not authenticated.');

      // create current user credential
      const credential = EmailAuthProvider.credential(
        currentUser.email!,
        currentPassword!
      );
      // reauthenticate user
      await this.auth.reauthenticateUser(credential);

      // update password
      await this.auth.updatePassword(newPassword!);

      // form reset
      this.passwordForm.reset();

      alert('Password updated successfully.');
    } catch (error: any) {
      if (error.code === 'auth/wrong-password') {
        this.error.set('Current password is incorrect');
      } else {
        this.error.set(error.message);
      }
    } finally {
      this.isLoading.set(false);
    }
  }
}
