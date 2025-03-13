import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ImageUploadComponent } from '../../../image-upload/image-upload.component';
import { AuthService } from '../../../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-profile',
  standalone: true,
  imports: [ReactiveFormsModule, ImageUploadComponent],
  templateUrl: './update-profile.component.html',
})
export class UpdateProfileComponent implements OnInit {
  fb = inject(FormBuilder);
  auth = inject(AuthService);
  router = inject(Router);

  error = signal(null);
  isLoading = signal(false);
  photoURL = signal('');
  imagePath = signal('');

  profileForm = this.fb.group({
    username: ['', [Validators.required]],
  });

  ngOnInit() {
    // Inizializza il form con i dati attuali dell'utente
    if (this.auth.currentUser()) {
      this.profileForm.patchValue({
        username: this.auth.currentUser()?.displayName || '',
      });

      // Se l'utente ha già un'immagine del profilo, la mostriamo
      if (this.auth.currentUser()?.photoURL) {
        this.photoURL.set(this.auth.currentUser()?.photoURL || '');
      }
    }
  }

  handlingImage(imageUrl: string) {
    this.photoURL.set(imageUrl);
  }

  handleImagePath(path: string) {
    this.imagePath.set(path);
  }

  async onSubmit() {
    if (this.profileForm.invalid) return;

    this.isLoading.set(true);
    this.error.set(null);

    try {
      const currentUser = this.auth.currentUser();

      if (!currentUser) throw new Error('User not authenticated.');

      const username = this.profileForm.get('username')?.value;

      // update user's username using the updateUsername in auth service
      await this.auth.updateUsername(username!);

      // TODO: if the photourl is not changed do not try to update
      if (this.photoURL()) await this.auth.updatePhotoURL(this.photoURL());

      // go back to profile page
      this.router.navigate(['/profile', currentUser.uid]);
    } catch (error: any) {
      this.error.set(error);
    } finally {
      this.isLoading.set(false);
    }
  }

  onCancel() {
    // redirect to profile page and discard changes
    // TODO: if there are changes let the user know that changes will be discarded
    const uid = this.auth.currentUser()?.uid;

    if (uid) this.router.navigate(['/profile', uid]);
    else this.router.navigate(['/home']);
  }
}
