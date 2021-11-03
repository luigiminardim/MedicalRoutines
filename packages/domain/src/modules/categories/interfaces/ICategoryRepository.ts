import { Category } from "../entities/Category";

export interface ICategoryRepository {
  getCategories(): Promise<Array<Category>>;
}
