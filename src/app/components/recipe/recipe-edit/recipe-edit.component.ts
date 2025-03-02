import { Component, inject, signal } from '@angular/core';
import { Recipe } from '../../../models/recipe.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { RecipesService } from '../../../services/recipes/recipes.service';
import { RecipeFormComponent } from '../recipe-form/recipe-form.component';

@Component({
  selector: 'app-recipe-edit',
  standalone: true,
  imports: [RecipeFormComponent],
  templateUrl: './recipe-edit.component.html',
})
export class RecipeEditComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private recipeService = inject(RecipesService);
  private auth = inject(AuthService);

  recipe = signal<Recipe | null>(null);
  error = signal<string | null>(null);

  ngOnInit() {
    this.route.params.subscribe(async (params) => {
      try {
        const recipe = (await this.recipeService.getRecipeById(
          params['id']
        )) as Recipe;

        if (!recipe) {
          this.error.set('Recipe not found');
          return;
        }

        // Check if user is authorized to edit this recipe
        if (
          !this.auth.currentUser() ||
          this.auth.currentUser()?.uid !== recipe.userId
        ) {
          this.error.set('You are not authorized to edit this recipe');
          return;
        }

        this.recipe.set(recipe);
      } catch (err) {
        console.error('Error fetching recipe:', err);
        this.error.set('An error occurred while loading the recipe');
      }
    });
  }

  async onSubmit(updatedRecipe: Recipe) {
    try {
      if (!this.recipe()) {
        throw new Error('No recipe loaded');
      }

      // Preserve the original ID and creation date
      const recipeToUpdate = {
        ...updatedRecipe,
        id: this.recipe()!.id,
        createdAt: this.recipe()!.createdAt,
        userId: this.recipe()!.userId,
      };

      await this.recipeService.updateRecipe(this.recipe()!.id!, recipeToUpdate);

      // Navigate back to recipe detail view
      await this.router.navigate(['/recipe', this.recipe()!.id]);
    } catch (err) {
      console.error('Error updating recipe:', err);
      this.error.set('An error occurred while updating the recipe');
    }
  }

  onCancel() {
    if (this.recipe()) {
      this.router.navigate(['/recipe', this.recipe()!.id]);
    } else {
      this.router.navigate(['/my-recipes']);
    }
  }
}
