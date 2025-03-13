import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../services/auth/auth.service';
import { EmailAuthProvider } from '@angular/fire/auth';

@Component({
  selector: 'app-update-email',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './update-email.component.html',
})
export class UpdateEmailComponent {
  fb = inject(FormBuilder);
  auth = inject(AuthService);

  error = signal<string | null>(null);
  isLoading = signal(false);
  needsReauth = signal(false);

  updateEmailForm = this.fb.group({
    newEmail: ['', [Validators.required, Validators.email]],
    password: [''],
  });

  async onUpdateEmail() {
    if (this.updateEmailForm.invalid) return;

    this.isLoading.set(true);
    this.error.set(null);

    try {
      const newEmail = this.updateEmailForm.get('newEmail')?.value;
      const password = this.updateEmailForm.get('password')?.value;
      const currentUser = this.auth.currentUser();

      if (!currentUser) throw new Error('User not authenticated.');

      if (this.needsReauth()) {
        if (!password) {
          throw new Error('Password is required for reauthentication');
        }
        // create current user credential
        const credential = EmailAuthProvider.credential(
          currentUser.email!,
          password
        );
        await this.auth.reauthenticateUser(credential);
      }

      // update the email
      await this.auth.updateEmail(newEmail!);
      this.updateEmailForm.reset();
      alert(
        'Email updated successfully. Check your email box to confirm the change.'
      );
    } catch (error: any) {
      if (error.code === 'auth/requires-recent-login') {
        this.needsReauth.set(true);
        this.updateEmailForm
          .get('password')
          ?.setValidators([Validators.required, Validators.minLength(6)]);
        this.updateEmailForm.get('password')?.updateValueAndValidity();
        this.error.set('Please enter your password to continue');
      } else {
        this.error.set(error.message);
      }
    } finally {
      this.isLoading.set(false);
    }
  }
}
