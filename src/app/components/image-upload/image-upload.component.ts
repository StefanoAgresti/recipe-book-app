import {
  Component,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { ImageUploadService } from '../../services/image-upload/image-upload.service';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [],
  templateUrl: './image-upload.component.html',
})
export class ImageUploadComponent implements OnInit {
  private imageUploadService = inject(ImageUploadService);

  imagePreview = signal<string>('');
  photoURL = output<string>();
  imagePath = output<string>();
  mode = input<'Recipe' | 'Profile'>();
  imageUrlStart = input<string | null | undefined>();

  ngOnInit(): void {
    if (this.imageUrlStart()) {
      this.imagePreview.set(this.imageUrlStart()!);
    }
  }

  async setImage(event: any) {
    //utilizzare type event
    const file = event.target.files[0];
    if (!file) return;

    const path = `images/${this.mode()}/${file.name}`;

    this.imagePreview.set(
      await this.imageUploadService.uploadImage(file, path)
    );
    this.photoURL.emit(this.imagePreview());
    this.imagePath.emit(path);
  }
}
