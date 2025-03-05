import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { Recipe } from '../../models/recipe.model';
import { ImageUploadService } from '../image-upload/image-upload.service';

@Injectable({
  providedIn: 'root',
})
export class RecipesService {
  firestore = inject(Firestore);
  imageUploadService = inject(ImageUploadService);
  recipesRef = collection(this.firestore, 'recipes');

  async createRecipe(recipe: Recipe) {
    return addDoc(this.recipesRef, recipe);
  }

  async updateRecipe(id: string, recipe: Partial<Recipe>) {
    // Partial<Recipe> is a TypeScript utility type that makes all properties of Recipe optional.
    const recipeRef = doc(this.firestore, `recipes/${id}`);

    return updateDoc(recipeRef, recipe);
  }

  async deleteRecipe(id: string) {
    // Get the recipe document
    const recipeRef = doc(this.firestore, `recipes/${id}`);
    const recipeSnap = await getDoc(recipeRef);
    const recipeData = recipeSnap.data();

    try {
      //if an image for the recipe exists, delete it
      if (recipeData && recipeData['imagePath']) {
        const image = recipeData['imagePath'];
        await this.imageUploadService.deleteImage(image);
      }
      // Delete the recipe document
      return await deleteDoc(recipeRef);
    } catch (error) {
      throw error;
    }
  }

  async getUserRecipes(userId: string) {
    const q = query(this.recipesRef, where('userId', '==', userId));

    const snapshot = await getDocs(q);

    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Recipe)
    );
  }

  async getPublicRecipes() {
    const q = query(this.recipesRef, where('isPublic', '==', true));

    const snapshot = await getDocs(q);

    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Recipe)
    );
  }

  async getRecipeById(id: string) {
    const recipeRef = doc(this.firestore, `recipes/${id}`);

    const recipeSnap = await getDoc(recipeRef);

    if (recipeSnap.exists()) {
      return { id: recipeSnap.id, ...recipeSnap.data() } as Recipe;
    } else {
      return null;
    }
  }
}
