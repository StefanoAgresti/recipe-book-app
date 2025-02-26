import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { RecipeCardComponent } from '../recipe/recipe-card/recipe-card.component';
import { Recipe } from '../../models/recipe.model';
import { RecipesService } from '../../services/recipes/recipes.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, RecipeCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  auth = inject(AuthService);
  recipeService = inject(RecipesService);

  featuredRecipes = signal<Recipe[]>([]);

  constructor() {
    effect(() => {
      console.log(this.auth.currentUser());
    });
  }

  ngOnInit(): void {
    this.loadFeaturedRecipes();
  }

  private async loadFeaturedRecipes() {
    try {
      // get the latest 6 public recipes
      const recipes = await this.recipeService.getPublicRecipes();

      this.featuredRecipes.set(recipes.slice(0, 6));
    } catch (error) {
      console.error('Error loading featured recipes: ', error);
    }
  }

  getLatestActivity() {
    const totalRecipes = this.featuredRecipes().length;
    if (totalRecipes > 0) {
      return `${totalRecipes} new recipes added recently.`;
    }
    return 'Start creating your first recipe!';
  }
}
