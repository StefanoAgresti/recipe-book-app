import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipesService } from '../../../services/recipes/recipes.service';
import { AuthService } from '../../../services/auth/auth.service';
import { Recipe } from '../../../models/recipe.model';

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [],
  templateUrl: './recipe-detail.component.html',
  styleUrl: './recipe-detail.component.css',
})
export class RecipeDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private recipeService = inject(RecipesService);
  private auth = inject(AuthService);

  recipe = signal<Recipe | null>(null);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.route.params.subscribe(async (params) => {
      try {
        const recipe = await this.recipeService.getRecipeById(params['id']);

        if (!recipe) {
          this.error.set('Recipe not found');
          return;
        }

        if (
          !recipe.isPublic &&
          (!this.auth.currentUser ||
            this.auth.currentUser()?.uid !== recipe.userId)
        ) {
          this.error.set('You are not authorized to view this recipe');
          return;
        }

        this.recipe.set(recipe);
      } catch (error) {
        console.error('Error fetching recipe: ', error);
        this.error.set('An error occurred while loading the recipe');
      }
    });
  }

  isOwner() {
    return this.auth.currentUser()?.uid === this.recipe()?.userId;
  }

  onEdit() {
    if (this.recipe()) {
      this.router.navigate([`/recipe/${this.recipe()?.id}/edit`]);
    }
  }

  async onDelete() {
    if (
      this.recipe() &&
      confirm('Are you sure you want to delete this recipe?')
    ) {
      try {
        await this.recipeService.deleteRecipe(this.recipe()!.id);
        this.router.navigate(['/my-recipes']);
      } catch (error) {
        console.error('Error deleting recipe: ', error);
        this.error.set('An error occurred while deleting the recipe.');
      }
    }
  }
}
