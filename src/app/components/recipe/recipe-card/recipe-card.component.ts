import { Component, input, output } from '@angular/core';
import { Recipe } from '../../../models/recipe.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-recipe-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './recipe-card.component.html',
  styleUrl: './recipe-card.component.css',
})
export class RecipeCardComponent {
  recipe = input.required<Recipe>();
  showActions = input(false);
  onEdit = output<Recipe>();
  onDelete = output<Recipe>();
}
