import { inject, Injectable } from '@angular/core';
import {
  getDownloadURL,
  ref,
  Storage,
  uploadBytes,
  deleteObject,
} from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class ImageUploadService {
  private storage = inject(Storage);

  async uploadImage(image: File, path: string): Promise<string> {
    const storageRef = ref(this.storage, path);
    try {
      await uploadBytes(storageRef, image);
      return await getDownloadURL(storageRef);
    } catch (error: any) {
      console.log(error);
      throw new Error(error);
    }
  }

  async deleteImage(path: string) {
    const storageRef = ref(this.storage, path);
    try {
      await deleteObject(storageRef);
    } catch (error) {
      console.log(error);
    }
  }
}
