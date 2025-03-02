import { Component, inject, input, OnInit, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthData } from '../../../services/auth/auth.service';
import {
  getDownloadURL,
  ref,
  Storage,
  uploadBytes,
} from '@angular/fire/storage';

@Component({
  selector: 'app-auth-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './auth-form.component.html',
})
export class AuthFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly storage: Storage = inject(Storage);

  submitMode = input.required<string>();
  submitted = output<AuthData>();
  selectedFile: File | null = null;

  authForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  ngOnInit(): void {
    if (this.submitMode() === 'Sign In') {
      this.authForm.controls.username.disable();
      // this.authForm.controls.image.disable();
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  async uploadImage(): Promise<string> {
    if (!this.selectedFile) {
      throw new Error('No file selected.');
    }

    const fileName = this.selectedFile.name;
    const storageRef = ref(this.storage, `profile-images/${fileName}`);
    await uploadBytes(storageRef, this.selectedFile);

    // const resizedImagesRef = ref(
    //   this.storage,
    //   `profile-images/resized-images/${fileName}`
    // );

    try {
      // return await getDownloadURL(resizedImagesRef);
      return await getDownloadURL(storageRef);
    } catch (error: any) {
      console.error('Image not found: ', error);
      throw new Error(error);
    }
  }

  async onSubmit() {
    //  (this.submitMode() === 'Sign Up' && !this.selectedFile)

    if (this.authForm.invalid) return;

    try {
      const { email, password } = this.authForm.value;

      if (this.submitMode() === 'Sign Up') {
        const username = this.authForm.get('username')?.value;
        const photoURL = await this.uploadImage();

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
