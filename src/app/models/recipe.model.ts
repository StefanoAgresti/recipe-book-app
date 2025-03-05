export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  photoURL: string;
  imagePath: string;
  userId: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}
