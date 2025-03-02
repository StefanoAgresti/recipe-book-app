import {
  Component,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ImageUploadComponent } from '../../image-upload/image-upload.component';
import { AuthData } from '../../../models/auth-data.model';

@Component({
  selector: 'app-auth-form',
  standalone: true,
  imports: [ReactiveFormsModule, ImageUploadComponent],
  templateUrl: './auth-form.component.html',
})
export class AuthFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  submitMode = input.required<string>();
  submitted = output<AuthData>();

  photoURL = signal<string>('');
  handlingImage(photoURL: string) {
    this.photoURL.set(photoURL);
  }

  authForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  ngOnInit(): void {
    if (this.submitMode() === 'Sign In') {
      this.authForm.controls.username.disable();
    }
  }

  async onSubmit() {
    if (this.authForm.invalid) return;
    const { email, password } = this.authForm.value;
    try {
      if (this.submitMode() === 'Sign Up') {
        const username = this.authForm.get('username')?.value;
        const photoURL = this.photoURL;

        this.submitted.emit({
          email,
          username,
          photoURL,
          password,
        } as AuthData);
      } else {
        this.submitted.emit({
          email,
          password,
        } as AuthData);
      }
    } catch (error) {
      console.error('Error during signup: ', error);
    }
  }
}
