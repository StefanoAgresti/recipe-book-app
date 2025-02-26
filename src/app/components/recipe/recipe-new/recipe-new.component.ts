import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { RecipeFormComponent } from '../recipe-form/recipe-form.component';
import { RecipesService } from '../../../services/recipes/recipes.service';
import { Recipe } from '../../../models/recipe.model';

@Component({
  selector: 'app-recipe-new',
  standalone: true,
  imports: [RecipeFormComponent],
  templateUrl: './recipe-new.component.html',
  styleUrl: './recipe-new.component.css',
})
export class RecipeNewComponent {
  router = inject(Router);
  recipeService = inject(RecipesService);

  async createRecipe(recipe: Recipe) {
    try {
      await this.recipeService.createRecipe(recipe);
      this.router.navigate(['/my-recipes']);
    } catch (error) {
      console.error(error);
    }
  }

  onCancel() {
    this.router.navigate(['/my-recipes']);
  }
}
