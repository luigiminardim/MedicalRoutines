import { Category } from "../entities/Category";

export interface ICategoriesRepository {
  getCategories(): Promise<Array<Category>>;
}
