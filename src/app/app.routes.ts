import { SignupComponent } from './components/auth/signup/signup.component';
import { LoginComponent } from './components/auth/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { MyRecipesComponent } from './components/recipe/my-recipes/my-recipes.component';
import { PublicRecipesComponent } from './components/recipe/public-recipes/public-recipes.component';
import { RecipeDetailComponent } from './components/recipe/recipe-detail/recipe-detail.component';
import { RecipeEditComponent } from './components/recipe/recipe-edit/recipe-edit.component';

import { Routes } from '@angular/router';
import {
  canActivate,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/compat/auth-guard';
import { RecipeNewComponent } from './components/recipe/recipe-new/recipe-new.component';

const redirectLoggedInToHome = () => redirectLoggedInTo(['home']);
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'signup',
    component: SignupComponent,
    ...canActivate(redirectLoggedInToHome),
  },
  {
    path: 'login',
    component: LoginComponent,
    ...canActivate(redirectLoggedInToHome),
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'my-recipes',
    component: MyRecipesComponent,
    ...canActivate(redirectUnauthorizedToLogin),
  },
  { path: 'public-recipes', component: PublicRecipesComponent },

  {
    path: 'recipe/new',
    component: RecipeNewComponent,
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: 'recipe/:id',
    component: RecipeDetailComponent,
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: 'recipe/:id/edit',
    component: RecipeEditComponent,
    ...canActivate(redirectUnauthorizedToLogin),
  },
];
