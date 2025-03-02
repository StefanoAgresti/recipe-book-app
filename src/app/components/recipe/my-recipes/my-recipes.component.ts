import { Component, effect, inject, Signal, signal } from '@angular/core';
import { Recipe } from '../../../models/recipe.model';
import { RecipesService } from '../../../services/recipes/recipes.service';
import { AuthService } from '../../../services/auth/auth.service';
import { RecipeCardComponent } from '../recipe-card/recipe-card.component';
import { User } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-recipes',
  standalone: true,
  imports: [RecipeCardComponent],
  templateUrl: './my-recipes.component.html',
})
export class MyRecipesComponent {
  private recipeService = inject(RecipesService);
  private authService = inject(AuthService);
  private router = inject(Router);

  recipes = signal<Recipe[]>([]);
  currentUser: Signal<User | null> = this.authService.currentUser;

  private userEffect = effect(() => {
    if (this.currentUser()) {
      this.loadRecipes();
    }
  });

  async loadRecipes() {
    const user = this.currentUser();
    if (user) {
      try {
        const recipes = await this.recipeService.getUserRecipes(user.uid);
        this.recipes.set(recipes);
      } catch (error) {
        console.error('Error loading recipes:', error);
      }
    } else {
      console.error('No user found');
    }
  }

  onCreateRecipe() {
    this.router.navigate(['/recipe/new']);
  }

  navigateToEdit(recipe: Recipe) {
    if (recipe.id) {
      this.router.navigate(['/recipe', recipe.id, 'edit']);
    }
  }

  async deleteRecipe(recipe: Recipe) {
    if (recipe.id && confirm('Are you sure you want to delete this recipe?')) {
      await this.recipeService.deleteRecipe(recipe.id);
      await this.loadRecipes();
    }
  }
}
