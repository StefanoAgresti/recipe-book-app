import {
  Component,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Recipe } from '../../../models/recipe.model';
import { AuthService } from '../../../services/auth/auth.service';
import { ImageUploadComponent } from '../../image-upload/image-upload.component';

@Component({
  selector: 'app-recipe-form',
  standalone: true,
  imports: [ReactiveFormsModule, ImageUploadComponent],
  templateUrl: './recipe-form.component.html',
})
export class RecipeFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);

  recipe = input<Recipe | null>();
  submitted = output<Recipe>();
  imagePath = signal<string>('');

  recipeForm = this.fb.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    photoURL: [''],
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
        photoURL: this.recipe()?.photoURL,
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

  handleImageUpload(photoURL: string) {
    this.recipeForm.get('photoURL')?.setValue(photoURL);
  }

  handleImagePath(imagePath: string) {
    this.imagePath.set(imagePath);
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

  async onSubmit() {
    if (this.recipeForm.invalid) return;

    try {
      const recipe: Recipe = {
        ...this.recipeForm.value,
        userId: this.auth.currentUser()!.uid,
        createdAt: this.recipe()?.createdAt || new Date(),
        updatedAt: new Date(),
        imagePath: this.imagePath(),
      } as Recipe;

      this.submitted.emit(recipe);
    } catch (error) {
      console.error('Error while sending recipe: ', error);
    }
  }
}
