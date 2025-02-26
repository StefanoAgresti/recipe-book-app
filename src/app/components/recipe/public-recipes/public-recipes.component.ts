import { Component, inject, OnInit, signal } from '@angular/core';
import { RecipeCardComponent } from '../recipe-card/recipe-card.component';
import { RecipesService } from '../../../services/recipes/recipes.service';
import { Recipe } from '../../../models/recipe.model';

@Component({
  selector: 'app-public-recipes',
  standalone: true,
  imports: [RecipeCardComponent],
  templateUrl: './public-recipes.component.html',
  styleUrl: './public-recipes.component.css',
})
export class PublicRecipesComponent implements OnInit {
  private recipeService = inject(RecipesService);
  recipes = signal<Recipe[]>([]);

  ngOnInit(): void {
    this.loadRecipes();
  }

  async loadRecipes() {
    try {
      const recipes = await this.recipeService.getPublicRecipes();

      this.recipes.set(recipes);
    } catch (error) {
      console.log('Error loading recipes: ', error);
    }
  }
}
