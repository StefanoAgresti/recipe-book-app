import { Component, inject, output, signal } from '@angular/core';
import { ImageUploadService } from '../../services/image-upload/image-upload.service';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [],
  templateUrl: './image-upload.component.html',
})
export class ImageUploadComponent {
  private imageUploadService = inject(ImageUploadService);

  imagePreview = signal<string>('');
  photoURL = output<string>();

  async setImage(event: any) {
    //utilizzare type event
    const file = event.target.files[0];
    this.imagePreview.set(
      await this.imageUploadService.uploadImage(
        file,
        `images/profile/${file.name}`
      )
    );
    this.photoURL.emit(this.imagePreview());
  }
}
