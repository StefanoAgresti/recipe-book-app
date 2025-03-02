import { Component, inject, input, OnInit, output } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Recipe } from '../../../models/recipe.model';
import { AuthService } from '../../../services/auth/auth.service';
import { getDownloadURL, Storage } from '@angular/fire/storage';
import { ref, uploadBytes } from '@firebase/storage';

@Component({
  selector: 'app-recipe-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './recipe-form.component.html',
})
export class RecipeFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);

  recipe = input<Recipe | null>();
  submitted = output<Recipe>();

  recipeForm = this.fb.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    ingredients: this.fb.array([]),
    instructions: this.fb.array([]),
    isPublic: [false],
  });

  get ingredients() {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  get instructions() {
    return this.recipeForm.get('instructions') as FormArray;
  }

  ngOnInit() {
    if (this.recipe()) {
      this.recipeForm.patchValue({
        title: this.recipe()!.title,
        description: this.recipe()!.description,
        isPublic: this.recipe()!.isPublic,
      });

      this.recipe()!.ingredients.forEach((ingredient) => {
        this.ingredients.push(this.fb.control(ingredient));
      });

      this.recipe()!.instructions.forEach((instruction) => {
        this.instructions.push(this.fb.control(instruction));
      });
    } else {
      this.ingredients.push(this.fb.control(''));
      this.instructions.push(this.fb.control(''));
    }
  }

  addIngredient() {
    this.ingredients.push(this.fb.control(''));
  }

  removeIngredient(index: number) {
    this.ingredients.removeAt(index);
  }

  addInstruction() {
    this.instructions.push(this.fb.control(''));
  }

  removeInstruction(index: number) {
    this.instructions.removeAt(index);
  }

  private readonly storage: Storage = inject(Storage);

  selectedImage: string | null = null;
  selectedFile: File | null = null;

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = (e) => {
        this.selectedImage = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  async uploadImage(): Promise<string> {
    if (!this.selectedFile) {
      throw new Error('No image selected.');
    }

    const fileName = this.selectedFile?.name;
    const storageRef = ref(this.storage, `recipes-images/${fileName}`);

    await uploadBytes(storageRef, this.selectedFile);

    try {
      return await getDownloadURL(storageRef);
    } catch (error: any) {
      console.error('Image not found: ', error);
      throw new Error(error);
    }
  }

  async onSubmit() {
    if (this.recipeForm.invalid || !this.selectedImage) return;

    try {
      const photoURL = await this.uploadImage();

      const recipe: Recipe = {
        ...this.recipeForm.value,
        userId: this.auth.currentUser()!.uid,
        photoURL: photoURL,
        createdAt: this.recipe()?.createdAt || new Date(),
        updatedAt: new Date(),
      } as Recipe;

      this.submitted.emit(recipe);
    } catch (error) {
      console.error('Error while sending recipe: ', error);
    }
  }
}
